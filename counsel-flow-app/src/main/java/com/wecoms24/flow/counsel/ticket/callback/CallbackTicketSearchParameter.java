package com.wecoms24.flow.counsel.ticket.callback;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CallbackTicketSearchParameter extends BaseEntitySearchParameter<CallbackTicket, Long> {
	private Boolean isUnAssignCallback;
	private Long managerEntityId;
	private String ticketStatusCode;
	
    public CallbackTicketSearchParameter() {
        super(CallbackTicket.class);
    }
}
