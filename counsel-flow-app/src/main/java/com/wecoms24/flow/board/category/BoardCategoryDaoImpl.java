package com.wecoms24.flow.board.category;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;

@Repository
@Primary
public class BoardCategoryDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, BoardCategory, Long, BoardCategorySearchParameter> implements BoardCategoryDao {

	public BoardCategoryDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(BoardCategory.class, BoardCategorySearchParameter.class, entityManager);
	}
}
