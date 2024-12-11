package com.wecoms24.flow.counsel.ticket.callback.target;

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

@Repository
@Primary
public class CallbackTargetGroupDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, CallbackTargetGroup, Long, CallbackTargetGroupSearchParameter> implements CallbackTargetGroupDao {

	public CallbackTargetGroupDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(CallbackTargetGroup.class, CallbackTargetGroupSearchParameter.class, entityManager);
	}

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<CallbackTargetGroup> root, CriteriaBuilder criteriaBuilder, CallbackTargetGroupSearchParameter searchParameter) {
		if (searchParameter.getRepresentNumbers() != null && searchParameter.getRepresentNumbers().isEmpty() == false) {
			predicates.add(root.get("representNumber").in(searchParameter.getRepresentNumbers()));
		}
	}
}
