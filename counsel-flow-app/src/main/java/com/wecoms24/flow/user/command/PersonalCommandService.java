package com.wecoms24.flow.user.command;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface PersonalCommandService extends BaseUserCrudEntityService<User, PersonalCommand, Long, PersonalCommandDao, PersonalCommandSearchParameter> {

}
