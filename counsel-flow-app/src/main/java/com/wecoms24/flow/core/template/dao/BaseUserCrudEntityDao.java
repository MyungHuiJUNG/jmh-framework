package com.wecoms24.flow.core.template.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.NoRepositoryBean;

import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;
import com.wecoms24.flow.user.User;

@NoRepositoryBean
public interface BaseUserCrudEntityDao<USER_ENTITY extends User, ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> extends BaseCrudEntityDao<ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER> {

	ENTITY_TYPE findOne(USER_ENTITY loginUser, final ENTITY_TYPE entity);
	
	ENTITY_TYPE findOne(USER_ENTITY loginUser,final SEARCH_PARAMETER searchParameter);
	
	ENTITY_TYPE findOneByEntityId(USER_ENTITY loginUser,final ENTITY_ID entityId);

    List<ENTITY_TYPE> find(USER_ENTITY loginUser, final SEARCH_PARAMETER searchParameter);

    Slice<ENTITY_TYPE> findSlice(USER_ENTITY loginUser, final SEARCH_PARAMETER searchParameter, Pageable pageable);
    
    Page<ENTITY_TYPE> findPaging(USER_ENTITY loginUser, final SEARCH_PARAMETER searchParameter, Pageable pageable);
    
    Long findTotalCount(USER_ENTITY loginUser, final SEARCH_PARAMETER searchParameter);

    ENTITY_TYPE create(USER_ENTITY loginUser, final ENTITY_TYPE entity);
    
    ENTITY_TYPE create(USER_ENTITY loginUser, final ENTITY_TYPE entity, boolean isFlushStatement);
    
    List<ENTITY_TYPE> createAll(USER_ENTITY loginUser, List<ENTITY_TYPE> entities);
    
    List<ENTITY_TYPE> createAll(USER_ENTITY loginUser, List<ENTITY_TYPE> entities, boolean isFlushStatement);

    ENTITY_TYPE update(USER_ENTITY loginUser, final ENTITY_TYPE entity);
    
    ENTITY_TYPE update(USER_ENTITY loginUser, ENTITY_ID entityId, final ENTITY_TYPE entity, boolean isExecuteFindOne);
    
    List<ENTITY_TYPE> updateAll(USER_ENTITY loginUser, List<ENTITY_TYPE> entities);

    void remove(USER_ENTITY loginUser, final ENTITY_TYPE entity);

	void removeByEntities(USER_ENTITY loginUser, List<ENTITY_TYPE> entities);
	
	void removeByEntityId(USER_ENTITY loginUser, final ENTITY_ID entityId);
	
	void removeByEntityIds(USER_ENTITY loginUser, List<ENTITY_ID> entityIds);
}
