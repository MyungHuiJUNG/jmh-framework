package com.wecoms24.flow.settings.role.group;

import com.wecoms24.flow.FlowAppConstants;
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
public class RoleGroupServiceImpl extends AbstractBaseUserCrudEntityService<User, RoleGroup, Long, RoleGroupDao, RoleGroupSearchParameter> implements RoleGroupService {

	@Transactional
	@Override
	public RoleGroup regist(User loginUser, RoleGroup entity) {
		checkDuplicateName(entity.getName());
		return super.regist(loginUser, entity);
	}

	@Transactional
	@Override
	public List<RoleGroup> regist(User loginUser, List<RoleGroup> entities) {
		checkDuplicateNamesInList(entities);
		for (RoleGroup entity : entities) {
			checkDuplicateName(entity.getEntityId(), entity.getName());
		}
		return super.regist(loginUser, entities);
	}

	@Transactional
	@Override
	public RoleGroup update(User loginUser, RoleGroup entity) {
		checkSuperAdminGroup(entity);
		
		checkDuplicateName(entity.getEntityId(), entity.getName());
		return super.update(loginUser, entity);
	}

	@Transactional
	@Override
	public List<RoleGroup> update(User loginUser, List<RoleGroup> entities) {
		checkDuplicateNamesInList(entities);
		for (RoleGroup entity : entities) {
			checkSuperAdminGroup(entity);
			checkDuplicateName(entity.getEntityId(), entity.getName());
		}
		return super.update(loginUser, entities);
	}
	
	private void checkDuplicateName(String name) {
        if (existsByName(null, name)) {
            throw new FlowException(FlowErrorCode.DUPLICATE_NAME);
        }
    }
	
	private void checkDuplicateName(Long entityId, String name) {
		if (name == null || name.isEmpty())
			return;
		
		if (existsByName(entityId, name)) {
            throw new FlowException(FlowErrorCode.DUPLICATE_NAME);
        }
	}

	private boolean existsByName(Long entityId, String name) {
        RoleGroupSearchParameter searchParameter = new RoleGroupSearchParameter();
        searchParameter.setIsSearchLike(false);
        searchParameter.getEntity().setName(name);
        RoleGroup foundEntity = entityDao.findOne(searchParameter);
        if (entityId != null) {
        	return foundEntity != null && !Objects.equals(foundEntity.getEntityId(), entityId);
        }
        return foundEntity != null;
    }
	
	private void checkDuplicateNamesInList(List<RoleGroup> entities) {
        Set<String> seenNames = new HashSet<>();
        for (RoleGroup entity : entities) {
            String name = entity.getName();
            if (seenNames.contains(name)) {
                throw new FlowException(FlowErrorCode.DUPLICATE_NAME);
            }
            seenNames.add(name);
        }
    }
	
	private void checkSuperAdminGroup(RoleGroup entity) {
		RoleGroup foundEntity = entityDao.findOneByEntityId(entity.getEntityId());
		if (foundEntity != null && foundEntity.getName().equalsIgnoreCase(FlowAppConstants.SUPER_ADMIN_ROLE_GROUP_NAME))
        	throw new FlowException(FlowErrorCode.CANNOT_CHANGE_SUPER_ADMIN_GROUP);
	}
}
