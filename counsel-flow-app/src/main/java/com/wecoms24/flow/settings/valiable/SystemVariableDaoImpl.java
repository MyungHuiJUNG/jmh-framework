package com.wecoms24.flow.settings.valiable;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
@Primary
public class SystemVariableDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, SystemVariable, String, SystemVariableSearchParameter> implements SystemVariableDao {

	public SystemVariableDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(SystemVariable.class, SystemVariableSearchParameter.class, entityManager);
		setRealDeleteDefaultValue(false);
	}

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<SystemVariable> root, CriteriaBuilder criteriaBuilder, SystemVariableSearchParameter searchParameter) {
		if (searchParameter.getEntity() != null && searchParameter.getEntity().getParent() != null && searchParameter.getEntity().getParent().getEntityId() != null) {
			predicates.add(criteriaBuilder.equal(root.get("parent").get("entityId"), searchParameter.getEntity().getParent().getEntityId()));
		}
	}
}
