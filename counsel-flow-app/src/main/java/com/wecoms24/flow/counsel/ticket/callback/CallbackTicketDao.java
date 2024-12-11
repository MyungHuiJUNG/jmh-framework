package com.wecoms24.flow.counsel.ticket.callback;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface CallbackTicketDao extends BaseUserCrudEntityJpaDao<User, CallbackTicket, Long, CallbackTicketSearchParameter> {
}
