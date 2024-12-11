package com.wecoms24.flow.core.notification.message;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface MessageService extends BaseUserCrudEntityService<User, Message, Long, MessageDao, MessageSearchParameter> {

}
