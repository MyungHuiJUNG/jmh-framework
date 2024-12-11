package com.wecoms24.flow.counsel.ticket.history;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface TicketHistoryDao extends BaseUserCrudEntityJpaDao<User, TicketHistory, Long, TicketHistorySearchParameter> {

}