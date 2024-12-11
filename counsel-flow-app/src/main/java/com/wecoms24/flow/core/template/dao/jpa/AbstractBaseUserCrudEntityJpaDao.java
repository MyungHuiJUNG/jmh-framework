package com.wecoms24.flow.core.template.dao.jpa;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.core.template.dao.BaseUserCrudEntityDao;
import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;

public abstract class AbstractBaseUserCrudEntityJpaDao<USER_ENTITY extends User, ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> extends AbstractBaseCrudEntityJpaDao<ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER> implements BaseUserCrudEntityDao<USER_ENTITY, ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER> {

	public AbstractBaseUserCrudEntityJpaDao(Class<ENTITY_TYPE> entityClass, Class<SEARCH_PARAMETER> searchParameterClass, EntityManager entityManager) {
		super(entityClass, searchParameterClass, entityManager);
	}

	@Override
	public ENTITY_TYPE findOne(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		return super.findOne(entity);
	}

	@Override
	public ENTITY_TYPE findOne(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		return super.findOne(searchParameter);
	}

	@Override
	public ENTITY_TYPE findOneByEntityId(USER_ENTITY loginUser, ENTITY_ID entityId) {
		return super.findOneByEntityId(entityId);
	}

	@Override
	public List<ENTITY_TYPE> find(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		return super.find(searchParameter);
	}

	@Override
	public Slice<ENTITY_TYPE> findSlice(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter, Pageable pageable) {
		return super.findSlice(searchParameter, pageable);
	}
	
	@Override
	public Page<ENTITY_TYPE> findPaging(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter, Pageable pageable) {
		return super.findPaging(searchParameter, pageable);
	}
	
	@Override
	public Long findTotalCount(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		return super.findTotalCount(searchParameter);
	}

	@Transactional
	@Override
	public ENTITY_TYPE create(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		return super.create(entity);
	}

	@Transactional
	@Override
	public ENTITY_TYPE create(USER_ENTITY loginUser, ENTITY_TYPE entity, boolean isFlushStatement) {
		return super.create(entity, isFlushStatement);
	}

	@Transactional
	@Override
	public List<ENTITY_TYPE> createAll(USER_ENTITY loginUser, List<ENTITY_TYPE> entities) {
		return super.createAll(entities);
	}

	@Transactional
	@Override
	public List<ENTITY_TYPE> createAll(USER_ENTITY loginUser, List<ENTITY_TYPE> entities, boolean isFlushStatement) {
		return super.createAll(entities, isFlushStatement);
	}

	@Transactional
	@Override
	public ENTITY_TYPE update(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		return update(loginUser, entity.getEntityId(), entity, true);
	}
	
	@Override
	public ENTITY_TYPE update(USER_ENTITY loginUser, ENTITY_ID entityId, ENTITY_TYPE entity, boolean isExecuteFindOne) {
		return super.update(entityId, entity, isExecuteFindOne);
	}

	@Transactional
	@Override
	public List<ENTITY_TYPE> updateAll(USER_ENTITY loginUser, List<ENTITY_TYPE> entities) {
		return super.updateAll(entities);
	}

	@Override
	public void remove(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		super.remove(entity);
	}

	@Transactional
	@Override
	public void removeByEntities(USER_ENTITY loginUser, List<ENTITY_TYPE> entities) {
		super.removeByEntities(entities);
	}

	@Transactional
	@Override
	public void removeByEntityId(USER_ENTITY loginUser, ENTITY_ID entityId) {
		super.removeByEntityId(entityId);
	}

	@Transactional
	@Override
	public void removeByEntityIds(USER_ENTITY loginUser, List<ENTITY_ID> entityIds) {
		super.removeByEntityIds(entityIds);
	}
}
