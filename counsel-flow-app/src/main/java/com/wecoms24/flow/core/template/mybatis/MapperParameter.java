package com.wecoms24.flow.core.template.mybatis;

import java.util.Collection;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.util.StringUtils;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class MapperParameter extends LinkedHashMap<String, Object> {
	private static final long serialVersionUID = -5294122173038483690L;
	
	private static DatabaseType defaultDatabaseType = null;

	private DatabaseType databaseType = defaultDatabaseType;
	
	private MapperParameter() {
		this.databaseType = DatabaseType.DEFAULT;
	}

	private MapperParameter(DatabaseType databaseType) {
		this.databaseType = databaseType;
	}

	public static void setDefaultDatabaseType(DatabaseType defaultDatabaseType) {
		MapperParameter.defaultDatabaseType = defaultDatabaseType;
	}

	public static DatabaseType getDefaultDatabaseType() {
		return defaultDatabaseType;
	}
	
	public DatabaseType getDatabaseType() {
		return databaseType;
	}

	public static final class Builder {
		private MapperParameter instance;

		private Builder() {
			instance = new MapperParameter();
		}

		private Builder(DatabaseType databaseType) {
			instance = new MapperParameter(databaseType);
		}

		public <ENTITY_ID> Builder withEntityId(ENTITY_ID entityId) {
			instance.put("entityId", entityId);
			instance.put("isFindOne", "Y");
			return this;
		}

		public <ENTITY_ID> Builder withEntityIds(List<ENTITY_ID> entityIds) {
			instance.put("entityIds", entityIds);
			return this;
		}

		public Builder with(Object value) {
			if (value != null) {
				String key = toCamelCase(value.getClass().getSimpleName());
				instance.put(key, value);
			}
			return this;
		}

		public Builder withSearchParameter(BaseEntitySearchParameter<?, ?> value) {
			if (value != null) {
				instance.put("searchParameter", value);
			}
			return this;
		}

		public Builder withObject(String key, Object value) {
			instance.put(key, value);
			return this;
		}

		public Builder withPage(int page, int countPerPage) {
			return withPage(page, countPerPage, false);
		}

		public Builder withPage(int page, int countPerPage, boolean isZeroStart) {
			return withPage(page, countPerPage, instance.databaseType);
		}

		public Builder withPage(int page, int countPerPage, DatabaseType databaseType) {
			return withPage(page, countPerPage, false, databaseType);
		}

		public Builder withPage(int page, int countPerPage, boolean isZeroStart, DatabaseType databaseType) {
			return withPage(PageRequest.of(page, countPerPage), isZeroStart, databaseType, false);
		}

		public Builder withPage(PageRequest pagingRequest) {
			return withPage(pagingRequest, false);
		}

		public Builder withPage(PageRequest pagingRequest, boolean isZeroStart) {
			return withPage(pagingRequest, isZeroStart, instance.databaseType, false);
		}

		public Builder withPage(PageRequest pagingRequest, DatabaseType databaseType) {
			return withPage(pagingRequest, false, databaseType, false);
		}
		
		public Builder withPage(PageRequest pagingRequest, DatabaseType databaseType, boolean isSlice) {
			return withPage(pagingRequest, false, databaseType, isSlice);
		}

		public Builder withPage(PageRequest pagingRequest, boolean isZeroStart, DatabaseType databaseType, boolean isSlice) {
			PageParameter pageParameter = PageParameter.create(pagingRequest.getPageNumber(), pagingRequest.getPageSize(), isZeroStart, databaseType, isSlice);
			instance.databaseType = databaseType;
			instance.put("pageParam", pageParameter);
			return this;
		}

		public Builder with(String key, String value) {
			instance.put(key, value);
			return this;
		}

		public Builder with(String key, int value) {
			instance.put(key, value);
			return this;
		}

		public Builder with(String key, long value) {
			instance.put(key, value);
			return this;
		}

		public Builder with(String key, float value) {
			instance.put(key, value);
			return this;
		}

		public Builder with(String key, Date value) {
			instance.put(key, value);
			return this;
		}

		public <VALUE_TYPE> Builder with(String key, Collection<VALUE_TYPE> values) {
			instance.put(key, values);
			return this;
		}

		public MapperParameter build() {
			return instance;
		}

		private String toCamelCase(String target) {
			return StringUtils.uncapitalize(target);
		}
	}
	
	public static Builder newBuilder() {
		return new Builder();
	}

	public static <ENTITY_ID> MapperParameter buildWithSeq(ENTITY_ID entityId) {
		return newBuilder().withEntityId(entityId).build();
	}

	public static <ENTITY_ID> MapperParameter buildWithEntityIds(List<ENTITY_ID> entityIds) {
		return newBuilder().withEntityIds(entityIds).build();
	}

	public static MapperParameter buildWithPageParam(int page, int countPerPage) {
		return buildWithPageParam(page, countPerPage, DatabaseType.DEFAULT);
	}

	public static MapperParameter buildWithPageParam(int page, int countPerPage, DatabaseType databaseType) {
		return newBuilder().withPage(page, countPerPage, databaseType).build();
	}

	public static MapperParameter buildWithObject(Object value) {
		return newBuilder().with(value).build();
	}
}
