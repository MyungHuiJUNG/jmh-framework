package com.wecoms24.flow.settings.menu;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class MenuSearchParameter extends BaseEntitySearchParameter<Menu, Long> {
	private String removeIconType;

	public MenuSearchParameter() {
		super(Menu.class);
		setIsTopCode(true);
	}

	public String getRemoveIconType() {
		return removeIconType;
	}

	public void setRemoveIconType(String removeIconType) {
		this.removeIconType = removeIconType;
	}
}
