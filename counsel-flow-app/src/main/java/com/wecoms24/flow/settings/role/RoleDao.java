package com.wecoms24.flow.settings.role;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface RoleDao extends BaseUserCrudEntityJpaDao<User, Role, Long, RoleSearchParameter> {

}
