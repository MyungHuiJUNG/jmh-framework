package com.wecoms24.flow.counsel.organization;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class OrganizationSearchParameter extends BaseEntitySearchParameter<Organization, Long> {

	public OrganizationSearchParameter() {
		super(Organization.class);
		setIsTopCode(true);
	}
}
