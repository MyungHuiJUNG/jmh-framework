package com.wecoms24.flow.core.websocket;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.auth.jwt.TokenType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	private final JwtTokenProvider jwtTokenProvider;
	
	@Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint(FlowAppConstants.WEBSOCKET_PATH).setAllowedOriginPatterns(FlowAppConstants.ASTERISK).withSockJS();
//        registry.addEndpoint(FlowAppConstants.WEBSOCKET_PATH).setAllowedOriginPatterns(FlowAppConstants.ASTERISK);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
    	registry.setApplicationDestinationPrefixes(FlowAppConstants.WEBSOCKET_PREFIX_PATH);
        registry.enableSimpleBroker(FlowAppConstants.WEBSOCKET_BROCKER_TOPIC, FlowAppConstants.WEBSOCKET_BROCKER_QUEUE);
    }
    
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                assert accessor != null;
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {

                    String authorizationHeader = accessor.getFirstNativeHeader(FlowAppConstants.AUTHORIZATION_HEADER_KEY);
                    assert authorizationHeader != null;
                    String token = authorizationHeader.substring(7);

                    Authentication authentication = jwtTokenProvider.getAuthentication(TokenType.ACCESS, token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    accessor.setUser(authentication);
                }

                return message;
            }

        });
    }
}
