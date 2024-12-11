package com.wecoms24.flow.settings.code;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Repository
@Primary
public class CodeDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, Code, Long, CodeSearchParameter> implements CodeDao {

	public CodeDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(Code.class, CodeSearchParameter.class, entityManager);
		setRealDeleteDefaultValue(false);
	}
	
	@Transactional
	@Override
	public Code create(Code entity) {
		entity.setUsable(true);
		return super.create(entity);
	}

	@Transactional
	@Override
	public List<Code> createAll(List<Code> entities) {
		for (Code entity : entities) {
			entity.setUsable(true);
		}
		return super.createAll(entities);
	}

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<Code> root, CriteriaBuilder criteriaBuilder, CodeSearchParameter searchParameter) {
		if (searchParameter.getEntity() != null && searchParameter.getEntity().getParent() != null && searchParameter.getEntity().getParent().getEntityId() != null) {
			predicates.add(criteriaBuilder.equal(root.get("parent").get("entityId"), searchParameter.getEntity().getParent().getEntityId()));
		}
	}
}
