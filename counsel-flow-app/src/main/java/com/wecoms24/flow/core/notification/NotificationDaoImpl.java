package com.wecoms24.flow.core.notification;

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
public class NotificationDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, Notification, Long, NotificationSearchParameter> implements NotificationDao {

	public NotificationDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(Notification.class, NotificationSearchParameter.class, entityManager);
		setRealDeleteDefaultValue(false);
	}

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<Notification> root, CriteriaBuilder criteriaBuilder, NotificationSearchParameter searchParameter) {
		if (searchParameter != null && searchParameter.getTypeCodes() != null) {
			predicates.add(root.get("typeCode").in(searchParameter.getTypeCodes()));
		}
		
		if (searchParameter != null && searchParameter.getKeyword() != null && searchParameter.getKeyword().isEmpty() == false) {
			Predicate likeTitlePrediacate = criteriaBuilder.like(root.get("title"), "%" + searchParameter.getKeyword() + "%");
            Predicate likeMessagePrediacate = criteriaBuilder.like(root.get("message"), "%" + searchParameter.getKeyword() + "%");
            predicates.add(criteriaBuilder.or(likeTitlePrediacate, likeMessagePrediacate));
		}
	}
}
