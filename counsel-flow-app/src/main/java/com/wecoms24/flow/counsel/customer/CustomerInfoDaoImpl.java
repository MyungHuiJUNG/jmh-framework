package com.wecoms24.flow.counsel.customer;

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
public class CustomerInfoDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, CustomerInfo, Long, CustomerInfoSearchParameter> implements CustomerInfoDao {

	public CustomerInfoDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(CustomerInfo.class, CustomerInfoSearchParameter.class, entityManager);
		setRealDeleteDefaultValue(false);
	}

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<CustomerInfo> root, CriteriaBuilder criteriaBuilder, CustomerInfoSearchParameter searchParameter) {
		if (searchParameter.getSearchTel() != null && searchParameter.getSearchTel().isEmpty() == false) {
			Predicate likeRepresentativeNumberPrediacate = criteriaBuilder.like(root.get("representativeNumber"), "%" + searchParameter.getSearchTel() + "%");
			Predicate likeSecondaryNumberPrediacate = criteriaBuilder.like(root.get("secondaryNumber"), "%" + searchParameter.getSearchTel() + "%");
			Predicate likeThirdNumberPrediacate = criteriaBuilder.like(root.get("thirdNumber"), "%" + searchParameter.getSearchTel() + "%");
			predicates.add(criteriaBuilder.or(likeRepresentativeNumberPrediacate, likeSecondaryNumberPrediacate, likeThirdNumberPrediacate));
		}
	}
}
