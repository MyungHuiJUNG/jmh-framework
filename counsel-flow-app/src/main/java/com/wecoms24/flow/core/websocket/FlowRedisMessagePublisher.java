package com.wecoms24.flow.core.websocket;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlowRedisMessagePublisher {
	private final RedisTemplate<String, Object> redisTemplate;
	
	public void publish(String topic, String message) {
        redisTemplate.convertAndSend(topic, message);
    }
}
