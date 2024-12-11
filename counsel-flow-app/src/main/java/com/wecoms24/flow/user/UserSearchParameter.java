package com.wecoms24.flow.user;

import java.util.List;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class UserSearchParameter extends BaseEntitySearchParameter<User, Long> {
	private List<String> useTypeCodes;
	private String organizationPath;

	public UserSearchParameter() {
		super(User.class);
	}

	public List<String> getUseTypeCodes() {
		return useTypeCodes;
	}

	public void setUseTypeCodes(List<String> useTypeCodes) {
		this.useTypeCodes = useTypeCodes;
	}

	public String getOrganizationPath() {
		return organizationPath;
	}

	public void setOrganizationPath(String organizationPath) {
		this.organizationPath = organizationPath;
	}
}
