package com.wecoms24.flow.core.notification.message;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.notification.Notification;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Repository
@Primary
public class MessageDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, Message, Long, MessageSearchParameter> implements MessageDao {

	public MessageDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(Message.class, MessageSearchParameter.class, entityManager);
		setRealDeleteDefaultValue(false);
	}

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<Message> root, CriteriaBuilder criteriaBuilder, MessageSearchParameter searchParameter) {
		if (searchParameter != null && searchParameter.getKeyword() != null && searchParameter.getKeyword().isEmpty() == false) {
			Join<Message, Notification> notificationJoin = root.join("notification", JoinType.LEFT);
			Predicate likeTitlePrediacate = criteriaBuilder.like(notificationJoin.get("title"), "%" + searchParameter.getKeyword() + "%");
            Predicate likeMessagePrediacate = criteriaBuilder.like(notificationJoin.get("message"), "%" + searchParameter.getKeyword() + "%");
            predicates.add(criteriaBuilder.or(likeTitlePrediacate, likeMessagePrediacate));
		}
		
		if (searchParameter != null && searchParameter.getSenderEntityId() != null && searchParameter.getSenderEntityId() > 0) {
			Join<Message, Notification> notificationJoin = root.join("notification", JoinType.LEFT);
			Join<Notification, User> senderJoin = notificationJoin.join("sender", JoinType.LEFT);
			predicates.add(criteriaBuilder.equal(senderJoin.get("entityId"), searchParameter.getSenderEntityId()));
		}
	}
}
