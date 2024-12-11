package com.wecoms24.flow.user;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;

public interface UserDao extends BaseUserCrudEntityJpaDao<User, User, Long, UserSearchParameter> {
	User findById(String id);
	User findOneByIdWithName(String id, String name);
}
