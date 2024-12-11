package com.wecoms24.flow.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.core.template.entity.EntityStatus;
import com.wecoms24.flow.counsel.organization.Organization;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;



@Repository
@Primary
public class UserDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, User, Long, UserSearchParameter> implements UserDao {
	
	public UserDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
		super(User.class, UserSearchParameter.class, entityManager);
		setRealDeleteDefaultValue(false);
	}
	
	@Override
	public User findById(String id) {
		String query = "SELECT t1 FROM User t1"
				+ " WHERE t1.id = :id"
				+ " AND t1.entityStatus <> :entityStatus";
		
		TypedQuery<User> typeQuery = getEntityManager().createQuery(query, User.class);
		typeQuery.setParameter("id", id);
		typeQuery.setParameter("entityStatus", EntityStatus.DELETE);
		typeQuery.setMaxResults(1);
		
		List<User> results = typeQuery.getResultList();
        if (results == null || results.isEmpty())
        	return null;
        
		return results.get(0);
	}
	
	@Override
	public User findOneByIdWithName(String id, String name) {
		String query = "SELECT t1 FROM User t1"
				+ " WHERE t1.id = :id"
				+ " AND t1.name = :name"
				+ " AND t1.entityStatus <> :entityStatus";
		
		TypedQuery<User> typeQuery = getEntityManager().createQuery(query, User.class);
		typeQuery.setParameter("id", id);
		typeQuery.setParameter("name", name);
		typeQuery.setParameter("entityStatus", EntityStatus.DELETE);
		typeQuery.setMaxResults(1);
		
		List<User> results = typeQuery.getResultList();
        if (results == null || results.isEmpty())
        	return null;
        
		return results.get(0);
	}

	@Override
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<User> root, CriteriaBuilder criteriaBuilder, UserSearchParameter searchParameter) {
		if (searchParameter != null && searchParameter.getUseTypeCodes() != null) {
			predicates.add(root.get("useTypeCode").in(searchParameter.getUseTypeCodes()));
		}
		
		if (searchParameter != null && searchParameter.getOrganizationPath() != null) {
            Join<User, Organization> organizationJoin = root.join("organization");
            predicates.add(criteriaBuilder.like(organizationJoin.get("path"), searchParameter.getOrganizationPath() + "%"));
		}
	}
}
