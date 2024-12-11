package com.wecoms24.flow.counsel.ticket.channel;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketChannelSearchParameter extends BaseEntitySearchParameter<TicketChannel, Long> {
    public TicketChannelSearchParameter() {
        super(TicketChannel.class);
    }
}
