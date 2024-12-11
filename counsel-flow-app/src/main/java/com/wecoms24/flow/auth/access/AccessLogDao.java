package com.wecoms24.flow.auth.access;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface AccessLogDao extends BaseUserCrudEntityJpaDao<User, AccessLog, Long, AccessLogSearchParameter> {

}
