package com.wecoms24.flow.core.template.dao.jpa;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ReflectionUtils;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;
import com.wecoms24.flow.core.template.entity.EntityStatus;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Id;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class AbstractBaseCrudEntityJpaDao<ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>> extends SimpleJpaRepository<ENTITY_TYPE, ENTITY_ID> implements BaseCrudEntityJpaDao<ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER> {
	private EntityManager entityManager;
	private Class<ENTITY_TYPE> entityClass;
	private Class<SEARCH_PARAMETER> searchParameterClass;
	private ThreadLocal<Boolean> isRealDeleteThreadLocal;
	private Boolean realDeleteDefaultValue;
	
	public AbstractBaseCrudEntityJpaDao(Class<ENTITY_TYPE> entityClass, Class<SEARCH_PARAMETER> searchParameterClass, EntityManager entityManager) {
		super(JpaEntityInformationSupport.getEntityInformation(entityClass, entityManager), entityManager);
		this.entityClass = entityClass;
		this.searchParameterClass = searchParameterClass;
		this.entityManager = entityManager;
		this.isRealDeleteThreadLocal = new ThreadLocal<>();
		this.realDeleteDefaultValue = true;
	}
	
	public Class<ENTITY_TYPE> getEntityClass() {
		return entityClass;
	}
	
	public Class<SEARCH_PARAMETER> getSearchParameterClass() {
		return searchParameterClass;
	}
	
	@Override
	public EntityManager getEntityManager() {
		return entityManager;
	}

	@Override
	public void isRealDelete(Boolean isRealDelete) {
		isRealDeleteThreadLocal.set(isRealDelete);		
	}

	@Override
	public Boolean getRealDeleteDefaultValue() {
		return realDeleteDefaultValue;
	}

	@Override
	public void setRealDeleteDefaultValue(Boolean realDeleteDefaultValue) {
		this.realDeleteDefaultValue = realDeleteDefaultValue;		
	}

	@Override
	public Boolean isRealDelete() {
		return isRealDeleteThreadLocal.get() == null ? getRealDeleteDefaultValue() : isRealDeleteThreadLocal.get();
	}
	
	@Override
	public ENTITY_TYPE findOne(ENTITY_TYPE entity) {
		return findOneByEntityId(entity.getEntityId());
	}
	
	@Override
	public ENTITY_TYPE findOne(SEARCH_PARAMETER searchParameter) {
		Specification<ENTITY_TYPE> specification = createSpecification(searchParameter);
		return findOne(specification).orElse(null);
	}

	@Override
	public ENTITY_TYPE findOneByEntityId(ENTITY_ID entityId) {
		return findById(entityId).orElse(null);
	}

	@Override
	public List<ENTITY_TYPE> find(SEARCH_PARAMETER searchParameter) {
		Specification<ENTITY_TYPE> specification = createSpecification(searchParameter);
        if (searchParameter.getSort() != null) {
            return findAll(specification, searchParameter.getSort());
        } else {
            return findAll(specification);
        }
	}

	@Override
	public Slice<ENTITY_TYPE> findSlice(SEARCH_PARAMETER searchParameter, Pageable pageable) {
		Specification<ENTITY_TYPE> specification = createSpecification(searchParameter);
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<ENTITY_TYPE> query = criteriaBuilder.createQuery(entityClass);
        Root<ENTITY_TYPE> root = query.from(entityClass);
        query.where(specification.toPredicate(root, query, criteriaBuilder));
        
        if (pageable.getSort().isSorted()) {
            List<Order> orders = new ArrayList<>();
            for (Sort.Order order : pageable.getSort()) {
                if (order.isAscending()) {
                    orders.add(criteriaBuilder.asc(root.get(order.getProperty())));
                } else {
                    orders.add(criteriaBuilder.desc(root.get(order.getProperty())));
                }
            }
            query.orderBy(orders);
        }
        
        
        TypedQuery<ENTITY_TYPE> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize() + 1);

        List<ENTITY_TYPE> resultList = typedQuery.getResultList();

        boolean hasNext = resultList.size() > pageable.getPageSize();
        if (hasNext) {
            resultList.remove(pageable.getPageSize());
        }

        return new SliceImpl<>(resultList, pageable, hasNext);
	}
	
	@Override
	public Page<ENTITY_TYPE> findPaging(SEARCH_PARAMETER searchParameter, Pageable pageable) {
		Specification<ENTITY_TYPE> specification = createSpecification(searchParameter);
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<ENTITY_TYPE> query = criteriaBuilder.createQuery(entityClass);
        Root<ENTITY_TYPE> root = query.from(entityClass);
        query.where(specification.toPredicate(root, query, criteriaBuilder));
        
        if (pageable.getSort().isSorted()) {
            List<Order> orders = new ArrayList<>();
            for (Sort.Order order : pageable.getSort()) {
                if (order.isAscending()) {
                    orders.add(criteriaBuilder.asc(root.get(order.getProperty())));
                } else {
                    orders.add(criteriaBuilder.desc(root.get(order.getProperty())));
                }
            }
            query.orderBy(orders);
        }
        
        
        TypedQuery<ENTITY_TYPE> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

		return readPage(typedQuery, getDomainClass(), pageable, specification);
	}
	
	@Override
	public Long findTotalCount(SEARCH_PARAMETER searchParameter) {
		Specification<ENTITY_TYPE> specification = createSpecification(searchParameter);
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = criteriaBuilder.createQuery(Long.class);
        Root<ENTITY_TYPE> root = query.from(entityClass);
        query.select(criteriaBuilder.count(root));

        if (specification != null) {
            Predicate predicate = specification.toPredicate(root, query, criteriaBuilder);
            if (predicate != null) {
                query.where(predicate);
            }
        }
        
        Object result = entityManager.createQuery(query).getSingleResult();
        if (result instanceof BigDecimal) {
            return ((BigDecimal) result).longValue();
        } else if (result instanceof BigInteger) {
            return ((BigInteger) result).longValue();
        } else if (result instanceof Long) {
            return (Long) result;
        } else {
            throw new IllegalStateException("Unexpected result type: " + result.getClass().getName());
        }
	}

	@Override
	@Transactional
	public ENTITY_TYPE create(ENTITY_TYPE entity) {
		entity.setEntityStatus(EntityStatus.NEW);
		return saveAndFlush(entity);
	}
	
	@Override
	@Transactional
	public ENTITY_TYPE create(ENTITY_TYPE entity, boolean isFlushStatement) {
		ENTITY_TYPE savedEntity = save(entity);
		if (isFlushStatement) {
			entityManager.flush();
		}
		return savedEntity;
	}
	
	@Override
	@Transactional
	public List<ENTITY_TYPE> createAll(List<ENTITY_TYPE> entities) {
		for (ENTITY_TYPE entity : entities) {
			entity.setEntityStatus(EntityStatus.NEW);
		}
		return saveAllAndFlush(entities);
	}
	
	@Override
	@Transactional
	public List<ENTITY_TYPE> createAll(List<ENTITY_TYPE> entities, boolean isFlushStatement) {
		List<ENTITY_TYPE> savedEntities = saveAll(entities);
		if (isFlushStatement) {
			entityManager.flush();
		}
		return savedEntities;
	}

	@Override
	@Transactional
	public ENTITY_TYPE update(ENTITY_TYPE entity) {
		return update(entity.getEntityId(), entity, true);
	}
	
	@Override
	@Transactional
	public ENTITY_TYPE update(ENTITY_ID entityId, ENTITY_TYPE entity, boolean isExecuteFindOne) {
		ENTITY_TYPE persistEntity = findOneByEntityId(entity.getEntityId());
		if (persistEntity == null) {
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		}
		
		merge(persistEntity, entity);
		
		persistEntity.setEntityStatus(EntityStatus.UPDATE);
		entityManager.merge(persistEntity);
		if (isExecuteFindOne)
			return findOneByEntityId(persistEntity.getEntityId());
		
		return entity;
	}

	@Override
	@Transactional
	public List<ENTITY_TYPE> updateAll(List<ENTITY_TYPE> entities) {
		List<ENTITY_TYPE> updatedEntities = new ArrayList<>();
        for (ENTITY_TYPE entity : entities) {
            updatedEntities.add(update(entity.getEntityId(), entity, false));
        }
        return updatedEntities;
	}

	@Override
	@Transactional
	public void remove(ENTITY_TYPE entity) {
		if (realDeleteDefaultValue) {
            super.delete(entity);
        } else {
            entity.setEntityStatus(EntityStatus.DELETE);
            entityManager.merge(entity);
        }		
	}

	@Override
	@Transactional
	public void removeByEntities(List<ENTITY_TYPE> entities) {
		if (realDeleteDefaultValue) {
            super.deleteAll(entities);
        } else {
            for (ENTITY_TYPE entity : entities) {
                remove(entity);
            }
        }		
	}

	@Override
	@Transactional
	public void removeByEntityId(ENTITY_ID entityId) {
		if (realDeleteDefaultValue) {
            super.deleteById(entityId);
        } else {
            ENTITY_TYPE entity = findOneByEntityId(entityId);
            if (entity != null) {
                remove(entity);
            }
        }		
	}

	@Override
	@Transactional
	public void removeByEntityIds(List<ENTITY_ID> entityIds) {
		for (ENTITY_ID entityId : entityIds) {
            removeByEntityId(entityId);
        }
	}
	
	protected Specification<ENTITY_TYPE> createSpecification(SEARCH_PARAMETER searchParameter) {
		return (root, query, criteriaBuilder) -> {
	        List<Predicate> predicates = new ArrayList<>();

	        addBasicPredicates(root, criteriaBuilder, predicates, searchParameter);
	        
	        addFieldPredicates(root, criteriaBuilder, predicates, searchParameter);

	        processAdditionalCriteria(predicates, root, criteriaBuilder, searchParameter);

	        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
	    };
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected void addBasicPredicates(Root<ENTITY_TYPE> root, CriteriaBuilder criteriaBuilder, List<Predicate> predicates, SEARCH_PARAMETER searchParameter) {
		if (searchParameter.getEntityIds() != null && !searchParameter.getEntityIds().isEmpty()) {
            predicates.add(root.get("entityId").in(searchParameter.getEntityIds()));
        }

        if (searchParameter.getFromEntityId() != null) {
            if (Comparable.class.isAssignableFrom(searchParameter.getFromEntityId().getClass())) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("entityId"), (Comparable) searchParameter.getFromEntityId()));
            } else {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("entityId").as(String.class), searchParameter.getFromEntityId().toString()));
            }
        }
        
        if (searchParameter.getToEntityId() != null) {
            if (Comparable.class.isAssignableFrom(searchParameter.getToEntityId().getClass())) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("entityId"), (Comparable) searchParameter.getToEntityId()));
            } else {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("entityId").as(String.class), searchParameter.getToEntityId().toString()));
            }
        }
        
        if (searchParameter.getFromCreatedDate() != null) {
        	predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdDate"), (Comparable) searchParameter.getFromCreatedDate()));
        }
        
        if (searchParameter.getToCreatedDate() != null) {
        	predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdDate"), (Comparable) searchParameter.getToCreatedDate()));
        }
        
        if (searchParameter.getIsTopCode() != null && searchParameter.getIsTopCode()) {
            predicates.add(criteriaBuilder.isNull(root.get("parent")));
        }
        
        if (!searchParameter.getContainDeleteStatusEntity()) {
            predicates.add(criteriaBuilder.notEqual(root.get("entityStatus"), EntityStatus.DELETE));
        }
	}
	
	protected void addFieldPredicates(Root<ENTITY_TYPE> root, CriteriaBuilder criteriaBuilder, List<Predicate> predicates, SEARCH_PARAMETER searchParameter) {
		ENTITY_TYPE entity = searchParameter.getEntity();
        if (entity != null) {
        	ReflectionUtils.doWithFields(entity.getClass(), field -> {
        		field.setAccessible(true);
                try {
                    Object value = field.get(entity);
                    if (value != null && "entityStatus".equalsIgnoreCase(field.getName()) == false) {
                    	if (isValidValue(field, value)) {
                    		String fieldName = field.getName();
                            if (Collection.class.isAssignableFrom(field.getType()) == false) {
                            	if (field.isAnnotationPresent(SearchLike.class) && searchParameter.getIsSearchLike()) {
                            		predicates.add(criteriaBuilder.like(root.get(fieldName), "%" + value.toString() + "%"));
                            	} else {
                            		predicates.add(criteriaBuilder.equal(root.get(fieldName), value));
                            		
                            	}
                            }
                    	}
                    }
                } catch (IllegalAccessException e) {
                    throw new RuntimeException("Failed to access field: " + field.getName(), e);
                }
        	});
        }
	}
	
	protected boolean isValidValue(Field field, Object returnValue) {
		if (returnValue == null || (hasAnnotation(field, Id.class) && returnValue instanceof Number && ((Number) returnValue).intValue() == 0) || (hasAnnotation(field, Id.class) && returnValue instanceof String && ((String) returnValue).isEmpty())) {
			return false;
		}
		return true;
	}

	protected boolean hasAnnotation(Field field, Class<? extends Annotation> annotationClass) {
		Annotation[] annotationsByType = field.getAnnotationsByType(annotationClass);
		return annotationsByType != null && annotationsByType.length > 0;
	}
	
	protected void processAdditionalCriteria(List<Predicate> predicates, Root<ENTITY_TYPE> root, CriteriaBuilder criteriaBuilder, SEARCH_PARAMETER searchParameter) {
        // This method can be overridden by subclasses to add additional criteria
    }
	
	protected boolean merge(ENTITY_TYPE targetObj, ENTITY_TYPE sourceObj) {
		if (sourceObj == null) {
			return false;
		}
		
		if(Hibernate.unproxy(targetObj).getClass().getSimpleName().equalsIgnoreCase(Hibernate.unproxy(sourceObj).getClass().getSimpleName()) == false) {
			throw new IllegalArgumentException("The two parameter objects should be the same class");
		}
		
		final AtomicReference<Boolean> updated = new AtomicReference<>(false);
		
		List<String> mergedList = new LinkedList<>();

		ReflectionUtils.doWithFields(targetObj.getClass(),
			field -> {
				field.setAccessible(true);
				Object oldValue = field.get(targetObj);
				Object newValue = field.get(sourceObj);
				boolean canMerge = false;
				final Annotation annotation = field.getAnnotation(Merge.class);
				if(((Merge)annotation).ignoreNull()) {
					if(canUpdate(oldValue, newValue)) {
						canMerge = true;
					}
				} else {
					if(canUpdateAlbeitNull(oldValue, newValue)) {
						canMerge = true;
					}
				}

				if(canMerge) {
					field.set(targetObj, newValue);
					updated.set(true);
					mergedList.add(String.format("%s : %s -> %s", field.getName(), oldValue, newValue));
				}

			},
			field -> {
				final Annotation annotation = field.getAnnotation(Merge.class);
				return annotation != null ;
			});

		
		if(updated.get()) {
			log.info(String.join("\n", mergedList));
		}
		
		return updated.get();
	}
	
	public <T> boolean canUpdate(T to, T from) {
		if(from != null && !from.equals(to)) {
			return true;
		}
		return false;
	}
	
	public <T> boolean canUpdateAlbeitNull(T to, T from) {
		if(from == null) {
			return to != null;
		}
		return !from.equals(to);
	}
}
