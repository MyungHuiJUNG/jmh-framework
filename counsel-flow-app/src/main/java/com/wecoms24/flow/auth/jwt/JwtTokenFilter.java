package com.wecoms24.flow.auth.jwt;

import java.io.IOException;
import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.redis.RedisProperties;

import jakarta.annotation.Nullable;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {
	private final JwtTokenProvider jwtTokenProvider;
	private final RedisProperties redisProperties;
	private final Optional<RedisTemplate<String, String>> redisTemplate;
	private final JwtTokenStoreService jwtTokenStoreService;
	
	public JwtTokenFilter(JwtTokenProvider jwtTokenProvider, @Nullable RedisProperties redisProperties, Optional<RedisTemplate<String, String>> redisTemplate, JwtTokenStoreService jwtTokenStoreService) {
		this.jwtTokenProvider = jwtTokenProvider;
		this.redisProperties = redisProperties;
		this.redisTemplate = redisTemplate;
		this.jwtTokenStoreService = jwtTokenStoreService;
	}
	
	@Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = jwtTokenProvider.resolveAccessToken(request);

        if (StringUtils.hasText(accessToken) && jwtTokenProvider.validateToken(TokenType.ACCESS, accessToken)) {
            boolean isTokenBlacklisted = false;

            if (redisProperties != null && redisProperties.isEnable() && redisTemplate.isPresent() && redisTemplate.get() != null) {
                String logOut = redisTemplate.get().opsForValue().get(FlowAppConstants.PREFIX_KEY_BLACKLIST_TOKEN + accessToken);
                if (!ObjectUtils.isEmpty(logOut)) {
                    isTokenBlacklisted = true;
                }
            } else {
                isTokenBlacklisted = jwtTokenStoreService.isBlackListed(accessToken);
            }

            if (!isTokenBlacklisted) {
                Authentication auth = jwtTokenProvider.getAuthentication(TokenType.ACCESS, accessToken);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }
}
