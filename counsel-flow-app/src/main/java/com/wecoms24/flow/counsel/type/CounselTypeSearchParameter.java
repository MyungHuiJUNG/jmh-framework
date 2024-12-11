package com.wecoms24.flow.counsel.type;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class CounselTypeSearchParameter extends BaseEntitySearchParameter<CounselType, Long> {

	public CounselTypeSearchParameter() {
		super(CounselType.class);
		setIsTopCode(true);
	}
}
