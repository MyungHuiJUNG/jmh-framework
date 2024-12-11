package com.wecoms24.flow.counsel.ticket.callback;


import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Slice;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.core.websocket.FlowRedisMessageListener;
import com.wecoms24.flow.core.websocket.FlowRedisMessageSubscriber;
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.core.websocket.FlowWebSocketReceiverType;
import com.wecoms24.flow.counsel.customer.CustomerInfo;
import com.wecoms24.flow.counsel.customer.CustomerInfoDao;
import com.wecoms24.flow.counsel.customer.CustomerInfoSearchParameter;
import com.wecoms24.flow.counsel.ticket.Ticket;
import com.wecoms24.flow.counsel.ticket.TicketDao;
import com.wecoms24.flow.counsel.ticket.callback.target.CallbackTargetGroup;
import com.wecoms24.flow.counsel.ticket.callback.target.CallbackTargetGroupDao;
import com.wecoms24.flow.counsel.ticket.callback.target.CallbackTargetGroupSearchParameter;
import com.wecoms24.flow.counsel.ticket.statistics.TicketBoardByCallbackData;
import com.wecoms24.flow.counsel.ticket.statistics.TicketStatisticsSearchParameter;
import com.wecoms24.flow.counsel.ticket.statistics.TicketStatisticsService;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserDao;


@Service
@Primary
public class CallbackTicketServiceImpl extends AbstractBaseUserCrudEntityService<User, CallbackTicket, Long, CallbackTicketDao, CallbackTicketSearchParameter> implements CallbackTicketService, FlowRedisMessageListener, InitializingBean {
	
	@Autowired
	private FlowRedisMessageSubscriber subscriber;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private TicketDao ticketDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CustomerInfoDao customerInfoDao;
	
	@Autowired
	private CallbackTargetGroupDao callbackTargetGroupDao;
	
