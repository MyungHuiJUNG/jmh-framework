package com.wecoms24.flow.settings.role;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class RoleSearchParameter extends BaseEntitySearchParameter<Role, Long> {

	public RoleSearchParameter() {
		super(Role.class);
		setIsTopCode(true);
	}
}
