package com.wecoms24.flow.core.notification;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface NotificationService extends BaseUserCrudEntityService<User, Notification, Long, NotificationDao, NotificationSearchParameter> {
	void sendMessage(User loginUser, NotificationSearchParameter searchParameter);
}
