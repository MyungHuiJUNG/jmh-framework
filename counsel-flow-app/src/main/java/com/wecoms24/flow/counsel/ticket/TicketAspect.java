package com.wecoms24.flow.counsel.ticket;

import java.util.Date;
import java.util.Objects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

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
import com.wecoms24.flow.user.UserDao;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
public class TicketAspect {

	@Autowired
	private RedisProperties redisProperties;
	
	@Autowired
	private FlowRedisMessagePublisher publisher;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private TicketDao ticketDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private NotificationDao notificationDao;
	
	@Around("execution(* com.wecoms24.flow.counsel.ticket.TicketServiceImpl.update(..)) && args(loginUser, entity)")
    public Object captureBeforeAndAfter(ProceedingJoinPoint joinPoint, User loginUser, Ticket entity) throws Throwable {
		Ticket beforeUpdateTicket = ticketDao.findOneByEntityId(entity.getEntityId());
		Long previousManagerEntityId = beforeUpdateTicket.getManager() != null ? beforeUpdateTicket.getManager().getEntityId() : null;
		
        Object result = joinPoint.proceed();
        Ticket afterUpdateTicket = (Ticket) result;
        Long afterManagerEntityId = afterUpdateTicket.getManager() != null ? afterUpdateTicket.getManager().getEntityId() : null;
        if (previousManagerEntityId == null || afterManagerEntityId == null)
        	return result;
        
        if (!Objects.equals(previousManagerEntityId, afterManagerEntityId)) {
    		try {
    			ObjectMapper objectMapper = new ObjectMapper();
    			User newUser = userDao.findOneByEntityId(afterUpdateTicket.getManager().getEntityId());
				String jsonString = objectMapper.writeValueAsString(afterUpdateTicket);
				String message = "[" + loginUser.getName() + "] 님으로부터 상담티켓이 이관되었습니다.";
				
				FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USER)
						.sender(loginUser)
						.sendTime(new Date())
						.receiver(newUser)
						.className(Ticket.class.getName())
						.jsonStringContent(jsonString)
						.message(message)
						.build();
				
				String flowWebSocketMessageJsonString = objectMapper.writeValueAsString(flowWebSocketMessage);
				
				if (redisProperties.getBroadcaster().isEnable() && publisher != null) {
					publisher.publish(FlowAppConstants.REDIS_TOPIC_TRANSMIT_TICKET, flowWebSocketMessageJsonString);
				} else {
					messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_TRANSMIT_TICKET + "/" + newUser.getId(), objectMapper.writeValueAsString(flowWebSocketMessage));
				}
				
				registNotification(loginUser, flowWebSocketMessage);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
        }
        
        return result;
    }

	private void registNotification(User loginUser, FlowWebSocketMessage flowWebSocketMessage) {
		Notification notification = new Notification();
		notification.setTypeCode(FlowAppConstants.NOTIFICATION_TYPE_TICKET);
		notification.setSubTypeCode(FlowAppConstants.NOTIFICATION_SUB_TYPE_TRANSMIT_TICKET);
		notification.setSender(flowWebSocketMessage.getSender());
		notification.setSendTime(flowWebSocketMessage.getSendTime());
		notification.setReceiver(flowWebSocketMessage.getReceiver());
		notification.setClassName(Ticket.class.getName());
		notification.setJsonStringContent(flowWebSocketMessage.getJsonStringContent());
		notification.setMessage(flowWebSocketMessage.getMessage());
		notification.setIsRead(false);
		notificationDao.create(loginUser, notification);
	}
}
