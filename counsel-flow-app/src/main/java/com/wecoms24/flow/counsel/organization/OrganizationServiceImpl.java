package com.wecoms24.flow.counsel.organization;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@Primary
public class OrganizationServiceImpl extends AbstractBaseUserCrudEntityService<User, Organization, Long, OrganizationDao, OrganizationSearchParameter> implements OrganizationService {

	@Transactional
	@Override
	public Organization regist(User loginUser, Organization entity) {
		checkDuplicateCode(entity.getCode());
		Organization parent = validateAndGetParentEntity(entity);
		entity.setParent(parent);
		entity.updatePath();
		return super.regist(loginUser, entity);
	}

	@Transactional
	@Override
	public List<Organization> regist(User loginUser, List<Organization> entities) {
		checkDuplicateCodesInList(entities);
		for (Organization entity : entities) {
			checkDuplicateCode(entity.getEntityId(), entity.getCode());
			Organization parent = validateAndGetParentEntity(entity);
			entity.setParent(parent);
			entity.updatePath();
		}
		return super.regist(loginUser, entities);
	}

	@Transactional
	@Override
	public Organization update(User loginUser, Organization entity) {
		checkDuplicateCode(entity.getEntityId(), entity.getCode());
		Organization persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
		if (persistEntity == null) {
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		}
		
		Organization parent = validateAndGetParentEntity(entity);
		persistEntity.setParent(parent);
		persistEntity.setCode(entity.getCode());
		persistEntity.setName(entity.getName());
		persistEntity.setOrderNumber(entity.getOrderNumber());
		updatePathRecursive(persistEntity);
		
		return super.update(loginUser, entity);
	}

	@Transactional
	@Override
	public List<Organization> update(User loginUser, List<Organization> entities) {
		checkDuplicateCodesInList(entities);
		for (Organization entity : entities) {
			checkDuplicateCode(entity.getEntityId(), entity.getCode());
			Organization persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
			if (persistEntity == null) {
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
			}
			
			Organization parent = validateAndGetParentEntity(entity);
			persistEntity.setParent(parent);
			persistEntity.setCode(entity.getCode());
			persistEntity.setName(entity.getName());
			persistEntity.setOrderNumber(entity.getOrderNumber());
			updatePathRecursive(persistEntity);
		}
		
		return super.update(loginUser, entities);
	}

	@Transactional
	@Override
	public void delete(User loginUser, Long entityId) {
		Organization deleteTarget = entityDao.findOneByEntityId(entityId);
		deleteRecursive(loginUser, deleteTarget);
	}

	@Transactional
	@Override
	public void delete(User loginUser, List<Long> entityIds) {
		for (Long entityId : entityIds) {
			delete(loginUser, entityId);
		}
	}
	
	private void checkDuplicateCode(String code) {
        if (existsByCode(null, code)) {
            throw new FlowException(FlowErrorCode.DUPLICATE_CODE);
        }
    }
	
	private void checkDuplicateCode(Long entityId, String code) {
		if (code == null || code.isEmpty())
			return;
		
        if (existsByCode(entityId, code)) {
            throw new FlowException(FlowErrorCode.DUPLICATE_CODE);
        }
    }
	
	private boolean existsByCode(Long entityId, String code) {
		OrganizationSearchParameter searchParameter = new OrganizationSearchParameter();
        searchParameter.getEntity().setCode(code);
        searchParameter.setIsTopCode(false);
        Organization foundEntity = entityDao.findOne(searchParameter);
        
        if (entityId != null) {
        	return foundEntity != null && !Objects.equals(foundEntity.getEntityId(), entityId);
        }
        
        
        
        return foundEntity != null;
    }
	
	private void checkDuplicateCodesInList(List<Organization> entities) {
        Set<String> seenCodes = new HashSet<>();
        for (Organization entity : entities) {
            String code = entity.getCode();
            if (seenCodes.contains(code)) {
                throw new FlowException(FlowErrorCode.DUPLICATE_CODE);
            }
            seenCodes.add(code);
        }
    }
	
	private Organization validateAndGetParentEntity(Organization entity) {
		Organization parent = null;
		if (entity.getParent() != null && entity.getParent().getEntityId() != null && entity.getParent().getEntityId() != 0) {
			parent = entityDao.findOneByEntityId(entity.getParent().getEntityId());
			if (parent == null) {
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
			}
			
			if (Objects.equals(entity.getEntityId(), entity.getParent().getEntityId())) {
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
			}
		}
		
		return parent;
	}
	
	private void updatePathRecursive(Organization baseEntity) {
		baseEntity.updatePath();
		
		List<Organization> children = baseEntity.getChildren();
		if (children != null) {
			for (Organization child : children) {
				updatePathRecursive(child);
			}
		}
	}
	
	private void deleteRecursive(User loginUser, Organization baseEntity) {
		super.delete(loginUser, baseEntity.getEntityId());
		
		List<Organization> children = baseEntity.getChildren();
		if (children != null) {
			for (Organization child : children) {
				deleteRecursive(loginUser, child);
			}
		}
	}
}
