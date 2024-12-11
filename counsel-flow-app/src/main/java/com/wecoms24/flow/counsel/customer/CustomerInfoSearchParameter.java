package com.wecoms24.flow.counsel.customer;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class CustomerInfoSearchParameter extends BaseEntitySearchParameter<CustomerInfo, Long> {
	private String searchTel;

	public CustomerInfoSearchParameter() {
		super(CustomerInfo.class);
	}

	public String getSearchTel() {
		return searchTel;
	}

	public void setSearchTel(String searchTel) {
		this.searchTel = searchTel;
	}
}
