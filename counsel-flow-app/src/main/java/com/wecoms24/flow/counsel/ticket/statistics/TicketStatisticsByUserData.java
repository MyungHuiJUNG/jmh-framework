package com.wecoms24.flow.counsel.ticket.statistics;

import java.util.Date;

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
@JsonDeserialize(builder = TicketStatisticsByUserData.TicketStatisticsByUserDataBuilder.class)
public class TicketStatisticsByUserData {
	private Date fromDate;
	private Date toDate;
	private Long userEntityId;
	private String userId;
	private String userName;
	private String ctiExtension;
	private Long organizationEntityId;
	private String organizationCodeLarge;
	private String organizationCodeMedium;
	private String organizationCodeSmall;
	private Integer totalTicketCount;
	private Integer unprocessedTicketCount;
	private Integer inProcessTicketCount;
	private Integer completedTicketCount;
	private Integer transmitTicketCount;

	@JsonPOJOBuilder(withPrefix = "")
	public static class TicketStatisticsByUserDataBuilder {
	}
}
