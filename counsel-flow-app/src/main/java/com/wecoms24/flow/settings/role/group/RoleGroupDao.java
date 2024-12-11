package com.wecoms24.flow.settings.role.group;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface RoleGroupDao extends BaseUserCrudEntityJpaDao<User, RoleGroup, Long, RoleGroupSearchParameter> {

}
