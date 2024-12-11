package com.wecoms24.flow.core.template.dao.mybatis;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.dao.BaseCrudEntityDao;
import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;
import com.wecoms24.flow.core.template.mybatis.DatabaseType;
import com.wecoms24.flow.core.template.mybatis.FlowDefaultQueryIds;
import com.wecoms24.flow.core.template.mybatis.FlowQueryIds;
import com.wecoms24.flow.core.template.mybatis.MapperParameter;
import com.wecoms24.flow.core.template.mybatis.MapperParameter.Builder;

public abstract class AbstractBaseCrudEntityMybatisDao<ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> implements BaseCrudEntityDao<ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER> {
	private FlowQueryIds queryIds;
	private Class<SEARCH_PARAMETER> searchParameterClass;
	private String sequenceName;
	private Class<ENTITY_TYPE> entityClass;
	private SqlSession sqlSession;
	private DatabaseType databaseType;
	
	public AbstractBaseCrudEntityMybatisDao(Class<ENTITY_TYPE> entityClass, Class<SEARCH_PARAMETER> searchParameterClass, SqlSession sqlSession) {
		this.entityClass = entityClass;
		this.queryIds = new FlowDefaultQueryIds(entityClass);
		this.searchParameterClass = searchParameterClass;
		this.sqlSession = sqlSession;
		databaseType = DatabaseType.DEFAULT;
	}
	
	public AbstractBaseCrudEntityMybatisDao(Class<ENTITY_TYPE> entityClass, Class<SEARCH_PARAMETER> searchParameterClass, SqlSession sqlSession, String sequenceName) {
		this(entityClass, searchParameterClass, sqlSession);
		this.sequenceName = sequenceName;
	}

