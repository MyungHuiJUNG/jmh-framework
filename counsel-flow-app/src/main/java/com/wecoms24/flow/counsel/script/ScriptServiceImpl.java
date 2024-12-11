package com.wecoms24.flow.counsel.script;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

@Service
@Primary
public class ScriptServiceImpl extends AbstractBaseUserCrudEntityService<User, Script, Long, ScriptDao, ScriptSearchParameter> implements ScriptService {

}
