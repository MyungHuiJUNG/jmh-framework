package com.wecoms24.flow.auth.access;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface AccessLogService extends BaseUserCrudEntityService<User, AccessLog, Long, AccessLogDao, AccessLogSearchParameter> {

}
