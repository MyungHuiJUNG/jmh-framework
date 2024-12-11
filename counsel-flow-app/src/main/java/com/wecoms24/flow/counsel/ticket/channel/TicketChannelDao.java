package com.wecoms24.flow.counsel.ticket.channel;
import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface TicketChannelDao extends BaseUserCrudEntityJpaDao<User, TicketChannel, Long, TicketChannelSearchParameter> {

}