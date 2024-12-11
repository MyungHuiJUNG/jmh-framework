package com.wecoms24.flow.counsel.ticket;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

import jakarta.servlet.http.HttpServletResponse;

public interface TicketService extends BaseUserCrudEntityService<User, Ticket, Long, TicketDao, TicketSearchParameter> {
	void ticketsExcelDownload(User loginUser, TicketSearchParameter searchParameter, HttpServletResponse response);
}
