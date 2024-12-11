package com.wecoms24.flow.counsel.task;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.notification.Notification;
import com.wecoms24.flow.core.notification.NotificationDao;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.core.websocket.FlowRedisMessageListener;
import com.wecoms24.flow.core.websocket.FlowRedisMessageSubscriber;
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.core.websocket.FlowWebSocketReceiverType;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserDao;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Primary
public class TaskRequestServiceImpl extends AbstractBaseUserCrudEntityService<User, TaskRequest, Long, TaskRequestDao, TaskRequestSearchParameter> implements TaskRequestService, FlowRedisMessageListener, InitializingBean {
	
	@Autowired
	private FlowRedisMessageSubscriber subscriber;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private NotificationDao notificationDao;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		subscriber.addFlowRedisMessageListeners(this);		
	}
	
	@Transactional
	@Override
	public TaskRequest requestInitPassword(User loginUser, TaskRequest entity) {
		if (entity.getRequestor() == null || entity.getRequestor().getId() == null || entity.getRequestor().getId().isEmpty() || entity.getRequestor().getName() == null || entity.getRequestor().getName().isEmpty())
			throw new FlowException(FlowErrorCode.BAD_PARAMETERS);
		
		User foundRequestor = userDao.findOneByIdWithName(entity.getRequestor().getId(), entity.getRequestor().getName());
		if (foundRequestor == null)
			throw new FlowException(FlowErrorCode.NOT_FOUND_USER);
		
		entity.getRequestor().setEntityId(foundRequestor.getEntityId());
		return super.regist(loginUser, entity);
	}
	
	@Transactional
	@Override
	public TaskRequest update(User loginUser, TaskRequest entity) {
		return super.update(loginUser, entity);
	}

	@Transactional
	@Override
	public void onMessageByRedis(String topic, FlowWebSocketMessage webSocketMessage) {
		if (FlowAppConstants.REDIS_TOPIC_REQUEST_INIT_PWD.equalsIgnoreCase(topic) == false || List.class.getName().equalsIgnoreCase(webSocketMessage.getClassName()) == false)
			return;
		
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			webSocketMessage.setReceiverType(FlowWebSocketReceiverType.USER);
			webSocketMessage.setSendTime(new Date());
			webSocketMessage.setClassName(TaskRequest.class.getName());
			
			List<User> approvers = webSocketMessage.getReceivers();
			for (User approver : approvers) {
				webSocketMessage.setReceiver(approver);
				registNotification(webSocketMessage);
				messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_REQUEST_INIT_PWD + "/" + approver.getId(), objectMapper.writeValueAsString(webSocketMessage));
			}
		} catch (Exception e) {
            e.printStackTrace();
        }
	}
	
	private void registNotification(FlowWebSocketMessage flowWebSocketMessage) {
		Notification notification = new Notification();
		notification.setTypeCode(FlowAppConstants.NOTIFICATION_TYPE_REQUEST);
		notification.setSubTypeCode(FlowAppConstants.NOTIFICATION_SUB_TYPE_INIT_PWD);
		notification.setSender(flowWebSocketMessage.getSender());
		notification.setSendTime(flowWebSocketMessage.getSendTime());
		notification.setReceiver(flowWebSocketMessage.getReceiver());
		notification.setClassName(flowWebSocketMessage.getClassName());
		notification.setJsonStringContent(flowWebSocketMessage.getJsonStringContent());
		notification.setMessage(flowWebSocketMessage.getMessage());
		notification.setIsRead(false);
		
		notificationDao.create(notification);
	}
}