	@Override
	public ENTITY_TYPE findOne(ENTITY_TYPE entity) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.setEntity(entity);
		return findOne(searchParameter);
	}

	@Override
	public ENTITY_TYPE findOne(SEARCH_PARAMETER searchParameter) {
		return sqlSession.selectOne(getQueryId("findOne"), buildMapperParameterWithObjects(searchParameter));
	}

	@Override
	public ENTITY_TYPE findOneByEntityId(ENTITY_ID entityId) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.getEntity().setEntityId(entityId);
		return findOne(searchParameter);
	}

	@Override
	public List<ENTITY_TYPE> find(SEARCH_PARAMETER searchParameter) {
		return sqlSession.selectList(getQueryId("find"), buildMapperParameterWithObjects(searchParameter));
	}

	@Override
	public Slice<ENTITY_TYPE> findSlice(SEARCH_PARAMETER searchParameter, Pageable pageable) {
		PageRequest pagingRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
		Builder builder = MapperParameter.newBuilder();
		builder.withPage(pagingRequest, true, getDatabaseType(), true);
		builder.withSearchParameter(searchParameter);
		List<ENTITY_TYPE> entities = sqlSession.selectList(getQueryId("find"), builder.build());
		
		return createSliceContents(pagingRequest, builder.build(), entities);
	}
	
	@Override
	public Page<ENTITY_TYPE> findPaging(SEARCH_PARAMETER searchParameter, Pageable pageable) {
		PageRequest pagingRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
		Builder builder = MapperParameter.newBuilder();
		builder.withPage(pagingRequest, true, getDatabaseType(), false);
		builder.withSearchParameter(searchParameter);
		
		return find(pagingRequest, builder.build());
	}
	
	@Override
	public Long findTotalCount(SEARCH_PARAMETER searchParameter) {
		Builder builder = MapperParameter.newBuilder();
		builder.withSearchParameter(searchParameter);
		return getTotalCount(builder.build());
	}

	@Override
	@Transactional
	public ENTITY_TYPE create(ENTITY_TYPE entity) {
		return create(entity, true);
	}
	
	@Override
	@Transactional
	public ENTITY_TYPE create(ENTITY_TYPE entity, boolean isFlushStatement) {
		return saveByEntitiesAndObjectsAndIsFlushStatment(entity, isFlushStatement);
	}
	
	@Override
	@Transactional
	public List<ENTITY_TYPE> createAll(List<ENTITY_TYPE> entities) {
		return createAll(entities, true);
	}

	@Override
	@Transactional
	public List<ENTITY_TYPE> createAll(List<ENTITY_TYPE> entities, boolean isFlushStatement) {
		return saveByEntitiesAndObjectsAndIsFlushStatment(entities, isFlushStatement);
	}

	@Override
	@Transactional
	public ENTITY_TYPE update(ENTITY_TYPE entity) {
		return update(entity.getEntityId(), entity, true);
	}
	
	@Override
	public ENTITY_TYPE update(ENTITY_ID entityId, ENTITY_TYPE entity, boolean isExecuteFindOne) {
		Builder builder = MapperParameter.newBuilder();
		builder.withEntityId(entityId);
		builder.with(entity);
		getSqlSession().update(getQueryId("update"), builder.build());
		if (isExecuteFindOne) {
			return findOneByEntityId(entityId);
		}
		return entity;
	}

	@Override
	@Transactional
	public List<ENTITY_TYPE> updateAll(List<ENTITY_TYPE> entities) {
		List<ENTITY_ID> updateEntityEntityIds = new ArrayList<>();
		if (entities != null) {
			for (ENTITY_TYPE entity : entities) {
				Builder builder = MapperParameter.newBuilder();
				builder.with(entity);
				getSqlSession().update(getQueryId("update"), builder.build());
				
				if (entity.getEntityId() != null) {
					updateEntityEntityIds.add(entity.getEntityId());
				}
			}
		}
		
		if (updateEntityEntityIds.size() > 0) {
			SEARCH_PARAMETER searchParameter = createSearchParameter();
			searchParameter.setEntityIds(updateEntityEntityIds);
			return find(searchParameter);
		}
		return entities;
	}

	@Override
	@Transactional
	public void remove(ENTITY_TYPE entity) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.setEntity(entity);
		getSqlSession().delete(getQueryId("delete"), buildMapperParameterWithObjects(searchParameter));
	}

	@Override
	@Transactional
	public void removeByEntities(List<ENTITY_TYPE> entities) {
		List<ENTITY_ID> entityIds = new ArrayList<>();
		for (ENTITY_TYPE entity : entities) {
			entityIds.add(entity.getEntityId());
		}
		removeByEntityIds(entityIds);
	}

	@Override
	@Transactional
	public void removeByEntityId(ENTITY_ID entityId) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.getEntity().setEntityId(entityId);
		getSqlSession().delete(getQueryId("delete"), buildMapperParameterWithObjects(searchParameter));
	}

	@Override
	@Transactional
	public void removeByEntityIds(List<ENTITY_ID> entityIds) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.setEntityIds(entityIds);
		getSqlSession().delete(getQueryId("delete"), buildMapperParameterWithObjects(searchParameter));
	}

	protected List<Object> makeObjectParams(ENTITY_TYPE entity, Object... objects) {
		List<Object> objectParams = new ArrayList<>();
		if (objects != null && objects.length > 0) {
			objectParams.addAll(Arrays.asList(objects));
		}
		objectParams.add(entity);
		return objectParams;
	}
	
	protected MapperParameter buildMapperParameterWithObjects(Object ...parameters) {
		Builder builder = MapperParameter.newBuilder();
		if (parameters != null) {
			for (Object parameter : parameters) {
				if (parameter instanceof BaseEntitySearchParameter<?, ?>) {
					builder.withSearchParameter((BaseEntitySearchParameter<?, ?>) parameter);
				} else {
					builder.with(parameter);
				}
			}
		}
		
		return builder.build();
	}
	
	protected String getQueryId(String methodName) {
		return queryIds.getName(methodName);
	}
	
	protected List<ENTITY_ID> selectKeys(String sequenceName, int keyCount) {
		Builder builder = MapperParameter.newBuilder();
		builder.with("sequenceName", sequenceName);
		builder.with("keyCount", keyCount);
		List<ENTITY_ID> keys = sqlSession.selectList("common.selectKeys", builder.build());
		return keys;
	}
	
	protected List<ENTITY_ID> getSequences(int entityCount) {
		List<ENTITY_ID> keys = null;
		if (sequenceName != null && sequenceName.isEmpty() == false) {
			keys = selectKeys(sequenceName, entityCount);
		}
		return keys;
	}
	
	@Transactional
	public ENTITY_TYPE saveByEntitiesAndObjectsAndIsFlushStatment(ENTITY_TYPE entity, boolean isFlushStatement, Object...objects) {
		List<ENTITY_ID> entityIds = getSequences(1);
		if (entityIds != null && entityIds.size() > 0) {
			entity.setEntityId(entityIds.get(0));
		}
		
		List<Object> objectParams = makeObjectParams(entity, objects);
		if (isFlushStatement) {
			sqlSession.insert(getQueryId("save"), buildMapperParameterWithObjects(objectParams.toArray()));
			sqlSession.flushStatements();
		} else {
			sqlSession.insert(getQueryId("save"), buildMapperParameterWithObjects(objectParams.toArray()));
		}
		return entity;
	}
	
	@Transactional
	public List<ENTITY_TYPE> saveByEntitiesAndObjectsAndIsFlushStatment(List<ENTITY_TYPE> entities, boolean isFlushStatement, Object...objects) {
		if (entities == null || entities.isEmpty()) {
			return null;
		}
		List<ENTITY_ID> entityIds = getSequences(entities.size());
		for (int i = 0; i < entities.size(); i++) {
			ENTITY_TYPE entity = entities.get(i);
			if (entityIds != null && i < entityIds.size()) {
				entity.setEntityId(entityIds.get(i));
			}
			
			List<Object> objectParams = makeObjectParams(entity, objects);
			sqlSession.insert(getQueryId("save"), buildMapperParameterWithObjects(objectParams.toArray()));
		}
		
		if (isFlushStatement) {
			sqlSession.flushStatements();
		}
		return entities;
	}
	
	public SEARCH_PARAMETER createSearchParameter() {
		try {
			return searchParameterClass.getConstructor().newInstance();
		} catch (Exception e) {
			throw new FlowException(FlowErrorCode.UNKNOWN_ERROR);
		}
	}
	
	protected Slice<ENTITY_TYPE> createSliceContents(PageRequest pagingRequest, MapperParameter mapperParameter, List<ENTITY_TYPE> entities) {
        int size = pagingRequest.getPageSize();

        boolean hasNext = entities.size() > size;
        if (hasNext) {
        	entities.remove(entities.size() - 1);
        }
        
        return new SliceImpl<>(entities, pagingRequest, hasNext);
	}
	
	protected Page<ENTITY_TYPE> find(PageRequest pagingRequest, MapperParameter mapperParameter) {
		List<ENTITY_TYPE> entities = sqlSession.selectList(getQueryId("find"), mapperParameter);
		return createPagingContents(pagingRequest, mapperParameter, entities);
	}
	
	protected Page<ENTITY_TYPE> createPagingContents(PageRequest pagingRequest, MapperParameter mapperParameter, List<ENTITY_TYPE> entities) {
		long totalCount = getTotalCount(mapperParameter);	
		
		return new PageImpl<>(entities, pagingRequest, totalCount);
	}
	
	protected long getTotalCount(MapperParameter mapperParameter) {
		Map<String, Object> totalCountResult = sqlSession.selectOne(getQueryId("totalCount"), mapperParameter);
		Object totalCountObject = totalCountResult.get("TOTALCOUNT");
		long totalCount = 0;
		if (totalCountObject instanceof BigDecimal) {
			totalCount = ((BigDecimal) totalCountObject).longValue();
		} else if (totalCountObject instanceof Long) {
			totalCount = (long) totalCountObject;
		} else if (totalCountObject instanceof Integer) {
			totalCount = (int) totalCountObject;
		} else {
			totalCount = -1L;
		}
		
		return totalCount;
	}
	
	public SqlSession getSqlSession() {
		return sqlSession;
	}

	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	public DatabaseType getDatabaseType() {
		return databaseType;
	}

	public void setDatabaseType(DatabaseType databaseType) {
		this.databaseType = databaseType;
	}

	public Class<ENTITY_TYPE> getEntityClass() {
		return entityClass;
	}
	
	public Class<SEARCH_PARAMETER> getSearchParameterClass() {
		return searchParameterClass;
	}
}
