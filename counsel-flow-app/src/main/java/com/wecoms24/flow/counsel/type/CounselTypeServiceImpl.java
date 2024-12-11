package com.wecoms24.flow.counsel.type;

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
public class CounselTypeServiceImpl extends AbstractBaseUserCrudEntityService<User, CounselType, Long, CounselTypeDao, CounselTypeSearchParameter> implements CounselTypeService {

	@Transactional
	@Override
	public CounselType regist(User loginUser, CounselType entity) {
		checkDuplicateCode(entity.getCode());
		CounselType parent = validateAndGetParentEntity(entity);
		entity.setParent(parent);
		entity.updatePath();
		return super.regist(loginUser, entity);
	}

	@Transactional
	@Override
	public List<CounselType> regist(User loginUser, List<CounselType> entities) {
		checkDuplicateCodesInList(entities);
		for (CounselType entity : entities) {
			checkDuplicateCode(entity.getEntityId(), entity.getCode());
			CounselType parent = validateAndGetParentEntity(entity);
			entity.setParent(parent);
			entity.updatePath();
		}
		return super.regist(loginUser, entities);
	}

	@Transactional
	@Override
	public CounselType update(User loginUser, CounselType entity) {
		checkDuplicateCode(entity.getEntityId(), entity.getCode());
		CounselType persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
		if (persistEntity == null) {
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		}
		
		CounselType parent = validateAndGetParentEntity(entity);
		persistEntity.setParent(parent);
		persistEntity.setCode(entity.getCode());
		persistEntity.setName(entity.getName());
		persistEntity.setOrderNumber(entity.getOrderNumber());
		updatePathRecursive(persistEntity);
		
		return super.update(loginUser, entity);
	}

	@Transactional
	@Override
	public List<CounselType> update(User loginUser, List<CounselType> entities) {
		checkDuplicateCodesInList(entities);
		for (CounselType entity : entities) {
			checkDuplicateCode(entity.getEntityId(), entity.getCode());
			CounselType persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
			if (persistEntity == null) {
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
			}
			
			CounselType parent = validateAndGetParentEntity(entity);
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
		CounselType deleteTarget = entityDao.findOneByEntityId(entityId);
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
		CounselTypeSearchParameter searchParameter = new CounselTypeSearchParameter();
        searchParameter.getEntity().setCode(code);
        searchParameter.setIsTopCode(false);
        CounselType foundEntity = entityDao.findOne(searchParameter);
        if (entityId != null) {
        	return foundEntity != null && !Objects.equals(foundEntity.getEntityId(), entityId);
        }
        return foundEntity != null;
    }
	
	private void checkDuplicateCodesInList(List<CounselType> entities) {
        Set<String> seenCodes = new HashSet<>();
        for (CounselType entity : entities) {
            String code = entity.getCode();
            if (seenCodes.contains(code)) {
                throw new FlowException(FlowErrorCode.DUPLICATE_CODE);
            }
            seenCodes.add(code);
        }
    }
	
	private CounselType validateAndGetParentEntity(CounselType entity) {
		CounselType parent = null;
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
	
	private void updatePathRecursive(CounselType baseEntity) {
		baseEntity.updatePath();
		
		List<CounselType> children = baseEntity.getChildren();
		if (children != null) {
			for (CounselType child : children) {
				updatePathRecursive(child);
			}
		}
	}
	
	private void deleteRecursive(User loginUser, CounselType baseEntity) {
		super.delete(loginUser, baseEntity.getEntityId());
		
		List<CounselType> children = baseEntity.getChildren();
		if (children != null) {
			for (CounselType child : children) {
				deleteRecursive(loginUser, child);
			}
		}
	}
}
