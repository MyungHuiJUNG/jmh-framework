package com.wecoms24.flow.counsel.ticket.history;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketHistorySearchParameter extends BaseEntitySearchParameter<TicketHistory, Long> {
	private Long ticketEntityId;
	private String target;
	private String channelType;
	private String prevData;
	private String newData;

	public TicketHistorySearchParameter() {
		super(TicketHistory.class);
	}

}
