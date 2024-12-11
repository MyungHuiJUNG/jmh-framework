package com.wecoms24.flow.auth.jwt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Builder
@Data
@AllArgsConstructor
public class JwtToken {
	private String grantType;
	private String accessToken;
	private long accessExpirationTime;
	private Date accessTokenExpiresIn;
	private String refreshToken;
    private long refreshExpirationTime;
    private Date refreshTokenExpiresIn;
}
