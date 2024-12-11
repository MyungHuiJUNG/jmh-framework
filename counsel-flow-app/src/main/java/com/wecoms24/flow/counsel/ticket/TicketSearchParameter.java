package com.wecoms24.flow.counsel.ticket;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class TicketSearchParameter extends BaseEntitySearchParameter<Ticket, Long> {
    public TicketSearchParameter() {
        super(Ticket.class);
    }
}
