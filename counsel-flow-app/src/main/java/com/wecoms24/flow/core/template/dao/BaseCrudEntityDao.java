package com.wecoms24.flow.core.template.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.NoRepositoryBean;

import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

@NoRepositoryBean
public interface BaseCrudEntityDao<ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> {

	ENTITY_TYPE findOne(final ENTITY_TYPE entity);
	
	ENTITY_TYPE findOne(final SEARCH_PARAMETER searchParameter);
	
	ENTITY_TYPE findOneByEntityId(final ENTITY_ID entityId);

    List<ENTITY_TYPE> find(final SEARCH_PARAMETER searchParameter);

    Slice<ENTITY_TYPE> findSlice(final SEARCH_PARAMETER searchParameter, Pageable pageable);
    
    Page<ENTITY_TYPE> findPaging(final SEARCH_PARAMETER searchParameter, Pageable pageable);

    Long findTotalCount(final SEARCH_PARAMETER searchParameter);
    
    ENTITY_TYPE create(final ENTITY_TYPE entity);
    
    ENTITY_TYPE create(final ENTITY_TYPE entity, boolean isFlushStatement);
    
    List<ENTITY_TYPE> createAll(List<ENTITY_TYPE> entities);
    
    List<ENTITY_TYPE> createAll(List<ENTITY_TYPE> entities, boolean isFlushStatement);

    ENTITY_TYPE update(final ENTITY_TYPE entity);
    
    ENTITY_TYPE update(ENTITY_ID entityId, final ENTITY_TYPE entity, boolean isExecuteFindOne);
    
    List<ENTITY_TYPE> updateAll(List<ENTITY_TYPE> entities);

    void remove(final ENTITY_TYPE entity);

	void removeByEntities(List<ENTITY_TYPE> entities);
	
	void removeByEntityId(final ENTITY_ID entityId);
	
	void removeByEntityIds(List<ENTITY_ID> entityIds);
	
}
