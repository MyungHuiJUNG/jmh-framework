package com.wecoms24.flow.auth;

import com.wecoms24.flow.auth.jwt.JwtToken;

public interface AuthService {
	JwtToken loginProcess(String id, String password, String clientIpAddress);
	void logoutProcess(String toke, String clientIpAddress);
	boolean validateTokenProcess(String token);
	JwtToken refreshTokenProcess(String refreshToken, String clientIpAddress);
}
