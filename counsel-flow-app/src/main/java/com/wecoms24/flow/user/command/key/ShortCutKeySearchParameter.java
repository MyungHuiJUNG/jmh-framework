package com.wecoms24.flow.user.command.key;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class ShortCutKeySearchParameter extends BaseEntitySearchParameter<ShortCutKey, Long> {
	private Long commandEntityId;

	public ShortCutKeySearchParameter() {
		super(ShortCutKey.class);
	}

	public Long getCommandEntityId() {
		return commandEntityId;
	}

	public void setCommandEntityId(Long commandEntityId) {
		this.commandEntityId = commandEntityId;
	}
}
