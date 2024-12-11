package com.wecoms24.flow.core.notification.scheduler;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.notification.Notification;
import com.wecoms24.flow.core.notification.NotificationDao;
import com.wecoms24.flow.core.notification.NotificationSearchParameter;
import com.wecoms24.flow.core.notification.message.Message;
import com.wecoms24.flow.core.notification.message.MessageDao;
import com.wecoms24.flow.core.notification.message.MessageType;
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.core.websocket.FlowWebSocketReceiverType;
import com.wecoms24.flow.user.User;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class NotificationReservationBroadcastScheduler {
	private final SimpMessagingTemplate messagingTemplate;
	private final NotificationDao notificationDao;
	private final MessageDao messageDao;
	
	@Scheduled(cron = "0 * * * * *")
    @Transactional
	public void broadcastReservationNotification() {
		List<Notification> foundNotifications = findReservationsNotifications();
		if (foundNotifications == null || foundNotifications.isEmpty())
        	return;
		
		ObjectMapper objectMapper = new ObjectMapper();
		for (Notification notification : foundNotifications) {
			try {
				notification.setSendTime(notification.getReservationDate());
				registMessage(MessageType.SEND_MESSAGE, notification.getSender(), notification);
				Message registedMessage = registMessage(MessageType.RECEIVE_MESSAGE, notification.getReceiver(), notification);
				notification.setJsonStringContent(objectMapper.writeValueAsString(registedMessage));
				
				notificationDao.update(notification);
				
	    		FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USER)
						.sender(notification.getSender())
						.sendTime(notification.getSendTime())
						.receiver(notification.getReceiver())
						.className(Notification.class.getName())
						.jsonStringContent(objectMapper.writeValueAsString(notification))
						.title(notification.getTitle())
						.message(notification.getMessage())
						.build();
	    		
	    		messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_SEND_MESSAGE + "/" + notification.getReceiver().getId(), objectMapper.writeValueAsString(flowWebSocketMessage));
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
    	}
		notificationDao.updateAll(foundNotifications);
	}
	
	private List<Notification> findReservationsNotifications() {
		Date currentDate = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(currentDate);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date searchReservationDate = cal.getTime();
        
        NotificationSearchParameter searchParameter = new NotificationSearchParameter();
        searchParameter.getEntity().setTypeCode(FlowAppConstants.NOTIFICATION_TYPE_MESSAGE);
        searchParameter.getEntity().setSubTypeCode(FlowAppConstants.NOTIFICATION_SUB_TYPE_MESSAGE);
        searchParameter.getEntity().setReservationDate(searchReservationDate);
        List<Notification> foundNotifications = notificationDao.find(searchParameter);
        
		return foundNotifications;
	}
	
	private Message registMessage(MessageType messageType, User owner, Notification notification) {
		Message entity = new Message();
		entity.setType(messageType);
		entity.setOwner(owner);
		entity.setNotification(notification);
		return messageDao.create(entity);
	}
}
