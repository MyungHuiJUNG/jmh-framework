package com.wecoms24.flow.counsel.ticket.callback;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
import com.wecoms24.flow.user.User;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
public class CallbackTicketAspect {

	@Autowired
	private RedisProperties redisProperties;
	
	@Autowired
	private FlowRedisMessagePublisher publisher;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private NotificationDao notificationDao;
	
	@AfterReturning(pointcut = "execution(* com.wecoms24.flow.counsel.ticket.callback.CallbackTicketServiceImpl.manualDistributeCallbackTicket(..)) && args(loginUser, searchParameter)", returning = "result")
    public void manualDistributeCallbackTicketAspect(User loginUser, CallbackTicketSearchParameter searchParameter, CallbackTicket result) {
		Date now = new Date();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			
			if (redisProperties.getBroadcaster().isEnable() && publisher != null) {
				List<CallbackTicket> callbackTickets = Arrays.asList(result);
				String jsonString = objectMapper.writeValueAsString(callbackTickets);
				
				FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USERS)
						.sender(loginUser)
						.sendTime(now)
						.className(List.class.getName())
						.jsonStringContent(jsonString)
						.build();
				
				String flowWebSocketMessageJsonString = objectMapper.writeValueAsString(flowWebSocketMessage);
				publisher.publish(FlowAppConstants.REDIS_TOPIC_CALLBACK_TICKET, flowWebSocketMessageJsonString);
			} else {
				String jsonString = objectMapper.writeValueAsString(result);
				String message = "[" + result.getTicket().getEntityId() + "] 콜백티켓이 할당 되었습니다.";
				FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USER)
						.receiver(result.getTicket().getManager())
						.className(CallbackTicket.class.getName())
						.sender(loginUser)
						.sendTime(now)
						.jsonStringContent(jsonString)
						.message(message)
						.build();
				
				String flowWebSocketMessageJsonString = objectMapper.writeValueAsString(flowWebSocketMessage);
				messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_CALLBACK_TICKET + "/" + result.getTicket().getManager().getId(), flowWebSocketMessageJsonString);
			}
			
			registNotification(objectMapper, loginUser, now, result);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}
	
	@Transactional
	private void registNotification(ObjectMapper objectMapper, User loginUser, Date sendTime, CallbackTicket result) {
		try {
			String message = "[" + result.getTicket().getEntityId() + "] 콜백티켓이 할당 되었습니다.";
			
			Notification notification = new Notification();
			notification.setTypeCode(FlowAppConstants.NOTIFICATION_TYPE_TICKET);
			notification.setSubTypeCode(FlowAppConstants.NOTIFICATION_SUB_TYPE_ASSIGN_CALLBACK);
			notification.setSender(loginUser);
			notification.setSendTime(sendTime);
			notification.setReceiver(result.getTicket().getManager());
			notification.setClassName(CallbackTicket.class.getName());
			notification.setJsonStringContent(objectMapper.writeValueAsString(result));
			notification.setMessage(message);
			notification.setIsRead(false);
			
			notificationDao.create(loginUser, notification);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}
}
