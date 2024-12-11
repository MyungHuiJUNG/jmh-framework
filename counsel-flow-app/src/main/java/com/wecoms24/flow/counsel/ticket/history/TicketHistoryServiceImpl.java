package com.wecoms24.flow.counsel.ticket.history;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.counsel.ticket.Ticket;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserSearchParameter;
import com.wecoms24.flow.user.UserService;

@Service
@Primary
public class TicketHistoryServiceImpl extends AbstractBaseUserCrudEntityService<User, TicketHistory, Long, TicketHistoryDao, TicketHistorySearchParameter> implements TicketHistoryService {
	private static final String ACTION_CALL = "전화걸기를 실행하였습니다.";
	private static final String ACTION_SEND = "메일발송을 실행하였습니다.";
	private static final String ACTION_CHANNEL = "을 수락하였습니다.";
	private static final String ACTION_CONNECT = "티켓을 연결하였습니다.";
	private static final String ACTION_DISCONNECT = "티켓의 연결을 삭제하였습니다.";
	private static final String ACTION_CHANGE = "다음을 변경하였습니다.";
	private static final String ACTION_REPLY = "댓글을 변경하였습니다.";
	private static final String ACTION_MANUAL_NEW_TICKET = "새티켓을 발행하였습니다.";
	private static final String ACTION_JOB_HISTORY = "티켓을 수정하였습니다.";

	@Autowired
	private UserService userService;

	@Autowired(required = false)
	private TicketHistoryDao ticketHistoryDao;

	@Override
	public TicketHistory registForJobHistory(User user, TicketHistorySearchParameter searchParameter, String type) {
		TicketHistory entity = new TicketHistory();
		User findUser = findUser(user);

		Map<String, Object> contents = new HashMap<>();
		String data = "";
		data += findUser.getName() + "님이 - [" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(FlowAppConstants.DATETIME_FORMAT_SPLIT_SYMBOL)) + "] ";
		data += ACTION_JOB_HISTORY;

		contents.put("contents", data);

		entity.setTicketEntityId(searchParameter.getTicketEntityId());
		entity.setPreviousData(searchParameter.getPrevData());
		entity.setNewData(searchParameter.getNewData());
		entity.setTypeCode(type);
		entity.setDetails(convertJsonText(contents));

