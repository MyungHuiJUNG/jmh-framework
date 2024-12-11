package com.wecoms24.flow.counsel.ticket.callback;

import java.util.List;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface CallbackTicketService extends BaseUserCrudEntityService<User, CallbackTicket, Long, CallbackTicketDao, CallbackTicketSearchParameter> {
	List<CallbackTicket> autoDistributeCallbackTickets();
	CallbackTicket manualDistributeCallbackTicket(User loginUser, CallbackTicketSearchParameter searchParameter);
}
