package com.wecoms24.flow.core.template.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;

import com.wecoms24.flow.core.template.dao.BaseCrudEntityDao;
import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;
import com.wecoms24.flow.user.User;

public interface BaseUserCrudEntityService<USER_ENTITY extends User, ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, ENTITY_DAO extends BaseCrudEntityDao<ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER>, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> {

	ENTITY_TYPE findOne(USER_ENTITY loginUser, ENTITY_TYPE entity);
	
	ENTITY_TYPE findOne(USER_ENTITY loginUser, ENTITY_ID entityId);

    List<ENTITY_TYPE> find(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter);

    Slice<ENTITY_TYPE> findSlice(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter);
    
    Page<ENTITY_TYPE> findPaging(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter);

    Long findTotalCount(USER_ENTITY loginUser, SEARCH_PARAMETER searchParameter);
    
    ENTITY_TYPE regist(USER_ENTITY loginUser, ENTITY_TYPE entity);

    List<ENTITY_TYPE> regist(USER_ENTITY loginUser, List<ENTITY_TYPE> entities);

    ENTITY_TYPE update(USER_ENTITY loginUser, final ENTITY_TYPE entity);
    
    List<ENTITY_TYPE> update(USER_ENTITY loginUser, List<ENTITY_TYPE> entities);

    void delete(USER_ENTITY loginUser, ENTITY_TYPE entity);

	void delete(USER_ENTITY loginUser, ENTITY_ID entityId);
	
	void delete(USER_ENTITY loginUser, List<ENTITY_ID> entityIds);
}
