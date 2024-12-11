package com.wecoms24.flow.core.template.mybatis;

import com.wecoms24.flow.core.template.mybatis.pageparameter.DefaultPageParameter;
import com.wecoms24.flow.core.template.mybatis.pageparameter.MSSqlPageParameter;
import com.wecoms24.flow.core.template.mybatis.pageparameter.MySqlPageParameter;
import com.wecoms24.flow.core.template.mybatis.pageparameter.OraclePageParameter;

public class PageParameter {
	private int page;
	private int size;
	private boolean isZeroStart;
	private boolean isSlice;
	
	public PageParameter(int page, int size) {
		this(page, size, false, false);
	}

	public PageParameter(int page, int size, boolean isZeroStart, boolean isSlice) {
		this.page = isZeroStart ? page + 1 : page;
		this.size = size;
		this.isZeroStart = isZeroStart;
		this.isSlice = isSlice;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public int getStartRowNum() {
		return calcStartRowNum(1);
	}
	
	public int calcStartRowNum(int offset) {
		return (page - 1) * size + offset;
	}
	
	public int getEndRowNum() {
		return isSlice ? calcEndRowNum(1) + 1: calcEndRowNum(1);
	}
	
	public int calcEndRowNum(int offset) {
		return calcStartRowNum(offset) + size - 1;
	}
	
	public boolean isZeroStart() {
		return isZeroStart;
	}

	public void setZeroStart(boolean isZeroStart) {
		this.isZeroStart = isZeroStart;
	}
	
	public boolean isSlice() {
		return isSlice;
	}

	public void setSlice(boolean isSlice) {
		this.isSlice = isSlice;
	}

	public static PageParameter create(int page, int size) {
		return create(page, size, false);
	}

	public static PageParameter create(int page, int size, boolean isZeroStart) {
		return create(page, size, isZeroStart, DatabaseType.DEFAULT, false);
	}

	public static PageParameter create(int page, int size, boolean isZeroStart, DatabaseType databaseType, boolean isSlice) {
		PageParameter pageParameter = null;
		switch (databaseType) {
		case MY_SQL:
			pageParameter = new MySqlPageParameter(page, size, isZeroStart, isSlice);
			break;

		case ORACLE:
			pageParameter = new OraclePageParameter(page, size, isZeroStart, isSlice);
			break;

		case MS_SQL:
			pageParameter = new MSSqlPageParameter(page, size, isZeroStart, isSlice);
			break;
			
		default:
			pageParameter = new DefaultPageParameter(page, size, isZeroStart, isSlice);
			break;

		}
		return pageParameter;
	}
}
