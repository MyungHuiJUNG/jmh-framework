package com.wecoms24.flow.user.command;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class PersonalCommandSearchParameter extends BaseEntitySearchParameter<PersonalCommand, Long> {
	private Long userEntityId;

	public PersonalCommandSearchParameter() {
		super(PersonalCommand.class);
	}

	public Long getUserEntityId() {
		return userEntityId;
	}

	public void setUserEntityId(Long userEntityId) {
		this.userEntityId = userEntityId;
	}
}
