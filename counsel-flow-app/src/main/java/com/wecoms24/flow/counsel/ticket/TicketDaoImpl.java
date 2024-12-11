package com.wecoms24.flow.counsel.ticket;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;

@Repository
@Primary
public class TicketDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, Ticket, Long, TicketSearchParameter> implements TicketDao {
    public TicketDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
        super(Ticket.class, TicketSearchParameter.class, entityManager);
        setRealDeleteDefaultValue(false);
    }
}
