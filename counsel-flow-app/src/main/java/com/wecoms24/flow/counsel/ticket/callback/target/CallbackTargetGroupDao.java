package com.wecoms24.flow.counsel.ticket.callback.target;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface CallbackTargetGroupDao extends BaseUserCrudEntityJpaDao<User, CallbackTargetGroup, Long, CallbackTargetGroupSearchParameter> {

}
