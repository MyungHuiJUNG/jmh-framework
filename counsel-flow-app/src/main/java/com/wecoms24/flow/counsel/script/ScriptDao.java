package com.wecoms24.flow.counsel.script;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface ScriptDao extends BaseUserCrudEntityJpaDao<User, Script, Long, ScriptSearchParameter> {

}
