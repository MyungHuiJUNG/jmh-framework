package com.wecoms24.flow.user.command.key;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface ShortCutKeyDao extends BaseUserCrudEntityJpaDao<User, ShortCutKey, Long, ShortCutKeySearchParameter> {

}
