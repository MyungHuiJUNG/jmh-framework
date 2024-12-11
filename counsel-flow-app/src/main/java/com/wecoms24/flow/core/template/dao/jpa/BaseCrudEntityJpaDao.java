package com.wecoms24.flow.core.template.dao.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import com.wecoms24.flow.core.template.dao.BaseCrudEntityDao;
import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

import jakarta.persistence.EntityManager;

@NoRepositoryBean
public interface BaseCrudEntityJpaDao<ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> extends BaseCrudEntityDao<ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER>, JpaRepository<ENTITY_TYPE, ENTITY_ID> {

	void isRealDelete(Boolean isRealDelete);
	
	Boolean getRealDeleteDefaultValue();

	void setRealDeleteDefaultValue(Boolean realDeleteDefaultValue);
	
	Boolean isRealDelete();
	
	EntityManager getEntityManager();
}
