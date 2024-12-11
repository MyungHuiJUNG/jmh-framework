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
@JsonDeserialize(builder = TicketStatisticsByCounselTypeData.TicketStatisticsByCounselTypeDataBuilder.class)
public class TicketStatisticsByCounselTypeData {
	private Date fromDate;
	private Date toDate;
	private String counselTypeCodePath;
	private String counselTypeCodeLarge;
	private String counselTypeCodeMedium;
	private String counselTypeCodeSmall;
	
	private Integer totalTicketCount;
	private Integer unprocessedTicketCount;
	private Integer inProcessTicketCount;
	private Integer completedTicketCount;
	private Integer transmitTicketCount;
	
	@JsonPOJOBuilder(withPrefix = "")
	public static class TicketStatisticsByCounselTypeDataBuilder {
	}
}
