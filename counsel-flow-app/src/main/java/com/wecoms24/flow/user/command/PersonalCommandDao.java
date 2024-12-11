package com.wecoms24.flow.user.command;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface PersonalCommandDao extends BaseUserCrudEntityJpaDao<User, PersonalCommand, Long, PersonalCommandSearchParameter> {

}
