package com.wecoms24.flow.settings.valiable;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface SystemVariableDao extends BaseUserCrudEntityJpaDao<User, SystemVariable, String, SystemVariableSearchParameter> {

}
