package com.wecoms24.flow.core.template.mybatis;

public class FlowDefaultQueryIds implements FlowQueryIds {
	private Class<?> entityClass;
	
	public FlowDefaultQueryIds(Class<?> entityClass) {
		this.entityClass = entityClass;
	}
	
	@Override
	public String getName(String methodName) {
		return getNameSpace() + "." + methodName;
	}

	protected String makeQueryId(String method, String addName) {
		final String queryIdFormat = addName != null && addName.length() > 0 ? "%s.%s.%s" : "%s.%s";
		final String nameSpace = getNameSpace().toLowerCase();
		return String.format(queryIdFormat, nameSpace, method, addName);
	}
	
	protected String getNameSpace() {
		return entityClass.getSimpleName().toLowerCase();
	}
}
