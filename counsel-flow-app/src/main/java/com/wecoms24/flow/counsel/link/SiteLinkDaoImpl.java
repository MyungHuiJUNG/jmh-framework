package com.wecoms24.flow.counsel.link;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;

@Repository
@Primary
public class SiteLinkDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, SiteLink, Long, SiteLinkSearchParameter> implements SiteLinkDao {

	public SiteLinkDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(SiteLink.class, SiteLinkSearchParameter.class, entityManager);
	}
}
