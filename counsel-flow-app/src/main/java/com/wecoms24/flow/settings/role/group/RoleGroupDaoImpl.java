package com.wecoms24.flow.settings.role.group;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.settings.role.Role;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Repository
@Primary
public class RoleGroupDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, RoleGroup, Long, RoleGroupSearchParameter> implements RoleGroupDao {

	public RoleGroupDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(RoleGroup.class, RoleGroupSearchParameter.class, entityManager);
		setRealDeleteDefaultValue(false);
	}
	
	@Transactional
	@Override
	public RoleGroup create(RoleGroup entity) {
		entity.setUsable(true);
		return super.create(entity);
	}

	@Transactional
	@Override
	public List<RoleGroup> createAll(List<RoleGroup> entities) {
		for (RoleGroup entity : entities) {
			entity.setUsable(true);
		}
		return super.createAll(entities);
	}

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<RoleGroup> root, CriteriaBuilder criteriaBuilder, RoleGroupSearchParameter searchParameter) {
		if (searchParameter != null && searchParameter.getUsables() != null) {
			predicates.add(root.get("usable").in(searchParameter.getUsables()));
		}
		
		if (searchParameter != null && searchParameter.getRoleEntityId() != null) {
			Join<RoleGroup, Role> roleJoin = root.join("roles", JoinType.LEFT);
			predicates.add(criteriaBuilder.equal(roleJoin.get("entityId"), searchParameter.getRoleEntityId()));
		}
	}
}
