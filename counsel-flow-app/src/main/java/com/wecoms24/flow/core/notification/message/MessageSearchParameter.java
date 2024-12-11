package com.wecoms24.flow.core.notification.message;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageSearchParameter extends BaseEntitySearchParameter<Message, Long> {
	private String keyword;
	private Long senderEntityId;
	
	public MessageSearchParameter() {
		super(Message.class);
	}
}
