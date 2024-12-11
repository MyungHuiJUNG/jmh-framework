package com.wecoms24.flow.core.template.mybatis.pageparameter;

import com.wecoms24.flow.core.template.mybatis.PageParameter;

public class DefaultPageParameter extends PageParameter {

	public DefaultPageParameter(int page, int size) {
		super(page, size);
	}
	
	public DefaultPageParameter(int page, int size, boolean isZeroStart, boolean isSlice) {
		super(page, size, isZeroStart, isSlice);
	}
}
