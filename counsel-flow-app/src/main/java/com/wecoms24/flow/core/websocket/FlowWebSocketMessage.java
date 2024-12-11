package com.wecoms24.flow.core.websocket;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import com.wecoms24.flow.user.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonDeserialize(builder = FlowWebSocketMessage.FlowWebSocketMessageBuilder.class)
public class FlowWebSocketMessage {
	private FlowWebSocketReceiverType receiverType;
	private User sender;
	private User receiver;
	private List<User> receivers;
	private Date sendTime;
	private String className;
	private String jsonStringContent;
	private String title;
	private String message;
	
	@JsonPOJOBuilder(withPrefix = "")
    public static class FlowWebSocketMessageBuilder {
    }
}
