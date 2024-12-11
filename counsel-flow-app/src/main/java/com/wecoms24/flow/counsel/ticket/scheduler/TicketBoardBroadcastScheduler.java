package com.wecoms24.flow.counsel.ticket.scheduler;

import java.util.Date;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.core.websocket.FlowWebSocketReceiverType;
import com.wecoms24.flow.counsel.ticket.statistics.TicketStatisticsByUserData;
import com.wecoms24.flow.counsel.ticket.statistics.TicketStatisticsSearchParameter;
import com.wecoms24.flow.counsel.ticket.statistics.TicketStatisticsService;
import com.wecoms24.flow.user.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Component
@Slf4j
public class TicketBoardBroadcastScheduler {
	
	private final TicketStatisticsService ticketStatisticsService;
	private final SimpMessagingTemplate messagingTemplate;
	
	@Scheduled(cron = "*/10 * * * * *")
    @Transactional
    public void broadcastTicketBoardToUsers() {
		Date now = new Date();
		TicketStatisticsSearchParameter searchParameter = new TicketStatisticsSearchParameter();
		searchParameter.setFromDate(now);
		searchParameter.setToDate(now);
		List<TicketStatisticsByUserData> statisticsByUsers = ticketStatisticsService.statisticsByUser(searchParameter);
		for (TicketStatisticsByUserData statisticsByUser : statisticsByUsers) {
			try {
				ObjectMapper objectMapper = new ObjectMapper();
				String jsonString = objectMapper.writeValueAsString(statisticsByUser);
				
				User receiver = new User();
				receiver.setEntityId(statisticsByUser.getUserEntityId());
				receiver.setId(statisticsByUser.getUserId());
				receiver.setName(statisticsByUser.getUserName());
				receiver.setCtiExtension(statisticsByUser.getCtiExtension());
				
				FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USER)
						.receiver(receiver)
						.className(TicketStatisticsByUserData.class.getName())
						.sendTime(now)
						.jsonStringContent(jsonString)
						.build();
				
				messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_TICKET_BOARD + "/" + receiver.getId(), objectMapper.writeValueAsString(flowWebSocketMessage));
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
		}
	}
}
