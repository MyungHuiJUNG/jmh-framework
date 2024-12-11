package com.wecoms24.flow.counsel.notice;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.aspectj.lang.annotation.AfterReturning;
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
import com.wecoms24.flow.user.UserSearchParameter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
public class NoticeAspect {

	@Autowired
	private RedisProperties redisProperties;
	
	@Autowired
	private FlowRedisMessagePublisher publisher;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private NotificationDao notificationDao;
	
	@AfterReturning(pointcut = "execution(* com.wecoms24.flow.counsel.notice.NoticeServiceImpl.regist(..)) && args(loginUser, entity)", returning = "result")
    public void checkTaskRequestState(User loginUser, Notice entity, Notice result) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String jsonString = objectMapper.writeValueAsString(result);
			String message = "[공지사항] " + result.getTitle() + "이 등록되었습니다.";
			FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
					.receiverType(FlowWebSocketReceiverType.ALL_USERS)
					.sender(loginUser)
					.sendTime(new Date())
					.className(Notice.class.getName())
					.jsonStringContent(jsonString)
					.message(message)
					.build();
			
			String flowWebSocketMessageJsonString = objectMapper.writeValueAsString(flowWebSocketMessage);
			if (redisProperties.getBroadcaster().isEnable() && publisher != null) {
				publisher.publish(FlowAppConstants.REDIS_TOPIC_REGIST_NOTICE, flowWebSocketMessageJsonString);
			} else {
				messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_REGIST_NOTICE, flowWebSocketMessageJsonString);
			}
			
			registNotification(loginUser, flowWebSocketMessage);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
    }
	
	private void registNotification(User loginUser, FlowWebSocketMessage flowWebSocketMessage) {
		List<Notification> notifications = new ArrayList<>();
		List<User> users = userDao.find(new UserSearchParameter());
		for (User user : users) {
			if (Objects.equals(flowWebSocketMessage.getSender().getEntityId(), user.getEntityId()))
				continue;
			
			Notification notification = new Notification();
			notification.setTypeCode(FlowAppConstants.NOTIFICATION_TYPE_NOTICE);
			notification.setSubTypeCode(FlowAppConstants.NOTIFICATION_SUB_TYPE_NOTICE);
			notification.setSender(flowWebSocketMessage.getSender());
			notification.setSendTime(flowWebSocketMessage.getSendTime());
			notification.setReceiver(user);
			notification.setClassName(Notice.class.getName());
			notification.setJsonStringContent(flowWebSocketMessage.getJsonStringContent());
			notification.setMessage(flowWebSocketMessage.getMessage());
			notification.setIsRead(false);
			
			notifications.add(notification);
		}
		notificationDao.createAll(loginUser, notifications);
	}
}
