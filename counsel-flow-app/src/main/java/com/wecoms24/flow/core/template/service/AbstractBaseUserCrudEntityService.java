package com.wecoms24.flow.core.template.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.core.template.dao.BaseUserCrudEntityDao;
import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;
import com.wecoms24.flow.user.User;

public abstract class AbstractBaseUserCrudEntityService<USER_ENTITY extends User, ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, ENTITY_DAO extends BaseUserCrudEntityDao<USER_ENTITY, ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER>, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> implements BaseUserCrudEntityService<USER_ENTITY, ENTITY_TYPE, ENTITY_ID, ENTITY_DAO, SEARCH_PARAMETER> {
	@Autowired
	protected ENTITY_DAO entityDao;
	protected PlatformTransactionManager transactionManager;

	@Override
	public ENTITY_TYPE findOne(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		return entityDao.findOne(loginUser, entity);
	}

	@Override
	public ENTITY_TYPE findOne(USER_ENTITY loginUser, ENTITY_ID entityId) {
		return entityDao.findOneByEntityId(loginUser, entityId);
	}

	@Override
	public List<ENTITY_TYPE> find(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		return entityDao.find(loginUser, searchParameter);
	}

	@Override
	public Slice<ENTITY_TYPE> findSlice(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		Pageable pageable;
		if (searchParameter.getSort() != null) {
			pageable = PageRequest.of(searchParameter.getPage(), searchParameter.getSize(), searchParameter.getSort());
		} else {
			pageable = PageRequest.of(searchParameter.getPage(), searchParameter.getSize());
		}
		return entityDao.findSlice(loginUser, searchParameter, pageable);
	}
	
	@Override
	public Page<ENTITY_TYPE> findPaging(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		Pageable pageable;
		if (searchParameter.getSort() != null) {
			pageable = PageRequest.of(searchParameter.getPage(), searchParameter.getSize(), searchParameter.getSort());
		} else {
			pageable = PageRequest.of(searchParameter.getPage(), searchParameter.getSize());
		}
		return entityDao.findPaging(loginUser, searchParameter, pageable);
	}
	
	@Override
	public Long findTotalCount(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter) {
		return entityDao.findTotalCount(loginUser, searchParameter);
	}

	@Override
	@Transactional(transactionManager = "flowMainTransactionManager")
	public ENTITY_TYPE regist(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		return entityDao.create(loginUser, entity);
	}

	@Override
	@Transactional(transactionManager = "flowMainTransactionManager")
	public List<ENTITY_TYPE> regist(USER_ENTITY loginUser, List<ENTITY_TYPE> entities) {
		return entityDao.createAll(loginUser, entities);
	}

	@Override
	@Transactional(transactionManager = "flowMainTransactionManager")
	public ENTITY_TYPE update(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		return entityDao.update(loginUser, entity);
	}

	@Override
	@Transactional(transactionManager = "flowMainTransactionManager")
	public List<ENTITY_TYPE> update(USER_ENTITY loginUser, List<ENTITY_TYPE> entities) {
		return entityDao.updateAll(loginUser, entities);
	}

	@Override
	@Transactional(transactionManager = "flowMainTransactionManager")
	public void delete(USER_ENTITY loginUser, ENTITY_TYPE entity) {
		entityDao.remove(loginUser, entity);
	}

	@Override
	@Transactional(transactionManager = "flowMainTransactionManager")
	public void delete(USER_ENTITY loginUser, ENTITY_ID entityId) {
		entityDao.removeByEntityId(loginUser, entityId);
	}

	@Override
	@Transactional(transactionManager = "flowMainTransactionManager")
	public void delete(USER_ENTITY loginUser, List<ENTITY_ID> entityIds) {
		entityDao.removeByEntityIds(loginUser, entityIds);
	}
}
