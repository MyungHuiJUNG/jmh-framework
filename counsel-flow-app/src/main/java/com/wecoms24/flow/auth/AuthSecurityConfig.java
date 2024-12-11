package com.wecoms24.flow.auth;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.*;
import com.wecoms24.flow.core.redis.RedisProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class AuthSecurityConfig {
	
	private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final RedisProperties redisProperties;
    private final Optional<RedisTemplate<String, String>> redisTemplate;
    private final JwtTokenStoreService jwtTokenStoreService;
    
    
    @Value(FlowAppConstants.SECURITY_ANT_MACHERS_YAML_KEY)
    private String antMatchers;
    
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.addAllowedOriginPattern(FlowAppConstants.ASTERISK);
		configuration.addAllowedHeader(FlowAppConstants.ASTERISK);
		configuration.addAllowedMethod(FlowAppConstants.ASTERISK);
		configuration.addExposedHeader(FlowAppConstants.ASTERISK);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration(FlowAppConstants.ALL_ASTERISK, configuration);
		return source;
	}
	
	@Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.httpBasic(HttpBasicConfigurer::disable)
			.csrf(CsrfConfigurer::disable)
			.cors(AbstractHttpConfigurer::disable)
            .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .exceptionHandling((exceptionHandling) -> exceptionHandling
            		.authenticationEntryPoint(jwtAuthenticationEntryPoint)
            		.accessDeniedHandler(jwtAccessDeniedHandler)
        		)
            .addFilterBefore(new JwtTokenFilter(jwtTokenProvider, redisProperties, redisTemplate, jwtTokenStoreService), UsernamePasswordAuthenticationFilter.class);

		resourcesRequest(http);
		configureAuthorizeRequest(http);
		
		return http.build();
	}
	
	@Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
	
	@Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
	
	private void resourcesRequest(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests(auth -> {
			auth.requestMatchers(FlowAppConstants.INDEX_HTML, FlowAppConstants.FAVICON, FlowAppConstants.EMPTY_PATH, "/view/**", FlowAppConstants.LOGIN_PATH, FlowAppConstants.ALL_RESOURCE_ASSETS, FlowAppConstants.ALL_RESOURCE_ICONS, FlowAppConstants.ALL_RESOURCE_CSS, FlowAppConstants.ALL_RESOURCE_IMAGES, FlowAppConstants.ALL_RESOURCE_JS).permitAll();
		});
	}
	
	private void configureAuthorizeRequest(HttpSecurity http) throws Exception {
		if (antMatchers != null && !antMatchers.isEmpty()) {
			final String httpMethodRegex = FlowAppConstants.ALL_METHODS_REG_EXP;
			String[] splitAntMatchers = antMatchers.split(FlowAppConstants.COMMA);
			
			for (String antMatcherValues : splitAntMatchers) {
				http.authorizeHttpRequests(auth -> {
					String url = null;
					String[] splitAntMatcherValue = antMatcherValues.split(FlowAppConstants.COLON);
					List<HttpMethod> methods = new ArrayList<HttpMethod>();
					for (String antMatcherValue : splitAntMatcherValue) {
						if (antMatcherValue.matches(httpMethodRegex)) {
							methods.add(HttpMethod.valueOf(antMatcherValue.trim()));
						} else {
							url = antMatcherValue.trim();
						}
					}
					
					if (methods.isEmpty()) {
						auth.requestMatchers(url).permitAll();
					} else {
						for (HttpMethod method : methods) {
							auth.requestMatchers(method, url).permitAll();
						}
					}
				});
			}
		}
		
		http.authorizeHttpRequests(auth -> 
			auth.anyRequest().authenticated()
        );
	}
}
