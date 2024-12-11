package com.wecoms24.flow.counsel.ticket.history;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.counsel.ticket.Ticket;
import com.wecoms24.flow.user.User;

public interface TicketHistoryService extends BaseUserCrudEntityService<User, TicketHistory, Long, TicketHistoryDao, TicketHistorySearchParameter> {
	TicketHistory registForRelationTicket(User user, TicketHistorySearchParameter searchParameter);

	TicketHistory registForTicket(User user, Ticket ticket, Ticket updatedTicket);

	TicketHistory registForReply(User user, String original, String changed, Long ticketEntityId);

	TicketHistory registForActionType(User user, TicketHistorySearchParameter searchParameter);

	TicketHistory registForManualNewTicket(User user, Ticket ticket);

	TicketHistory registForJobHistory(User user, TicketHistorySearchParameter ticket, String type);

	void deleteTicketHistory(Long ticketEntityId);
}
