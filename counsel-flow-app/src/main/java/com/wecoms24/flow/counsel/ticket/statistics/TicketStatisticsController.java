package com.wecoms24.flow.counsel.ticket.statistics;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecoms24.flow.core.template.controller.BaseWebController;

@RestController
@RequestMapping(value = "/rest/api/v1/ticket/statistics")
public class TicketStatisticsController extends BaseWebController {
	
	@Autowired
	private TicketStatisticsService ticketStatisticsService;
	
	@GetMapping(value = "/by-counsel-types", produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<TicketStatisticsByCounselTypeData> statisticsByCounselType( TicketStatisticsSearchParameter searchParameter) {
		return ticketStatisticsService.statisticsByCounselType(searchParameter);
	}
	
	@GetMapping(value = "/by-users", produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<TicketStatisticsByUserData> statisticsByUser( TicketStatisticsSearchParameter searchParameter) {
		return ticketStatisticsService.statisticsByUser(searchParameter);
	}
}
