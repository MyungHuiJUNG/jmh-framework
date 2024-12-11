package com.wecoms24.flow.core.notification.message;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

@Service
@Primary
public class MessageServiceImpl extends AbstractBaseUserCrudEntityService<User, Message, Long, MessageDao, MessageSearchParameter> implements MessageService {

}
