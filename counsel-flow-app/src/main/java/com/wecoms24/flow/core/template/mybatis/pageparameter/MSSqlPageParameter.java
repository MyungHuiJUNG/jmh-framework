package com.wecoms24.flow.core.template.mybatis.pageparameter;

import com.wecoms24.flow.core.template.mybatis.PageParameter;

public class MSSqlPageParameter extends PageParameter {

	public MSSqlPageParameter(int page, int size) {
		super(page, size);
	}

	public MSSqlPageParameter(int page, int size, boolean isZeroStart, boolean isSlice) {
		super(page, size, isZeroStart, isSlice);
	}
}
