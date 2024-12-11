package com.wecoms24.flow.core.websocket;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FlowRedisMessageSubscriber implements MessageListener {
	
	private List<FlowRedisMessageListener> flowRedisMessageListeners;
	
	@Override
	public void onMessage(Message message, byte[] pattern) {
		if (flowRedisMessageListeners == null || flowRedisMessageListeners.isEmpty())
			return;
		
		try {
			String topic = (pattern != null) ? new String(pattern) : "unknown";
			String messageBody = new String(message.getBody());
			ObjectMapper objectMapper = new ObjectMapper();
			FlowWebSocketMessage webSocketMessage = objectMapper.readValue(messageBody, FlowWebSocketMessage.class);
			for(FlowRedisMessageListener flowRedisMessageListener : flowRedisMessageListeners) {
				flowRedisMessageListener.onMessageByRedis(topic, webSocketMessage);
			}
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}

	public List<FlowRedisMessageListener> getFlowRedisMessageListeners() {
		return flowRedisMessageListeners;
	}

	public void setFlowRedisMessageListeners(List<FlowRedisMessageListener> flowRedisMessageListeners) {
		this.flowRedisMessageListeners = flowRedisMessageListeners;
	}
	
	public void addFlowRedisMessageListeners(FlowRedisMessageListener flowRedisMessageListener) {
		if (flowRedisMessageListeners == null)
			flowRedisMessageListeners = new ArrayList<>();
		
		flowRedisMessageListeners.add(flowRedisMessageListener);
	}
	
	public void removeFlowRedisMessageListeners(FlowRedisMessageListener flowRedisMessageListener) {
		if (flowRedisMessageListeners == null)
			return;
		
		flowRedisMessageListeners.remove(flowRedisMessageListener);
	}
}