		return ticketHistoryDao.create(entity);
	}

	@Override
	public TicketHistory registForRelationTicket(User user, TicketHistorySearchParameter searchParameter) {
		TicketHistory entity = new TicketHistory();
		User findUser = findUser(user);

		Map<String, Object> contents = new HashMap<>();
		String data = "";
		data += findUser.getName() + "님이 - [" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(FlowAppConstants.DATETIME_FORMAT_SPLIT_SYMBOL)) + "] [" + searchParameter.getTarget() + "] ";
		if (searchParameter.getChannelType() != null && "CONNECT".equals(searchParameter.getChannelType()))
			data += ACTION_CONNECT;
		else if (searchParameter.getChannelType() != null && "DISCONNECT".equals(searchParameter.getChannelType()))
			data += ACTION_DISCONNECT;

		contents.put("contents", data);

		entity.setTicketEntityId(searchParameter.getTicketEntityId());
		entity.setTypeCode("RELATION");
		entity.setDetails(convertJsonText(contents));

		return ticketHistoryDao.create(entity);
	}

	@Transactional
	@Override
	public TicketHistory registForActionType(User user, TicketHistorySearchParameter searchParameter) {
		TicketHistory entity = new TicketHistory();
		User findUser = findUser(user);

		Map<String, Object> contents = new HashMap<>();
		String data = "";
		data += findUser.getName() + "님이 - [" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(FlowAppConstants.DATETIME_FORMAT_SPLIT_SYMBOL)) + "] [" + searchParameter.getTarget() + "]으로 ";

		if ("OUTBOUND".equals(searchParameter.getEntity().getTypeCode())) {
			if (searchParameter.getChannelType() != null && "VOICE".equals(searchParameter.getChannelType()))
				data += ACTION_CALL;
			else if (searchParameter.getChannelType() != null && "MAIL".equals(searchParameter.getChannelType()))
				data += ACTION_SEND;
		} else if ("INBOUND".equals(searchParameter.getEntity().getTypeCode())) {
			if (searchParameter.getChannelType() != null)
				data += searchParameter.getChannelType() + ACTION_CHANNEL;
		}

		contents.put("contents", data);

		entity.setTicketEntityId(searchParameter.getTicketEntityId());
		entity.setTypeCode(searchParameter.getEntity().getTypeCode());
		entity.setDetails(convertJsonText(contents));

		return ticketHistoryDao.create(entity);
	}

	@Override
	public TicketHistory registForTicket(User user, Ticket ticket, Ticket updatedTicket) {
		TicketHistory entity = new TicketHistory();
		User findUser = findUser(user);

		Map<String, Object> contents = new HashMap<>();
		List<Map<String, Object>> filteredDatas = filterChangedTicket(ticket, updatedTicket);
		boolean isTransfer = checkTransfer(ticket, updatedTicket);
		if (filteredDatas.size() <= 0)
			return entity;

		String title = findUser.getName() + "님이 - [" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(FlowAppConstants.DATETIME_FORMAT_SPLIT_SYMBOL)) + "] " + ACTION_CHANGE;
		contents.put("title", title);
		contents.put("datas", filteredDatas);

		entity.setTicketEntityId(updatedTicket.getEntityId());
		entity.setTypeCode("TICKET");
		entity.setDetails(convertJsonText(contents));

		if (isTransfer)
			entity.setTransferYn("Y");

		return ticketHistoryDao.create(entity);
	}

	@Override
	public TicketHistory registForManualNewTicket(User user, Ticket ticket) {
		TicketHistory entity = new TicketHistory();
		User findUser = findUser(user);

		Map<String, Object> contents = new HashMap<>();
		String data = "";
		data += findUser.getName() + "님이 - [" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(FlowAppConstants.DATETIME_FORMAT_SPLIT_SYMBOL)) + "] ";
		data += ACTION_MANUAL_NEW_TICKET;

		contents.put("contents", data);

		entity.setTicketEntityId(ticket.getEntityId());
		entity.setTypeCode("MANUAL_TICKET");
		entity.setDetails(convertJsonText(contents));

		return ticketHistoryDao.create(entity);
	}

	@Override
	public TicketHistory registForReply(User user, String original, String changed, Long ticketEntityId) {
		TicketHistory entity = new TicketHistory();
		User findUser = findUser(user);

		Map<String, Object> contents = new HashMap<>();
		List<Map<String, Object>> filteredDatas = filterChangedReply(original, changed);
		if (filteredDatas.isEmpty())
			return entity;

		String title = findUser.getName() + "님이 - [" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(FlowAppConstants.DATETIME_FORMAT_SPLIT_SYMBOL)) + "] " + ACTION_REPLY;
		contents.put("title", title);
		contents.put("datas", filteredDatas);

		entity.setTicketEntityId(ticketEntityId);
		entity.setTypeCode("REPLY");
		entity.setDetails(convertJsonText(contents));

		return ticketHistoryDao.create( entity);
	}


	@Transactional
	@Override
	public void deleteTicketHistory(Long ticketEntityId) {
		TicketHistorySearchParameter searchParameter = new TicketHistorySearchParameter();
		searchParameter.setTicketEntityId(ticketEntityId);

		List<TicketHistory> list = ticketHistoryDao.find(searchParameter);

		ticketHistoryDao.removeByEntities(list);
	}

	private List<Map<String, Object>> filterChangedReply(String original, String changed) {
		List<Map<String, Object>> filteredDatas = new ArrayList<>();

		original = original == null ? "" : original;
		changed = changed == null ? "" : changed;
		if (!original.trim().equals(changed.trim()))
			filteredDatas.add(setFilterData("내용", original, changed));

		return filteredDatas;
	}

	private List<Map<String, Object>> filterChangedTicket(Ticket ticket, Ticket updatedTicket) {
		List<Map<String, Object>> filteredDatas = new ArrayList<>();

		if (ticket == null || updatedTicket == null)
			return filteredDatas;

		ticket.setStatusCode(ticket.getStatusCode() == null ? "" : ticket.getStatusCode());
		updatedTicket.setStatusCode(updatedTicket.getStatusCode() == null ? "" : updatedTicket.getStatusCode());
		if (!ticket.getStatusCode().trim().equals(updatedTicket.getStatusCode().trim()))
			filteredDatas.add(setFilterData("처리상태", ticket.getStatusCode(), updatedTicket.getStatusCode()));

//		ticket.setCounselClassificationCode(ticket.getCounselClassificationCode() == null ? "" : ticket.getCounselClassificationCode());
//		updatedTicket.setCounselClassificationCode(updatedTicket.getCounselClassificationCode() == null ? "" : updatedTicket.getCounselClassificationCode());
//		if (!ticket.getCounselClassificationCode().trim().equals(updatedTicket.getCounselClassificationCode().trim()))
//			filteredDatas.add(setFilterData("상담구분", ticket.getCounselClassificationCode(), updatedTicket.getCounselClassificationCode()));
//
//		ticket.setCounselTypeLargeCode(ticket.getCounselTypeLargeCode() == null ? "" : ticket.getCounselTypeLargeCode());
//		updatedTicket.setCounselTypeLargeCode(updatedTicket.getCounselTypeLargeCode() == null ? "" : updatedTicket.getCounselTypeLargeCode());
//		if (ticket.getCounselTypeLargeCode() != updatedTicket.getCounselTypeLargeCode())
//			filteredDatas.add(setFilterData("상담유형(대)", ticket.getCounselTypeLargeCode(), updatedTicket.getCounselTypeLargeCode()));
//
//		ticket.setCounselTypeMediumCode(ticket.getCounselTypeMediumCode() == null ? "" : ticket.getCounselTypeMediumCode());
//		updatedTicket.setCounselTypeMediumCode(updatedTicket.getCounselTypeMediumCode() == null ? "" : updatedTicket.getCounselTypeMediumCode());
//		if (ticket.getCounselTypeMediumCode() != updatedTicket.getCounselTypeMediumCode())
//			filteredDatas.add(setFilterData("상담유형(중)", ticket.getCounselTypeMediumCode(), updatedTicket.getCounselTypeMediumCode()));
//
//		ticket.setCounselTypeSmallCode(ticket.getCounselTypeSmallCode() == null ? "" : ticket.getCounselTypeSmallCode());
//		updatedTicket.setCounselTypeSmallCode(updatedTicket.getCounselTypeSmallCode() == null ? "" : updatedTicket.getCounselTypeSmallCode());
//		if (ticket.getCounselTypeSmallCode() != updatedTicket.getCounselTypeSmallCode())
//			filteredDatas.add(setFilterData("상담유형(소)", ticket.getCounselTypeSmallCode(), updatedTicket.getCounselTypeSmallCode()));
//
//		ticket.setContents(ticket.getContents() == null ? "" : ticket.getContents());
//		updatedTicket.setContents(updatedTicket.getContents() == null ? "" : updatedTicket.getContents());
//		if (!ticket.getContents().trim().equals(updatedTicket.getContents().trim()))
//			filteredDatas.add(setFilterData("상담내용", ticket.getContents(), updatedTicket.getContents()));
//
//		ticket.setPriorityCode(ticket.getPriorityCode() == null ? "" : ticket.getPriorityCode());
//		updatedTicket.setPriorityCode(updatedTicket.getPriorityCode() == null ? "" : updatedTicket.getPriorityCode());
//		if (!ticket.getPriorityCode().trim().equals(updatedTicket.getPriorityCode().trim()))
//			filteredDatas.add(setFilterData("우선순위", ticket.getPriorityCode(), updatedTicket.getPriorityCode()));
//
//		User emptyUser = new User();
//		emptyUser.setId("");
//		emptyUser.setName("");
//
//		ticket.setManager(ticket.getManager() == null ? emptyUser : ticket.getManager());
//		updatedTicket.setManager(updatedTicket.getManager() == null ? emptyUser : updatedTicket.getManager());
//		if (!ticket.getManager().getId().equals(updatedTicket.getManager().getId()))
//			filteredDatas.add(setFilterData("담당자", ticket.getManager().getName() + " [" + ticket.getManager().getId() + "]", updatedTicket.getManager().getName() + " [" + updatedTicket.getManager().getId() + "]"));

		return filteredDatas;
	}

	private Map<String, Object> setFilterData(String name, String original, String changed) {
		Map<String, Object> data = new HashMap<>();
		data.put("name", name);
		data.put("original", original);
		data.put("changed", changed);

		return data;
	}

	private String convertJsonText(Map<String, Object> data) {
		String jsonText = null;
		try {
			jsonText = new ObjectMapper().writeValueAsString(data);
		} catch (Exception e) {
            throw new FlowException(FlowErrorCode.CONVERT_JSON_FAIL);
		}

		return jsonText;
	}

	private User findUser(User user) {
		UserSearchParameter userSearchParameter = new UserSearchParameter();
		userSearchParameter.getEntity().setId(user.getId());

		List<User> findUser = userService.find(user, userSearchParameter);
		if (findUser.isEmpty())
            throw new FlowException(FlowErrorCode.NOT_FOUND_USER);

		return findUser.get(0);
	}

	private boolean checkTransfer(Ticket ticket, Ticket updatedTicket) {
		boolean isTransfer = false;

		User emptyUser = new User();
		emptyUser.setId("");
		emptyUser.setName("");

//		ticket.setManager(ticket.getManager() == null ? emptyUser : ticket.getManager());
//		updatedTicket.setManager(updatedTicket.getManager() == null ? emptyUser : updatedTicket.getManager());
//		if (!ticket.getManager().getId().equals(updatedTicket.getManager().getId()))
//			isTransfer = true;

		return isTransfer;
	}

}
