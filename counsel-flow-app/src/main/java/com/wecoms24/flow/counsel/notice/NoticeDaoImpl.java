package com.wecoms24.flow.counsel.notice;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;

import java.util.List;

@Repository
@Primary
public class NoticeDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, Notice, Long, NoticeSearchParameter> implements NoticeDao {
    public NoticeDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
        super(Notice.class, NoticeSearchParameter.class, entityManager);
    }

    @Override
    protected void processAdditionalCriteria(List<Predicate> predicates, Root<Notice> root, CriteriaBuilder criteriaBuilder, NoticeSearchParameter searchParameter) {
        if (searchParameter.getKeyword() != null && searchParameter.getKeyword().isEmpty() == false) {
            Predicate likeTitlePrediacate = criteriaBuilder.like(root.get("title"), "%" + searchParameter.getKeyword() + "%");
            Predicate likeContentPrediacate = criteriaBuilder.like(root.get("rawContent"), "%" + searchParameter.getKeyword() + "%");
            predicates.add(criteriaBuilder.or(likeTitlePrediacate, likeContentPrediacate));
        }
    }
}
