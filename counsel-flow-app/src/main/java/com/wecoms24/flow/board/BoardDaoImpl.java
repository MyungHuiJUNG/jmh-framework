package com.wecoms24.flow.board;

import java.util.List;

import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;

@Repository
@Primary
public class BoardDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, Board, Long, BoardSearchParameter> implements BoardDao {
    public BoardDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
        super(Board.class, BoardSearchParameter.class, entityManager);
    }

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<Board> root, CriteriaBuilder criteriaBuilder, BoardSearchParameter searchParameter) {
		if (searchParameter.getKeyword() != null && searchParameter.getKeyword().isEmpty() == false) {
			Predicate likeTitlePrediacate = criteriaBuilder.like(root.get("title"), "%" + searchParameter.getKeyword() + "%");
			Predicate likeContentPrediacate = criteriaBuilder.like(root.get("rawContent"), "%" + searchParameter.getKeyword() + "%");
			predicates.add(criteriaBuilder.or(likeTitlePrediacate, likeContentPrediacate));
		}

		if (searchParameter.getCreatedByName() != null && !searchParameter.getCreatedByName().isEmpty()) {
			Join<Board, User> createdByUserJoin = root.join("createdByUser", JoinType.LEFT);
			predicates.add(criteriaBuilder.like(createdByUserJoin.get("name"), "%" + searchParameter.getCreatedByName() + "%"));
		}
	}
}
