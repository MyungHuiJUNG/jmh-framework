package com.wecoms24.flow.counsel.ticket.scheduler;

import java.util.Calendar;
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
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.core.websocket.FlowWebSocketReceiverType;
import com.wecoms24.flow.counsel.ticket.Ticket;
import com.wecoms24.flow.counsel.ticket.TicketDao;
import com.wecoms24.flow.counsel.ticket.TicketSearchParameter;
import com.wecoms24.flow.user.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Component
@Slf4j
public class TicketReservationBroadcastScheduler {
	private final TicketDao ticketDao;
	private final SimpMessagingTemplate messagingTemplate;
	private final NotificationDao notificationDao;
	@Value("${com.wecoms24.flow.isMasterServer}")
    private Boolean isMasterServer;
	
	@Scheduled(cron = "0 * * * * *")
    @Transactional
	public void broadcastReservationTicket() {
		List<Ticket> foundTickets = findReservationTicketsInFiveMinute();
        if (foundTickets == null || foundTickets.isEmpty())
        	return;
        
        for(Ticket foundTicket : foundTickets) {
        	try {
        		if (foundTicket.getManager() == null)
        			continue;
        		
				ObjectMapper objectMapper = new ObjectMapper();
				String jsonString = objectMapper.writeValueAsString(foundTicket);
				String message = "[" + foundTicket.getEntityId() + "] 티켓의 재통화예약 5분전 입니다.";
				User receiver = new User();
				receiver.setEntityId(foundTicket.getManager().getEntityId());
				receiver.setId(foundTicket.getManager().getId());
				receiver.setName(foundTicket.getManager().getName());
				
				FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USER)
						.receiver(receiver)
						.className(Ticket.class.getName())
						.sendTime(new Date())
						.jsonStringContent(jsonString)
						.message(message)
						.build();
				
				messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_TICKET_RESERVATION + "/" + receiver.getId(), objectMapper.writeValueAsString(flowWebSocketMessage));
				
				if (isMasterServer)
					registNotification(flowWebSocketMessage);
        	} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
        }
	}


	private List<Ticket> findReservationTicketsInFiveMinute() {
		Date currentDate = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(currentDate);
        cal.add(Calendar.MINUTE, 5);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date searchReservationDate = cal.getTime();
        
        TicketSearchParameter searchParameter = new TicketSearchParameter();
        searchParameter.getEntity().setCallbackReservationDate(searchReservationDate);
        List<Ticket> foundTickets = ticketDao.find(searchParameter);
		return foundTickets;
	}
	
	private void registNotification(FlowWebSocketMessage flowWebSocketMessage) {
		Notification notification = new Notification();
		notification.setTypeCode(FlowAppConstants.NOTIFICATION_TYPE_TICKET);
		notification.setSubTypeCode(FlowAppConstants.NOTIFICATION_SUB_TYPE_RESERVATION_TICKET);
		notification.setSendTime(flowWebSocketMessage.getSendTime());
		notification.setReceiver(flowWebSocketMessage.getReceiver());
		notification.setClassName(Ticket.class.getName());
		notification.setJsonStringContent(flowWebSocketMessage.getJsonStringContent());
		notification.setMessage(flowWebSocketMessage.getMessage());
		notification.setIsRead(false);
		notificationDao.create(notification);
	}
}
