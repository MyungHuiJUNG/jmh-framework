package com.wecoms24.flow.counsel.ticket.channel;

import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
public class TicketChannelServiceImpl extends AbstractBaseUserCrudEntityService<User, TicketChannel, Long, TicketChannelDao, TicketChannelSearchParameter> implements TicketChannelService {

    @Override
    public void deleteTicketChannel(Long ticketEntityId) {
        TicketChannelSearchParameter searchParameter = new TicketChannelSearchParameter();
        searchParameter.getEntity().setTicketEntityId(ticketEntityId);

        List<TicketChannel> channels = entityDao.find(searchParameter);

        entityDao.removeByEntities(channels);
    }
}
