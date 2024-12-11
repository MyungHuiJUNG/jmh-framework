package com.wecoms24.flow.auth.access;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class AccessLogSearchParameter extends BaseEntitySearchParameter<AccessLog, Long> {

	public AccessLogSearchParameter() {
		super(AccessLog.class);
	}
}
