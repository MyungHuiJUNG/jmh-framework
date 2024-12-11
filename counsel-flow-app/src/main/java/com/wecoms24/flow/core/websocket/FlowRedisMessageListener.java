package com.wecoms24.flow.core.websocket;

public interface FlowRedisMessageListener {
	void onMessageByRedis(String topic, FlowWebSocketMessage webSocketMessage);
}
