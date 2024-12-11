package com.wecoms24.flow.counsel.ticket.callback.scheduler;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.notification.Notification;
import com.wecoms24.flow.core.notification.NotificationDao;
import com.wecoms24.flow.core.redis.RedisProperties;
import com.wecoms24.flow.core.websocket.FlowRedisMessagePublisher;
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.core.websocket.FlowWebSocketReceiverType;
import com.wecoms24.flow.counsel.ticket.callback.CallbackTicket;
import com.wecoms24.flow.counsel.ticket.callback.CallbackTicketService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class CallbackDistributionScheduler {
	private final CallbackTicketService callbackTicketService;
	private final RedisProperties redisProperties;
	private final FlowRedisMessagePublisher publisher;
	private final SimpMessagingTemplate messagingTemplate;
	private final NotificationDao notificationDao;
	@Value("${com.wecoms24.flow.isMasterServer}")
    private Boolean isMasterServer;
	
	@Scheduled(cron = "0 */5 * * * *")
    @Transactional
	public void distributeCallbackTickets() {
		if (isMasterServer == false)
			return;
			
		Date now = new Date();
		try {
			List<CallbackTicket> autoDistributeCallbackTickets = callbackTicketService.autoDistributeCallbackTickets();
			if (autoDistributeCallbackTickets == null || autoDistributeCallbackTickets.isEmpty())
				return;
			
			ObjectMapper objectMapper = new ObjectMapper();
			if (redisProperties.getBroadcaster().isEnable() && publisher != null) {
				String jsonString = objectMapper.writeValueAsString(autoDistributeCallbackTickets);
				FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USERS)
						.sendTime(now)
						.className(List.class.getName())
						.jsonStringContent(jsonString)
						.build();
				
				String flowWebSocketMessageJsonString = objectMapper.writeValueAsString(flowWebSocketMessage);
				publisher.publish(FlowAppConstants.REDIS_TOPIC_CALLBACK_TICKET, flowWebSocketMessageJsonString);
			} else {
				for (CallbackTicket callbackTicket : autoDistributeCallbackTickets) {
					String jsonString = objectMapper.writeValueAsString(callbackTicket);
					String message = "[" + callbackTicket.getTicket().getEntityId() + "] 콜백티켓이 할당 되었습니다.";
					FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
							.receiverType(FlowWebSocketReceiverType.USER)
							.receiver(callbackTicket.getTicket().getManager())
							.className(CallbackTicket.class.getName())
							.sendTime(now)
							.jsonStringContent(jsonString)
							.message(message)
							.build();
					
					String flowWebSocketMessageJsonString = objectMapper.writeValueAsString(flowWebSocketMessage);
					messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_CALLBACK_TICKET + "/" + callbackTicket.getTicket().getManager().getId(), flowWebSocketMessageJsonString);
				}
			}
			
			registNotifications(autoDistributeCallbackTickets, now);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}
	
	private void registNotifications(List<CallbackTicket> autoDistributeCallbackTickets, Date now) {
		ObjectMapper objectMapper = new ObjectMapper();
		List<Notification> registTartgets = new ArrayList<>();
		for (CallbackTicket callbackTicket : autoDistributeCallbackTickets) {
			try {
				String jsonString = objectMapper.writeValueAsString(callbackTicket);
				String message = "[" + callbackTicket.getTicket().getEntityId() + "] 콜백티켓이 할당 되었습니다.";
				
				Notification notification = new Notification();
				notification.setTypeCode(FlowAppConstants.NOTIFICATION_TYPE_TICKET);
				notification.setSubTypeCode(FlowAppConstants.NOTIFICATION_SUB_TYPE_ASSIGN_CALLBACK);
				notification.setSendTime(now);
				notification.setReceiver(callbackTicket.getTicket().getManager());
				notification.setClassName(CallbackTicket.class.getName());
				notification.setJsonStringContent(jsonString);
				notification.setMessage(message);
				notification.setIsRead(false);
				
				registTartgets.add(notification);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
		}
		
		notificationDao.createAll(registTartgets);
	}
}
