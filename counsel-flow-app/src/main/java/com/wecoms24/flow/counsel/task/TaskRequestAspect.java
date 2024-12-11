package com.wecoms24.flow.counsel.task;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.common.SHA2Util;
import com.wecoms24.flow.core.notification.Notification;
import com.wecoms24.flow.core.notification.NotificationDao;
import com.wecoms24.flow.core.redis.RedisProperties;
import com.wecoms24.flow.core.websocket.FlowRedisMessagePublisher;
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.core.websocket.FlowWebSocketReceiverType;
import com.wecoms24.flow.settings.role.Role;
import com.wecoms24.flow.settings.role.RoleDao;
import com.wecoms24.flow.settings.role.RoleSearchParameter;
import com.wecoms24.flow.settings.role.group.RoleGroup;
import com.wecoms24.flow.settings.role.group.RoleGroupDao;
import com.wecoms24.flow.settings.role.group.RoleGroupSearchParameter;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserDao;

@Aspect
@Component
public class TaskRequestAspect {
	
	@Autowired
	private RedisProperties redisProperties;
	
	@Autowired
	private FlowRedisMessagePublisher publisher;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private RoleDao roleDao;
	
	@Autowired
	private RoleGroupDao roleGroupDao;
	
	@Autowired
	private NotificationDao notificationDao;

	@AfterReturning(pointcut = "execution(* com.wecoms24.flow.counsel.task.TaskRequestServiceImpl.update(..)) && args(loginUser, entity)", returning = "result")
    public void checkTaskRequestState(User loginUser, TaskRequest entity, TaskRequest result) {
        if (entity.getRequestType() == RequestType.INIT_PASSWORD  && entity.getStateType() == RequestStateType.ACCEPT) {
        	User foundOneTarget = userDao.findOneByEntityId(entity.getRequestor().getEntityId());
        	String encryptPassword = SHA2Util.encrypt(FlowAppConstants.INIT_PWD, FlowAppConstants.ENCODING_ALGORITM);
        	foundOneTarget.setPassword(passwordEncoder.encode(encryptPassword));
        	userDao.update(foundOneTarget);
        }
    }
	
	@AfterReturning(pointcut = "execution(* com.wecoms24.flow.counsel.task.TaskRequestServiceImpl.requestInitPassword(..)) && args(loginUser, entity)", returning = "result")
	public void sendNotificationToManagers(User loginUser, TaskRequest entity, TaskRequest result) {
		try {
			Role foundInitPasswordRole = foundInitPasswordRole();
			if (foundInitPasswordRole == null)
				return;
			
			List<RoleGroup> roleGroupsByHasInitPasswordRole = foundRoleGroups(foundInitPasswordRole);
			if (roleGroupsByHasInitPasswordRole == null || roleGroupsByHasInitPasswordRole.isEmpty())
				return;
			
			List<User> approvers = new ArrayList<>();
			for (RoleGroup roleGroup : roleGroupsByHasInitPasswordRole) {
				approvers.addAll(roleGroup.getUsers());
			}
			
			if (approvers.isEmpty())
				return;
			
			ObjectMapper objectMapper = new ObjectMapper();
			Date now = new Date();
			User requestor = result.getRequestor();
			String jsonString = objectMapper.writeValueAsString(result);
			String message = "[" + requestor.getName() + "] 사용자가 비밀번호 초기화를 요청하였습니다.";
			
			if (redisProperties.getBroadcaster().isEnable() && publisher != null) {
				FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USERS)
						.receivers(approvers)
						.sender(requestor)
						.className(List.class.getName())
						.jsonStringContent(jsonString)
						.message(message)
						.build();
				
				publisher.publish(FlowAppConstants.REDIS_TOPIC_REQUEST_INIT_PWD, objectMapper.writeValueAsString(flowWebSocketMessage));
			} else {
				FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USER)
						.sender(requestor)
						.sendTime(now)
						.className(TaskRequest.class.getName())
						.jsonStringContent(jsonString)
						.message(message)
						.build();
				
				for (User approver : approvers) {
					flowWebSocketMessage.setReceiver(approver);
					registNotification(flowWebSocketMessage);
					messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_REQUEST_INIT_PWD + "/" + approver.getId(), objectMapper.writeValueAsString(flowWebSocketMessage));
				}
			}
		} catch (Exception e) {
            e.printStackTrace();
        }
	}

	private Role foundInitPasswordRole() {
		RoleSearchParameter searchParameter = new RoleSearchParameter();
		searchParameter.setIsTopCode(false);
		searchParameter.getEntity().setPath("REQUEST_MANAGEMENT.REQUEST_INIT_PWD_APPROVAL");
		Role foundInitPasswordRole = roleDao.findOne(searchParameter);
		return foundInitPasswordRole;
	}
	
	private List<RoleGroup> foundRoleGroups(Role foundInitPasswordRole) {
		RoleGroupSearchParameter roleGroupSearchParameter = new RoleGroupSearchParameter();
		roleGroupSearchParameter.getEntity().setUsable(true);
		roleGroupSearchParameter.setRoleEntityId(foundInitPasswordRole.getEntityId());
		List<RoleGroup> roleGroupsByHasInitPasswordRole = roleGroupDao.find(roleGroupSearchParameter);
		return roleGroupsByHasInitPasswordRole;
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
