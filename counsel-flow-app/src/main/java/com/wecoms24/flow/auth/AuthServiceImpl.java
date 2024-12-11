package com.wecoms24.flow.auth;

import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.access.AccessLog;
import com.wecoms24.flow.auth.access.AccessLogDao;
import com.wecoms24.flow.auth.access.AccessType;
import com.wecoms24.flow.auth.jwt.JwtToken;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.auth.jwt.JwtTokenStoreService;
import com.wecoms24.flow.auth.jwt.TokenType;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.redis.RedisProperties;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserDao;

import jakarta.annotation.Nullable;

@Service
public class AuthServiceImpl implements AuthService {
	
	private final UserDao userDao;
	private final AccessLogDao accessLogDao;
	private final PasswordEncoder passwordEncoder;
	
    private final RedisProperties redisProperties;
	
    private final Optional<RedisTemplate<String, String>> redisTemplate;
	
    private final JwtTokenProvider jwtTokenProvider;
	
	private final JwtTokenStoreService jwtTokenStoreService;
	
	public AuthServiceImpl(UserDao userDao, AccessLogDao accessLogDao, PasswordEncoder passwordEncoder, @Nullable RedisProperties redisProperties, Optional<RedisTemplate<String, String>> redisTemplate, JwtTokenProvider jwtTokenProvider, JwtTokenStoreService jwtTokenStoreService) {
		this.userDao = userDao;
		this.accessLogDao = accessLogDao;
		this.passwordEncoder = passwordEncoder;
		this.redisProperties = redisProperties;
		this.redisTemplate = redisTemplate;
		this.jwtTokenProvider = jwtTokenProvider;
		this.jwtTokenStoreService = jwtTokenStoreService;
	}
	
	@Transactional
	@Override
	public JwtToken loginProcess(String id, String password, String clientIpAddress) {
		User user = userDao.findById(id);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new FlowException(FlowErrorCode.WRONG_AUTH_ID_OR_PASSWORD);
        }
        
        AuthUserDetails userDetails = new AuthUserDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        JwtToken token = jwtTokenProvider.generateToken(authentication);
        
        if (redisProperties != null && redisProperties.isEnable() && redisTemplate.isPresent()) {
        	redisTemplate.get().opsForValue().set(authentication.getName() + FlowAppConstants.SUFFIX_KEY_ACCESS_TOKEN + FlowAppConstants.COLON + clientIpAddress, token.getAccessToken(), jwtTokenProvider.getExpirationTimeOut(TokenType.ACCESS, token.getAccessToken()), TimeUnit.MILLISECONDS);
        	redisTemplate.get().opsForValue().set(authentication.getName() + FlowAppConstants.SUFFIX_KEY_REFRESH_TOKEN + FlowAppConstants.COLON + clientIpAddress, token.getRefreshToken(), jwtTokenProvider.getExpirationTimeOut(TokenType.REFRESH, token.getRefreshToken()), TimeUnit.MILLISECONDS);
        } else {
        	jwtTokenStoreService.addStoreToken(authentication.getName() + FlowAppConstants.SUFFIX_KEY_ACCESS_TOKEN + FlowAppConstants.COLON + clientIpAddress, token.getAccessToken());
        	jwtTokenStoreService.addStoreToken(authentication.getName() + FlowAppConstants.SUFFIX_KEY_REFRESH_TOKEN + FlowAppConstants.COLON + clientIpAddress, token.getRefreshToken());
        }
        
        saveManualAccessLog(AccessType.ACCESS_LOGIN, user, clientIpAddress);
        
