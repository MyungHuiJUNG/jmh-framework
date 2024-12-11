package com.wecoms24.flow.settings.code;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Primary
public class CodeServiceImpl extends AbstractBaseUserCrudEntityService<User, Code, Long, CodeDao, CodeSearchParameter> implements CodeService {

	@Transactional
	@Override
	public Code regist(User loginUser, Code entity) {
		checkDuplicateCode(entity.getCode());
		Code parent = validateAndGetParentEntity(entity);
		entity.setParent(parent);
		if (parent != null)
			entity.setCodeType(parent.getCodeType());
		
		entity.updatePath();
		return super.regist(loginUser, entity);
	}

	@Transactional
	@Override
	public List<Code> regist(User loginUser, List<Code> entities) {
		checkDuplicateCodesInList(entities);
		for (Code entity : entities) {
			checkDuplicateCode(entity.getEntityId(), entity.getCode());
			Code parent = validateAndGetParentEntity(entity);
			entity.setParent(parent);
			if (parent != null)
				entity.setCodeType(parent.getCodeType());
			
			entity.updatePath();
		}
		return super.regist(loginUser, entities);
	}

	@Transactional
	@Override
	public Code update(User loginUser, Code entity) {
		checkDuplicateCode(entity.getEntityId(), entity.getCode());
		Code persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
		if (persistEntity == null) {
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		}
		
		Code parent = validateAndGetParentEntity(entity);
		persistEntity.setParent(parent);
		if (parent != null)
			persistEntity.setCodeType(parent.getCodeType());
		
		persistEntity.setCode(entity.getCode());
		persistEntity.setName(entity.getName());
		persistEntity.setOrderNumber(entity.getOrderNumber());
		updatePathRecursive(persistEntity);
		
		return super.update(loginUser, entity);
	}

	@Transactional
	@Override
	public List<Code> update(User loginUser, List<Code> entities) {
		checkDuplicateCodesInList(entities);
		for (Code entity : entities) {
			checkDuplicateCode(entity.getEntityId(), entity.getCode());
			Code persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
			if (persistEntity == null) {
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
			}
			
			Code parent = validateAndGetParentEntity(entity);
			persistEntity.setParent(parent);
			if (parent != null)
				persistEntity.setCodeType(parent.getCodeType());
			
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
		Code deleteTarget = entityDao.findOneByEntityId(entityId);
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
		CodeSearchParameter searchParameter = new CodeSearchParameter();
        searchParameter.getEntity().setCode(code);
        searchParameter.setIsTopCode(false);
        Code foundEntity = entityDao.findOne(searchParameter);
        if (entityId != null) {
        	return foundEntity != null && foundEntity.getEntityId() != entityId;
        }
        return foundEntity != null;
    }
	
	private Code validateAndGetParentEntity(Code entity) {
		Code parent = null;
		if (entity.getParent() != null && entity.getParent().getEntityId() != null && entity.getParent().getEntityId() != 0) {
			parent = entityDao.findOneByEntityId(entity.getParent().getEntityId());
			if (parent == null) {
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
			}
			
			if (entity.getEntityId() == entity.getParent().getEntityId()) {
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
			}
		}
		
		return parent;
	}
	
	private void checkDuplicateCodesInList(List<Code> entities) {
        Set<String> seenCodes = new HashSet<>();
        for (Code entity : entities) {
            String code = entity.getCode();
            if (seenCodes.contains(code)) {
                throw new FlowException(FlowErrorCode.DUPLICATE_CODE);
            }
            seenCodes.add(code);
        }
    }
	
	private void updatePathRecursive(Code baseEntity) {
		baseEntity.updatePath();
		
		List<Code> children = baseEntity.getChildren();
		if (children != null) {
			for (Code child : children) {
				updatePathRecursive(child);
			}
		}
	}
	
	private void deleteRecursive(User loginUser, Code baseEntity) {
		super.delete(loginUser, baseEntity.getEntityId());
		
		List<Code> children = baseEntity.getChildren();
		if (children != null) {
			for (Code child : children) {
				deleteRecursive(loginUser, child);
			}
		}
	}
}
