package com.wecoms24.flow.settings.code;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface CodeDao extends BaseUserCrudEntityJpaDao<User, Code, Long, CodeSearchParameter> {

}
