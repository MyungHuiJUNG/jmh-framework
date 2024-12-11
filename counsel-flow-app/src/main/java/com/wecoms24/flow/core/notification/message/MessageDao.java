package com.wecoms24.flow.core.notification.message;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface MessageDao extends BaseUserCrudEntityJpaDao<User, Message, Long, MessageSearchParameter> {

}
