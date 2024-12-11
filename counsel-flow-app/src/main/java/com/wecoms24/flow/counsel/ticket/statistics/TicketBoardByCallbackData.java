package com.wecoms24.flow.counsel.ticket.statistics;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;

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
@JsonDeserialize(builder = TicketBoardByCallbackData.TicketBoardByCallbackDataBuilder.class)
public class TicketBoardByCallbackData {
	private Long userEntityId;
	private String userId;
	private String userName;
	private Integer callbackTicketCount;
	
	@JsonPOJOBuilder(withPrefix = "")
	public static class TicketBoardByCallbackDataBuilder {
	}
}