        return token;
	}
	
	@Transactional
	@Override
	public void logoutProcess(String accessToken, String clientIpAddress) {
		Authentication authentication = jwtTokenProvider.getAuthentication(TokenType.ACCESS, accessToken);
		User user = userDao.findById(authentication.getName());
		
		if (redisProperties != null && redisProperties.isEnable() && redisTemplate.isPresent()) {
	        if (redisTemplate.get().opsForValue().get(authentication.getName() + FlowAppConstants.SUFFIX_KEY_ACCESS_TOKEN + FlowAppConstants.COLON + clientIpAddress) != null) {
	            redisTemplate.get().delete(authentication.getName() + FlowAppConstants.SUFFIX_KEY_ACCESS_TOKEN + FlowAppConstants.COLON + clientIpAddress);
	        }

	        Long expiration = jwtTokenProvider.getExpirationTimeOut(TokenType.ACCESS, accessToken);
	        redisTemplate.get().opsForValue().set(FlowAppConstants.PREFIX_KEY_BLACKLIST_TOKEN + accessToken, "logout", expiration, TimeUnit.MILLISECONDS);
	    } else {
	    	jwtTokenStoreService.removeToken(authentication.getName() + FlowAppConstants.SUFFIX_KEY_ACCESS_TOKEN + FlowAppConstants.COLON + clientIpAddress);
	    	jwtTokenStoreService.removeToken(authentication.getName() + FlowAppConstants.SUFFIX_KEY_REFRESH_TOKEN + FlowAppConstants.COLON + clientIpAddress);
	        long expiration = jwtTokenProvider.getExpirationTimeOut(TokenType.ACCESS, accessToken);
	        jwtTokenStoreService.addStoreBlackListToken(accessToken, System.currentTimeMillis() + expiration);
	    }
		
		saveManualAccessLog(AccessType.ACCESS_LOGOUT, user, clientIpAddress);
	}

	@Override
	public boolean validateTokenProcess(String accessToken) {
		if (!redisProperties.isEnable() || redisTemplate == null) {
			jwtTokenStoreService.removeExpiredTokens();
		}
		
		return jwtTokenProvider.validateToken(TokenType.ACCESS, accessToken);
	}

	@Override
	public JwtToken refreshTokenProcess(String refreshToken, String clientIpAddress) {
		String userId = jwtTokenProvider.getUsername(TokenType.REFRESH, refreshToken);
		User user = userDao.findById(userId);
		String oldAccessToken;
		if (redisProperties != null && redisProperties.isEnable() && redisTemplate.isPresent()) {
			oldAccessToken = redisTemplate.get().opsForValue().get(userId + FlowAppConstants.SUFFIX_KEY_ACCESS_TOKEN + FlowAppConstants.COLON + clientIpAddress);
		} else {
			oldAccessToken = jwtTokenStoreService.getToken(userId + FlowAppConstants.SUFFIX_KEY_ACCESS_TOKEN + FlowAppConstants.COLON + clientIpAddress);
		}
		
		if (oldAccessToken == null) {
			throw new FlowException(FlowErrorCode.UNABLE_RETRIEVE_TOKEN_INFO);
		}
		
		JwtToken newJwtToken = jwtTokenProvider.refreshAccessToken(refreshToken, oldAccessToken);
		if (redisProperties != null && redisProperties.isEnable() && redisTemplate.isPresent()) {
			redisTemplate.get().opsForValue().set(userId + FlowAppConstants.SUFFIX_KEY_ACCESS_TOKEN + FlowAppConstants.COLON + clientIpAddress, newJwtToken.getAccessToken(), jwtTokenProvider.getExpirationTimeOut(TokenType.ACCESS, newJwtToken.getAccessToken()), TimeUnit.MILLISECONDS);
			redisTemplate.get().opsForValue().set(FlowAppConstants.PREFIX_KEY_BLACKLIST_TOKEN + oldAccessToken, FlowAppConstants.TRUE_STRING_VALUE, jwtTokenProvider.getExpirationTimeOut(TokenType.ACCESS, oldAccessToken), TimeUnit.MILLISECONDS);
		} else {
			jwtTokenStoreService.addStoreBlackListToken(oldAccessToken, System.currentTimeMillis() + jwtTokenProvider.getExpirationTimeOut(TokenType.ACCESS, oldAccessToken));
			jwtTokenStoreService.removeExpiredTokens();
		}
		
		saveManualAccessLog(AccessType.ACCESS_RENEWAL, user, clientIpAddress);
		
        return newJwtToken;
	}
	
	private void saveManualAccessLog(AccessType accessType, User user, String clientIpAddress) {
		AccessLog accessLog = new AccessLog();
        accessLog.setAccessType(accessType);
        accessLog.setIsAutoAccess(false);
        accessLog.setUser(user);
        accessLog.setClientIpAddress(clientIpAddress);
        accessLog.setAccessDate(new Date());
        
        accessLogDao.create(accessLog);
	}
}
