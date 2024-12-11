package com.wecoms24.flow.settings.menu;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface MenuDao extends BaseUserCrudEntityJpaDao<User, Menu, Long, MenuSearchParameter> {

}