	@Autowired
	private TicketStatisticsService ticketStatisticsService;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		subscriber.addFlowRedisMessageListeners(this);		
	}
	
	@Transactional(readOnly = true)
	@Override
	public List<CallbackTicket> find(User loginUser, CallbackTicketSearchParameter searchParameter) {
		return super.find(loginUser, searchParameter);
	}

	@Transactional(readOnly = true)
	@Override
	public Slice<CallbackTicket> findSlice(User loginUser, CallbackTicketSearchParameter searchParameter) {
		return super.findSlice(loginUser, searchParameter);
	}

	@Transactional
	@Override
	public CallbackTicket regist(User loginUser, CallbackTicket entity) {
		if (entity.getRepresentNumber() == null || entity.getRepresentNumber().isEmpty() || entity.getRepresentNumberName() == null || entity.getRepresentNumberName().isEmpty() || entity.getInboundPathCode() == null || entity.getInboundPathCode().isEmpty() || entity.getReceptionNumber() == null || entity.getReceptionNumber().isEmpty())
			throw new FlowException(FlowErrorCode.BAD_PARAMETERS);
		
		entity.setRepresentNumber(entity.getRepresentNumber().replaceAll("[^0-9]", ""));
		entity.setReceptionNumber(entity.getReceptionNumber().replaceAll("[^0-9]", ""));
		
		if (entity.getCallbackNumber() == null || entity.getCallbackNumber().isEmpty())
			entity.setCallbackNumber(entity.getRepresentNumberName());
		
		entity.setCallbackNumber(entity.getCallbackNumber().replaceAll("[^0-9]", ""));
		
		return super.regist(loginUser, entity);
	}

	@Override
	public CallbackTicket manualDistributeCallbackTicket(User loginUser, CallbackTicketSearchParameter searchParameter) {
		if (searchParameter.getManagerEntityId() == null || searchParameter.getManagerEntityId() <= 0)
			throw new FlowException(FlowErrorCode.BAD_PARAMETERS);
		
		User manager = userDao.findOneByEntityId(searchParameter.getManagerEntityId());
		if (manager == null)
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		CallbackTicket foundCallbackTicket = entityDao.findOneByEntityId(loginUser, searchParameter.getEntity().getEntityId());
		if (foundCallbackTicket == null)
			throw new FlowException(FlowErrorCode.BAD_PARAMETERS);
		
		if (foundCallbackTicket.getTicket() == null) {
			Ticket ticket = new Ticket();
			ticket.setTypeCode(FlowAppConstants.TICKET_TYPE_CALLBACK);
			ticket.setStatusCode(FlowAppConstants.TICKET_STATUS_UNPROCESSED);
			ticket.setManager(manager);
			
			CustomerInfo customerInfo = findCustomerInfo(foundCallbackTicket);
			if (customerInfo != null) {
				ticket.setCustomerInfo(customerInfo);
			} else {
				ticket.setTel(foundCallbackTicket.getCallbackNumber());
			}
			
			Ticket registedTicket = ticketDao.create(loginUser, ticket);
			foundCallbackTicket.setTicket(registedTicket);
		} else {
			Ticket ticket = foundCallbackTicket.getTicket();
			ticket.setManager(manager);
			ticket = ticketDao.update(loginUser, ticket);
			foundCallbackTicket.setTicket(ticket);
		}
		
		return entityDao.update(loginUser, foundCallbackTicket);
	}
	
	@Override
	public List<CallbackTicket> autoDistributeCallbackTickets() {
		CallbackTicketSearchParameter searchParameter = new CallbackTicketSearchParameter();
		searchParameter.setIsUnAssignCallback(true);
		List<CallbackTicket> foundCallbacks = entityDao.find(searchParameter);
		if (foundCallbacks != null && foundCallbacks.isEmpty() == false) {
			Map<String, List<CallbackTicket>> callbacksByRepresentNumberMap = new LinkedHashMap<>();
			for (CallbackTicket foundCallback : foundCallbacks) {
				List<CallbackTicket> callbacksByRepresentNumber = callbacksByRepresentNumberMap.get(foundCallback.getRepresentNumber());
				if (callbacksByRepresentNumber == null)
					callbacksByRepresentNumber = new ArrayList<>();
				
				callbacksByRepresentNumber.add(foundCallback);
				callbacksByRepresentNumberMap.put(foundCallback.getRepresentNumber(), callbacksByRepresentNumber);
			}
			
			CallbackTargetGroupSearchParameter callbackTargetGroupSearchParameter = new CallbackTargetGroupSearchParameter();
			callbackTargetGroupSearchParameter.setRepresentNumbers(List.copyOf(callbacksByRepresentNumberMap.keySet()));
			List<CallbackTargetGroup> foundTargetGroups = callbackTargetGroupDao.find(callbackTargetGroupSearchParameter);
			if (foundTargetGroups == null || foundTargetGroups.isEmpty())
				return null;
			
			Map<CallbackTargetGroup, List<CallbackTicket>> callbacksByCallbackTargetGroupMap = new LinkedHashMap<>();
			for (CallbackTargetGroup group : foundTargetGroups) {
				List<CallbackTicket> callbacks = callbacksByRepresentNumberMap.get(group.getRepresentNumber());
				if (callbacks != null && callbacks.isEmpty() == false)
					callbacksByCallbackTargetGroupMap.put(group, callbacks);
			}
			
			List<CallbackTicket> updatedCallbackTickets = new LinkedList<>();
			for(Map.Entry<CallbackTargetGroup, List<CallbackTicket>> element : callbacksByCallbackTargetGroupMap.entrySet() ) {
				Date now = new Date();
				TicketStatisticsSearchParameter ticketStatisticsSearchParameter = new TicketStatisticsSearchParameter();
				ticketStatisticsSearchParameter.setFromDate(now);
				ticketStatisticsSearchParameter.setToDate(now);
				List<TicketBoardByCallbackData> callbackTicketBoardByUser = ticketStatisticsService.callbackTicketBoardByUser(ticketStatisticsSearchParameter);
				Map<Long, Integer> userTicketCountMap = new HashMap<>();
			    for (TicketBoardByCallbackData boardData : callbackTicketBoardByUser) {
			        userTicketCountMap.put(boardData.getUserEntityId(), boardData.getCallbackTicketCount());
			    }
			    
				CallbackTargetGroup group = element.getKey();
				List<User> distributeTargetUsers = group.getUsers();
				List<CallbackTicket> distributeCallbacks = element.getValue();
				
				for (CallbackTicket callbackTicket : distributeCallbacks) {
					User targetUser = findUserWithLeastTickets(userTicketCountMap, distributeTargetUsers);
					
					Ticket ticket = new Ticket();
					ticket.setTypeCode(FlowAppConstants.TICKET_TYPE_CALLBACK);
					ticket.setStatusCode(FlowAppConstants.TICKET_STATUS_UNPROCESSED);
					ticket.setManager(targetUser);
					
					CustomerInfo customerInfo = findCustomerInfo(callbackTicket);
					if (customerInfo != null) {
						ticket.setCustomerInfo(customerInfo);
					} else {
						ticket.setTel(callbackTicket.getCallbackNumber());
					}
					
					Ticket registedTicket = ticketDao.create(ticket);
					callbackTicket.setTicket(registedTicket);
					userTicketCountMap.put(targetUser.getEntityId(), userTicketCountMap.get(targetUser.getEntityId()) + 1);
				}
				
				updatedCallbackTickets.addAll(entityDao.updateAll(foundCallbacks));
			}
			
			return updatedCallbackTickets;
		}
		return foundCallbacks;
	}
	
	private CustomerInfo findCustomerInfo(CallbackTicket entity) {
		CustomerInfo customerInfo = null;
		CustomerInfoSearchParameter customerInfoSearchParameter = new CustomerInfoSearchParameter();
		customerInfoSearchParameter.setSearchTel(entity.getReceptionNumber());
		List<CustomerInfo> customerInfos = customerInfoDao.find(customerInfoSearchParameter);
		if (customerInfos != null && customerInfos.size() == 1)
			customerInfo = customerInfos.get(0);
		
		if (customerInfo == null && entity.getReceptionNumber().equalsIgnoreCase(entity.getCallbackNumber()) == false) {
			customerInfoSearchParameter.setSearchTel(entity.getCallbackNumber());
			customerInfos = customerInfoDao.find(customerInfoSearchParameter);
			if (customerInfos != null && customerInfos.size() == 1)
				customerInfo = customerInfos.get(0);
		}
		return customerInfo;
	}
	
	private User findUserWithLeastTickets(Map<Long, Integer> userTicketCountMap, List<User> distributeTargetUsers) {
	    User targetUser = null;
	    int minTickets = Integer.MAX_VALUE;
	    for (User user : distributeTargetUsers) {
	        int ticketCount = userTicketCountMap.getOrDefault(user.getEntityId(), 0);
	        if (ticketCount < minTickets) {
	            minTickets = ticketCount;
	            targetUser = user;
	        }
	    }
	    return targetUser;
	}

	@Override
	public void onMessageByRedis(String topic, FlowWebSocketMessage webSocketMessage) {
		if (FlowAppConstants.REDIS_TOPIC_CALLBACK_TICKET.equalsIgnoreCase(topic) == false || List.class.getName().equalsIgnoreCase(webSocketMessage.getClassName()) == false)
			return;
		
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			List<CallbackTicket> callbackTickets = objectMapper.readValue(webSocketMessage.getJsonStringContent(), new TypeReference<List<CallbackTicket>>(){});
			for (CallbackTicket callbackTicket : callbackTickets) {
				String jsonString = objectMapper.writeValueAsString(callbackTicket);
				String message = "[" + callbackTicket.getTicket().getEntityId() + "] 콜백티켓이 할당 되었습니다.";
				FlowWebSocketMessage flowWebSocketMessage = FlowWebSocketMessage.builder()
						.receiverType(FlowWebSocketReceiverType.USER)
						.receiver(callbackTicket.getTicket().getManager())
						.className(CallbackTicket.class.getName())
						.sendTime(webSocketMessage.getSendTime())
						.jsonStringContent(jsonString)
						.message(message)
						.build();
				
				String flowWebSocketMessageJsonString = objectMapper.writeValueAsString(flowWebSocketMessage);
				messagingTemplate.convertAndSend(FlowAppConstants.REDIS_TOPIC_CALLBACK_TICKET + "/" + callbackTicket.getTicket().getManager().getId(), flowWebSocketMessageJsonString);
			}
		} catch (Exception e) {
            e.printStackTrace();
        }
	}
}
