package com.wecoms24.flow.core.notification;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.notification.message.Message;
import com.wecoms24.flow.core.notification.message.MessageDao;
import com.wecoms24.flow.core.notification.message.MessageType;
import com.wecoms24.flow.core.redis.RedisProperties;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.core.websocket.FlowRedisMessageListener;
import com.wecoms24.flow.core.websocket.FlowRedisMessagePublisher;
import com.wecoms24.flow.core.websocket.FlowRedisMessageSubscriber;
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.core.websocket.FlowWebSocketReceiverType;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserDao;
import com.wecoms24.flow.user.UserSearchParameter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Primary
public class NotificationServiceImpl extends AbstractBaseUserCrudEntityService<User, Notification, Long, NotificationDao, NotificationSearchParameter> implements NotificationService, FlowRedisMessageListener, InitializingBean {

	@Autowired
	private RedisProperties redisProperties;
	
	@Autowired
	private FlowRedisMessagePublisher publisher;
	
	@Autowired
	private FlowRedisMessageSubscriber subscriber;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private MessageDao messageDao;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		subscriber.addFlowRedisMessageListeners(this);
	}
	
	@Override
	public Notification regist(User loginUser, Notification entity) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Override
	public List<Notification> regist(User loginUser, List<Notification> entities) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}
	
	@Transactional
	@Override
	public Notification update(User loginUser, Notification entity) {
		if (entity.getIsRead())
			entity.setReadDate(new Date());
		
		return super.update(loginUser, entity);
	}
	
	@Transactional
	@Override
	public List<Notification> update(User loginUser, List<Notification> entities) {
		Date now = new Date();
		for (Notification entity : entities) {
			if (entity.getIsRead())
				entity.setReadDate(now);
		}
		return super.update(loginUser, entities);
	}
	
	@Transactional
	@Override
	public void sendMessage(User loginUser, NotificationSearchParameter searchParameter) {
		Notification entity = searchParameter.getEntity();
		if (searchParameter.getReceiverEntityIds() == null || searchParameter.getReceiverEntityIds().isEmpty() || entity == null || entity.getTitle() == null || entity.getTitle().isEmpty() || entity.getMessage() == null)
			throw new FlowException(FlowErrorCode.BAD_PARAMETERS);
		
		UserSearchParameter userSearchParameter = new UserSearchParameter();
		userSearchParameter.setEntityIds(searchParameter.getReceiverEntityIds());
		List<User> foundReceivers = userDao.find(userSearchParameter);
		if (foundReceivers == null || foundReceivers.isEmpty() || foundReceivers.size() != searchParameter.getReceiverEntityIds().size())
			throw new FlowException(FlowErrorCode.BAD_PARAMETERS);
		
		if (searchParameter.getEntity().getReservationDate() != null) {
			List<Notification> notifications = new ArrayList<>();
			for (User user : foundReceivers) {
				Notification notification = new Notification();
				notification.setTypeCode(FlowAppConstants.NOTIFICATION_TYPE_MESSAGE);
				notification.setSubTypeCode(FlowAppConstants.NOTIFICATION_SUB_TYPE_MESSAGE);
				notification.setSender(loginUser);
				notification.setReceiver(user);
				notification.setTitle(entity.getTitle());
				notification.setMessage(entity.getMessage());
				notification.setReservationDate(entity.getReservationDate());
				notification.setClassName(Message.class.getName());
				notification.setIsRead(false);
				
				notifications.add(notification);
			}
			
			entityDao.createAll(loginUser, notifications);
			
			return;
		}
		
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
					.receiverType(FlowWebSocketReceiverType.USERS)
					.sender(loginUser)
					.sendTime(new Date())
					.receivers(foundReceivers)
					.title(entity.getTitle())
					.message(entity.getMessage())
					.build();
			
			List<Notification> registedNotifications = registNotifications(loginUser, flowWebSocketMessage);
			if (redisProperties.getBroadcaster().isEnable() && publisher != null) {
				flowWebSocketMessage.setClassName(List.class.getName());
				flowWebSocketMessage.setJsonStringContent(objectMapper.writeValueAsString(registedNotifications));
				publisher.publish(FlowAppConstants.REDIS_TOPIC_SEND_MESSAGE, objectMapper.writeValueAsString(flowWebSocketMessage));
			} else {
				flowWebSocketMessage.setReceivers(null);
				for (Notification registedNotification : registedNotifications) {
					flowWebSocketMessage.setReceiverType(FlowWebSocketReceiverType.USER);
					flowWebSocketMessage.setReceiver(registedNotification.getReceiver());
					messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_SEND_MESSAGE + "/" + registedNotification.getReceiver().getId(), objectMapper.writeValueAsString(flowWebSocketMessage));
				}
			}
			
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onMessageByRedis(String topic, FlowWebSocketMessage webSocketMessage) {
		if (FlowAppConstants.REDIS_TOPIC_SEND_MESSAGE.equalsIgnoreCase(topic) == false)
			return;
		
		try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<Notification> notifications = objectMapper.readValue(webSocketMessage.getJsonStringContent(), new TypeReference<List<Notification>>(){});
            for (Notification notification : notifications) {
            	webSocketMessage.setReceiverType(FlowWebSocketReceiverType.USER);
            	webSocketMessage.setReceiver(notification.getReceiver());
				messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_SEND_MESSAGE + "/" + notification.getReceiver().getId(), objectMapper.writeValueAsString(webSocketMessage));
			}
        } catch (Exception e) {
            e.printStackTrace();
        }
	}
	
	private List<Notification> registNotifications(User loginUser, FlowWebSocketMessage flowWebSocketMessage) {
		ObjectMapper objectMapper = new ObjectMapper();
		
		List<Notification> notifications = new ArrayList<>();
		for (User user : flowWebSocketMessage.getReceivers()) {
			try {
				Notification notification = new Notification();
				notification.setTypeCode(FlowAppConstants.NOTIFICATION_TYPE_MESSAGE);
				notification.setSubTypeCode(FlowAppConstants.NOTIFICATION_SUB_TYPE_MESSAGE);
				notification.setSender(flowWebSocketMessage.getSender());
				notification.setSendTime(flowWebSocketMessage.getSendTime());
				notification.setReceiver(user);
				notification.setTitle(flowWebSocketMessage.getTitle());
				notification.setMessage(flowWebSocketMessage.getMessage());
				notification.setIsRead(false);
				notification.setClassName(Message.class.getName());
				
				notification = entityDao.create(loginUser, notification);
				
				registMessage(loginUser, MessageType.SEND_MESSAGE, flowWebSocketMessage.getSender(), notification);
				Message registedMessage = registMessage(loginUser, MessageType.RECEIVE_MESSAGE, user, notification);
				notification.setJsonStringContent(objectMapper.writeValueAsString(registedMessage));
				
				notifications.add(notification);
			} catch (Exception e) {
	            e.printStackTrace();
	        }
		}
		
		return entityDao.updateAll(notifications);
	}
	
	private Message registMessage(User loginUser, MessageType messageType, User owner, Notification notification) {
		Message entity = new Message();
		entity.setType(messageType);
		entity.setOwner(owner);
		entity.setNotification(notification);
		return messageDao.create(loginUser, entity);
	}
}
