package com.wecoms24.flow.counsel.task;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface TaskRequestDao extends BaseUserCrudEntityJpaDao<User, TaskRequest, Long, TaskRequestSearchParameter> {

}
