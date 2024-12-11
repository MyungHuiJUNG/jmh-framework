package com.wecoms24.flow.core.notification;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface NotificationDao extends BaseUserCrudEntityJpaDao<User, Notification, Long, NotificationSearchParameter> {

}
