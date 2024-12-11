package com.wecoms24.flow.auth;

import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtToken;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebController;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserJsonView;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping(FlowAppConstants.REST_API_AUTH)
@RequiredArgsConstructor
public class AuthController extends BaseWebController {
	private final AuthService authService;
	private final JwtTokenProvider jwtTokenProvider;

	@PostMapping(value = "/login", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
    public JwtToken userLoginByMessage(HttpServletRequest request, @RequestBody User user) {
		String clientIpAddress = getClientIpAddress(request);
        return authService.loginProcess(user.getId(), user.getPassword(), clientIpAddress);
    }
	
	@PostMapping(value = "/login", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
    public JwtToken userLoginByFomAndQueryParam(HttpServletRequest request, User user) {
		String clientIpAddress = getClientIpAddress(request);
        return authService.loginProcess(user.getId(), user.getPassword(), clientIpAddress);
    }
	
	@PostMapping(value = "/logout", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.TEXT_PLAIN_VALUE})
    public void userLogoutByMessage(HttpServletRequest request) {
    	String token =jwtTokenProvider.resolveAccessToken(request);
    	String clientIpAddress = getClientIpAddress(request);
        authService.logoutProcess(token, clientIpAddress);
    }
	
    @PostMapping(value = "/logout", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.TEXT_PLAIN_VALUE})
    public void userLogoutByFomAndQueryParam(HttpServletRequest request) {
    	String token =jwtTokenProvider.resolveAccessToken(request);
    	String clientIpAddress = getClientIpAddress(request);
        authService.logoutProcess(token, clientIpAddress);
    }
    
    @PostMapping(value = "/check-token", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE})
    public boolean checkLoginByMessage(HttpServletRequest request) {
    	String token = jwtTokenProvider.resolveAccessToken(request);
        return authService.validateTokenProcess(token);
    }

    @PostMapping(value = "/check-token", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE})
    public boolean checkLoginByFomAndQueryParam(HttpServletRequest request) {
    	String token = jwtTokenProvider.resolveAccessToken(request);
        return authService.validateTokenProcess(token);
    }
    
    @JsonView({ UserJsonView.UserSingleEntityView.class })
    @GetMapping(value = "/login-info",  produces = { MediaType.APPLICATION_JSON_VALUE })
	public User getOneBySearchParam(HttpServletRequest request) {
		return getLoginUser();
	}
    
    @PostMapping(value = "/token", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
    public JwtToken refreshAccessTokenByMessage(HttpServletRequest request, @RequestBody Map<String, String> body) {
        String refreshToken = body.get(FlowAppConstants.KEY_REFRESH_TOKEN);
        String clientIpAddress = getClientIpAddress(request);
        return authService.refreshTokenProcess(refreshToken, clientIpAddress);
    }
    
    @PostMapping(value = "/token", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
    public JwtToken refreshAccessTokenByFomAndQueryParam(HttpServletRequest request, @RequestParam Map<String, String> body) {
    	String refreshToken = body.get(FlowAppConstants.KEY_REFRESH_TOKEN);
    	String clientIpAddress = getClientIpAddress(request);
        return authService.refreshTokenProcess(refreshToken, clientIpAddress);
    }
    
	private User getLoginUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof AuthUserDetails) {
        	AuthUserDetails userDetails = (AuthUserDetails) authentication.getPrincipal();
            return userDetails.getUser();
        }
        
        return null;
	}
	
	private String getClientIpAddress(HttpServletRequest request) {
	    String ip = request.getHeader(FlowAppConstants.HEADER_KEY_X_FORWARDED_FOR);

	    if (ip == null) {
	        ip = request.getHeader(FlowAppConstants.HEADER_KEY_PROXY_CLIENT_IP);
	    }
	    if (ip == null) {
	        ip = request.getHeader(FlowAppConstants.HEADER_KEY_WL_PROXY_CLIENT_IP);
	    }
	    if (ip == null) {
	        ip = request.getHeader(FlowAppConstants.HEADER_KEY_HTTP_CLIENT_IP);
	    }
	    if (ip == null) {
	        ip = request.getHeader(FlowAppConstants.HEADER_KEY_HTTP_X_FORWARDED);
	    }
	    if (ip == null) {
	        ip = request.getRemoteAddr();
	    }
	    
	    if (ip != null && FlowAppConstants.LOCALHOST_IPV6.equals(ip))
	    	ip = FlowAppConstants.LOCALHOST_IPV4;

	    return ip;
	}
}
