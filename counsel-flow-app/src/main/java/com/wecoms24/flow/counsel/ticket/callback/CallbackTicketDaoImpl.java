package com.wecoms24.flow.counsel.ticket.callback;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.counsel.ticket.Ticket;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Repository
@Primary
public class CallbackTicketDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, CallbackTicket, Long, CallbackTicketSearchParameter> implements CallbackTicketDao {
    public CallbackTicketDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
        super(CallbackTicket.class, CallbackTicketSearchParameter.class, entityManager);
        setRealDeleteDefaultValue(false);
    }

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<CallbackTicket> root, CriteriaBuilder criteriaBuilder, CallbackTicketSearchParameter searchParameter) {
		if (searchParameter.getIsUnAssignCallback() != null && searchParameter.getIsUnAssignCallback()) {
			predicates.add(criteriaBuilder.isNull(root.get("ticket")));
		}
		
		if (searchParameter.getTicketStatusCode() != null && searchParameter.getTicketStatusCode().isEmpty() == false) {
			Join<CallbackTicket, Ticket> ticketJoin = root.join("ticket", JoinType.LEFT);
			predicates.add(criteriaBuilder.equal(ticketJoin.get("statusCode"), searchParameter.getTicketStatusCode()));
		}
		
		if (searchParameter.getManagerEntityId() != null && searchParameter.getManagerEntityId() > 0) {
			Join<CallbackTicket, Ticket> ticketJoin = root.join("ticket", JoinType.LEFT);
			Join<Ticket, User> managerJoin = ticketJoin.join("manager", JoinType.LEFT);
			predicates.add(criteriaBuilder.equal(managerJoin.get("entityId"), searchParameter.getManagerEntityId()));
		}
	}
}
