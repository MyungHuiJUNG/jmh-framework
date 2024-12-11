package com.wecoms24.flow.core.notification;

import java.util.List;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationSearchParameter extends BaseEntitySearchParameter<Notification, Long> {
	private String keyword;
	private List<String> typeCodes;
	private List<Long> receiverEntityIds;

	public NotificationSearchParameter() {
		super(Notification.class);
	}
}
