package com.wecoms24.flow.auth.jwt;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.AuthUserDetails;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.settings.valiable.SystemVariableDao;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider implements InitializingBean {
	@Value("${spring.jwt.accessKey}")
	private String accessKey;

	@Value("${spring.jwt.refreshKey}")
	private String refreshKey;

	private SecretKey accessSecretkey;

	private SecretKey refreshSecretkey;

	@Autowired
	private SystemVariableDao systemVariableDao;

	@Autowired
	private UserDetailsService authUserDetailsService;
	
	@Override
	public void afterPropertiesSet() {
		byte[] accessKeyBytes = Decoders.BASE64.decode(accessKey);
		this.accessSecretkey = Keys.hmacShaKeyFor(accessKeyBytes);

		byte[] refreshKeyBytes = Decoders.BASE64.decode(refreshKey);
		this.refreshSecretkey = Keys.hmacShaKeyFor(refreshKeyBytes);
	}

	public JwtToken generateToken(Authentication authentication) {
		AuthUserDetails userDetails = (AuthUserDetails) authentication.getPrincipal();
		Set<String> roles = new HashSet<>();
		userDetails.getAuthorities().forEach(grantedAuthority -> roles.add(grantedAuthority.getAuthority()));

		Date now = new Date();
		long baseExpirationTime = Long.parseLong(systemVariableDao.findOneByEntityId("base-expiration-time").getValue()) * 60 * 1000;
		long refreshExpirationTime = Long.parseLong(systemVariableDao.findOneByEntityId("refresh-expiration-time").getValue()) * 60 * 1000;

		JwtBuilder jwtBuilder = Jwts.builder().subject(authentication.getName());
		jwtBuilder.claim("auth", roles);

		Date accessTokenExpiresIn = new Date(now.getTime() + baseExpirationTime);
		String accessToken = jwtBuilder
								.issuedAt(now)
								.expiration(accessTokenExpiresIn)
								.signWith(accessSecretkey)
								.compact();

		Date refreshTokenExpiresIn = new Date(now.getTime() + refreshExpirationTime);
		String refreshToken = jwtBuilder
								.issuedAt(now)
								.expiration(refreshTokenExpiresIn)
								.signWith(refreshSecretkey)
								.compact();

		return JwtToken.builder()
				.grantType(FlowAppConstants.JWT_TYPE)
				.accessToken(accessToken)
				.accessExpirationTime(baseExpirationTime)
				.accessTokenExpiresIn(accessTokenExpiresIn)
				.refreshToken(refreshToken)
				.refreshExpirationTime(refreshExpirationTime)
				.refreshTokenExpiresIn(refreshTokenExpiresIn)
				.build();
	}

	public JwtToken refreshAccessToken(String refreshToken, String oldAccessToken) {
		if (!validateToken(TokenType.REFRESH, refreshToken)) {
			throw new FlowException(FlowErrorCode.INVALID_TOKEN);
		}
		

		Claims refreshClaims = parseClaims(TokenType.REFRESH, refreshToken);
		Date now = new Date();
		long extendExpirationTime = Long.parseLong(systemVariableDao.findOneByEntityId("extend-expiration-time").getValue()) * 60 * 1000;
		long refreshExpirationTime = Long.parseLong(systemVariableDao.findOneByEntityId("refresh-expiration-time").getValue()) * 60 * 1000;

		long originalIssueTime = refreshClaims.getIssuedAt().getTime();
		if ((originalIssueTime + refreshExpirationTime) < (now.getTime() + extendExpirationTime)) {
			throw new FlowException(FlowErrorCode.MAX_LOGIN_EXPIRATION_REACHED);
		}

		Claims oldAccessClaims = parseClaims(TokenType.ACCESS, oldAccessToken);
		Date oldAccessExpirationTime = oldAccessClaims.getExpiration();
		Date accessTokenExpiresIn = new Date(oldAccessExpirationTime.getTime() + extendExpirationTime);
		String accessToken = Jwts.builder()
								.issuedAt(now)
								.subject(refreshClaims.getSubject())
								.claim(FlowAppConstants.JWT_CLAIM_KEY, refreshClaims.get(FlowAppConstants.JWT_CLAIM_KEY))
								.expiration(accessTokenExpiresIn)
								.signWith(accessSecretkey)
								.compact();

		return JwtToken.builder()
				.grantType(FlowAppConstants.JWT_TYPE)
				.accessToken(accessToken)
				.accessExpirationTime(extendExpirationTime)
				.accessTokenExpiresIn(accessTokenExpiresIn)
				.refreshToken(refreshToken)
				.refreshExpirationTime(refreshExpirationTime)
				.refreshTokenExpiresIn(new Date(originalIssueTime + refreshExpirationTime))
				.build();
	}
	
	public Authentication getAuthentication(TokenType type, String token) {
		if (!validateToken(type, token)) {
	        throw new FlowException(FlowErrorCode.INVALID_TOKEN);
	    }
		
		UserDetails userDetails = authUserDetailsService.loadUserByUsername(getUsername(type, token));
		return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
	}

	public String getUsername(TokenType type, String token) {
		return parseClaims(type, token).getSubject();
	}

	public boolean validateToken(TokenType type, String token) {
		try {
			switch (type) {
				case ACCESS:
					Jwts.parser().verifyWith(accessSecretkey).build().parseSignedClaims(token);
					break;
					
				case REFRESH:
					Jwts.parser().verifyWith(refreshSecretkey).build().parseSignedClaims(token);
					break;
					
				default:
					throw new FlowException(FlowErrorCode.WRONG_TOKEN_TYPE);
			}
			
			return true;
		} catch (Exception e) {
			throw new FlowException(FlowErrorCode.INVALID_TOKEN);
		}
	}

	public Long getExpirationTimeOut(TokenType type, String token) {
		try {
			Long now = new Date().getTime();
			switch (type) {
				case ACCESS:
					Date accessExpiration = Jwts.parser()
							.verifyWith(accessSecretkey)
							.build()
							.parseSignedClaims(token)
							.getPayload()
							.getExpiration();
					
					return (accessExpiration.getTime() - now);
					
				case REFRESH:
					Date expiration = Jwts.parser()
						.verifyWith(refreshSecretkey)
						.build()
						.parseSignedClaims(token)
						.getPayload()
						.getExpiration();
			
					return (expiration.getTime() - now);
					
				default:
					throw new FlowException(FlowErrorCode.WRONG_TOKEN_TYPE);
			}
		} catch (ExpiredJwtException e) {
			throw new FlowException(FlowErrorCode.INVALID_TOKEN);
		}
		
		
	}

	public String resolveAccessToken(HttpServletRequest request) {
		String bearerToken = request.getHeader(FlowAppConstants.AUTHORIZATION_HEADER_KEY);
		if (bearerToken != null && bearerToken.startsWith(FlowAppConstants.JWT_TYPE + FlowAppConstants.EMPTY_STRING)) {
			return bearerToken.substring(7);
		}
		return null;
	}

	private Claims parseClaims(TokenType type, String token) {
		try {
			switch (type) {
				case ACCESS:
					return Jwts.parser().verifyWith(accessSecretkey).build().parseSignedClaims(token).getPayload();
					
				case REFRESH:
					return Jwts.parser().verifyWith(refreshSecretkey).build().parseSignedClaims(token).getPayload();
					
				default:
					throw new FlowException(FlowErrorCode.WRONG_TOKEN_TYPE);
			}
		} catch (ExpiredJwtException e) {
			throw new FlowException(FlowErrorCode.INVALID_TOKEN);
		}
	}
}
