package com.wecoms24.flow.counsel.ticket.channel;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(FlowAppConstants.REST_API_TICKET_CHANNEL)
public class TicketChannelController extends BaseWebCrudController<User, JwtTokenProvider, TicketChannel, Long, TicketChannelDao, TicketChannelSearchParameter, TicketChannelService> {
}
