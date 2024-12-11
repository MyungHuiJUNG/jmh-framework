package com.wecoms24.flow.counsel.ticket;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface TicketDao extends BaseUserCrudEntityJpaDao<User, Ticket, Long, TicketSearchParameter> {
}
