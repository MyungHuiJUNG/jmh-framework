package com.wecoms24.flow.settings.valiable;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class SystemVariableSearchParameter extends BaseEntitySearchParameter<SystemVariable, String> {

	public SystemVariableSearchParameter() {
		super(SystemVariable.class);
		setIsTopCode(true);
	}
}
