package com.wecoms24.flow.counsel.ticket.callback.target;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

@Service
@Primary
public class CallbackTargetGroupServiceImpl extends AbstractBaseUserCrudEntityService<User, CallbackTargetGroup, Long, CallbackTargetGroupDao, CallbackTargetGroupSearchParameter> implements CallbackTargetGroupService {

}
