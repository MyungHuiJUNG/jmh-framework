package com.wecoms24.flow.counsel.ticket.channel;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface TicketChannelService extends BaseUserCrudEntityService<User, TicketChannel, Long, TicketChannelDao, TicketChannelSearchParameter> {

    void deleteTicketChannel(Long ticketEntityId);
}
