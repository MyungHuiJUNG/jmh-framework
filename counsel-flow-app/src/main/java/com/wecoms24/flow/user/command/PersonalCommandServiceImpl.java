package com.wecoms24.flow.user.command;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

@Service
@Primary
public class PersonalCommandServiceImpl extends AbstractBaseUserCrudEntityService<User, PersonalCommand, Long, PersonalCommandDao, PersonalCommandSearchParameter> implements PersonalCommandService {

}
