package com.wecoms24.flow.settings.role;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface RoleService extends BaseUserCrudEntityService<User, Role, Long, RoleDao, RoleSearchParameter> {
	
}
