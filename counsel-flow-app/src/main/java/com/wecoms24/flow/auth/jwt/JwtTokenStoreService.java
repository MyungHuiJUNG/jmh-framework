package com.wecoms24.flow.auth.jwt;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class JwtTokenStoreService {
	private final ConcurrentHashMap<String, String> tokenStore = new ConcurrentHashMap<>();
	private final ConcurrentHashMap<String, Long> blackListStore = new ConcurrentHashMap<>();

	public void addStoreToken(String key, String token) {
		tokenStore.put(key, token);
	}

	public String getToken(String key) {
		return tokenStore.get(key);
	}

	public void removeToken(String key) {
		tokenStore.remove(key);
	}

	public void addStoreBlackListToken(String token, Long expiration) {
		blackListStore.put(token, expiration);
	}

	public boolean isBlackListed(String accessToken) {
		if (blackListStore.containsKey(accessToken)) {
			long expirationTime = blackListStore.get(accessToken);
			if (System.currentTimeMillis() > expirationTime) {
				blackListStore.remove(accessToken);
				return false;
			}
			return true;
		}
		return false;
	}

	public void removeExpiredTokens() {
		long now = System.currentTimeMillis();
		blackListStore.entrySet().removeIf(entry -> entry.getValue() < now);
	}
}
