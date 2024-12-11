package com.wecoms24.flow.core.template.dao.mybatis;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.core.template.dao.BaseUserCrudEntityDao;
import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;
import com.wecoms24.flow.core.template.mybatis.MapperParameter;
import com.wecoms24.flow.core.template.mybatis.MapperParameter.Builder;
import com.wecoms24.flow.user.User;

public abstract class AbstractBaseUserCrudEntityMybatisDao<USER_ENTITY extends User, ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> extends AbstractBaseCrudEntityMybatisDao<ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER> implements BaseUserCrudEntityDao<USER_ENTITY, ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER> {

	public AbstractBaseUserCrudEntityMybatisDao(Class<ENTITY_TYPE> entityClass, Class<SEARCH_PARAMETER> searchParameterClass, SqlSession sqlSession) {
		super(entityClass, searchParameterClass, sqlSession);
	}
	
	public AbstractBaseUserCrudEntityMybatisDao(Class<ENTITY_TYPE> entityClass, Class<SEARCH_PARAMETER> searchParameterClass, SqlSession sqlSession, String sequenceName) {
		super(entityClass, searchParameterClass, sqlSession, sequenceName);
	}

	@Override
	public ENTITY_TYPE findOne(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.setEntity(entity);
		return findOne(loginUser, searchParameter);
	}

	@Override
	public ENTITY_TYPE findOne(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		return getSqlSession().selectOne(getQueryId("findOne"), buildMapperParameterWithObjects(loginUser, searchParameter));
	}

	@Override
	public ENTITY_TYPE findOneByEntityId(USER_ENTITY loginUser, ENTITY_ID entityId) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.getEntity().setEntityId(entityId);
		return findOne(loginUser, searchParameter);
	}

	@Override
	public List<ENTITY_TYPE> find(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		return getSqlSession().selectList(getQueryId("find"), buildMapperParameterWithObjects(loginUser, searchParameter));
	}

	@Override
	public Slice<ENTITY_TYPE> findSlice(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter, Pageable pageable) {
		PageRequest pagingRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
		Builder builder = MapperParameter.newBuilder();
		builder.withPage(pagingRequest, true, getDatabaseType(), true);
		builder.with(loginUser);
		builder.withSearchParameter(searchParameter);
		List<ENTITY_TYPE> entities = getSqlSession().selectList(getQueryId("find"), builder.build());
		
		return createSliceContents(pagingRequest, builder.build(), entities);
	}
	
	@Override
	public Page<ENTITY_TYPE> findPaging(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter, Pageable pageable) {
		PageRequest pagingRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
		Builder builder = MapperParameter.newBuilder();
		builder.withPage(pagingRequest, true, getDatabaseType(), false);
		builder.with(loginUser);
		builder.withSearchParameter(searchParameter);
		
		return find(pagingRequest, builder.build());
	}
	
	@Override
	public Long findTotalCount(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		return super.findTotalCount(searchParameter);
	}

	@Override
	@Transactional
	public ENTITY_TYPE create(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		return super.saveByEntitiesAndObjectsAndIsFlushStatment(entity, true, loginUser);
	}

	@Override
	@Transactional
	public ENTITY_TYPE create(USER_ENTITY loginUser, ENTITY_TYPE entity, boolean isFlushStatement) {
		return super.saveByEntitiesAndObjectsAndIsFlushStatment(entity, isFlushStatement, loginUser);
	}

	@Override
	@Transactional
	public List<ENTITY_TYPE> createAll(USER_ENTITY loginUser, List<ENTITY_TYPE> entities) {
		return createAll(loginUser, entities, true);
	}

	@Override
	@Transactional
	public List<ENTITY_TYPE> createAll(USER_ENTITY loginUser, List<ENTITY_TYPE> entities, boolean isFlushStatement) {
		return saveByEntitiesAndObjectsAndIsFlushStatment(entities, isFlushStatement, loginUser);
	}

	@Override
	@Transactional
	public ENTITY_TYPE update(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		return update(loginUser, entity.getEntityId(), entity, true);
	}
	
	@Override
	public ENTITY_TYPE update(USER_ENTITY loginUser, ENTITY_ID entityId, ENTITY_TYPE entity, boolean isExecuteFindOne) {
		Builder builder = MapperParameter.newBuilder();
		builder.withEntityId(entityId);
		builder.with(loginUser);
		builder.with(entity);
		getSqlSession().update(getQueryId("update"), builder.build());
		if (isExecuteFindOne) {
			return findOneByEntityId(loginUser, entityId);
		}
		return entity;
	}

	@Override
	@Transactional
	public List<ENTITY_TYPE> updateAll(USER_ENTITY loginUser, List<ENTITY_TYPE> entities) {
		List<ENTITY_ID> updateEntityEntityIds = new ArrayList<>();
		if (entities != null) {
			for (ENTITY_TYPE entity : entities) {
				Builder builder = MapperParameter.newBuilder();
				builder.with(loginUser);
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
			return find(loginUser, searchParameter);
		}
		return entities;
	}

	@Override
	@Transactional
	public void remove(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.setEntity(entity);
		getSqlSession().delete(getQueryId("delete"), buildMapperParameterWithObjects(loginUser, searchParameter));
	}

	@Override
	@Transactional
	public void removeByEntities(USER_ENTITY loginUser, List<ENTITY_TYPE> entities) {
		List<ENTITY_ID> entityIds = new ArrayList<>();
		for (ENTITY_TYPE entity : entities) {
			entityIds.add(entity.getEntityId());
		}
		removeByEntityIds(loginUser, entityIds);
	}

	@Override
	@Transactional
	public void removeByEntityId(USER_ENTITY loginUser, ENTITY_ID entityId) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.getEntity().setEntityId(entityId);
		getSqlSession().delete(getQueryId("delete"), buildMapperParameterWithObjects(loginUser, searchParameter));
	}

	@Override
	@Transactional
	public void removeByEntityIds(USER_ENTITY loginUser, List<ENTITY_ID> entityIds) {
		SEARCH_PARAMETER searchParameter = createSearchParameter();
		searchParameter.setEntityIds(entityIds);
		getSqlSession().delete(getQueryId("delete"), buildMapperParameterWithObjects(loginUser, searchParameter));
	}
}
