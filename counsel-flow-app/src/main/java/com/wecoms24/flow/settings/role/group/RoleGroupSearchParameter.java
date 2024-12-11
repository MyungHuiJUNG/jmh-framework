package com.wecoms24.flow.settings.role.group;

import java.util.List;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class RoleGroupSearchParameter extends BaseEntitySearchParameter<RoleGroup, Long> {
	private Long roleEntityId;
	private List<Boolean> usables;

	public RoleGroupSearchParameter() {
		super(RoleGroup.class);
	}

	public Long getRoleEntityId() {
		return roleEntityId;
	}

	public void setRoleEntityId(Long roleEntityId) {
		this.roleEntityId = roleEntityId;
	}

	public List<Boolean> getUsables() {
		return usables;
	}

	public void setUsables(List<Boolean> usables) {
		this.usables = usables;
	}
}
