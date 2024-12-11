package com.wecoms24.flow.core.template.dao.jpa;

import org.springframework.data.repository.NoRepositoryBean;

import com.wecoms24.flow.core.template.dao.BaseUserCrudEntityDao;
import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;
import com.wecoms24.flow.user.User;

@NoRepositoryBean
public interface BaseUserCrudEntityJpaDao<USER_ENTITY extends User, ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> extends BaseCrudEntityJpaDao<ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER>, BaseUserCrudEntityDao<USER_ENTITY, ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER> {

}
