package com.wecoms24.flow.counsel.task;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface TaskRequestService extends BaseUserCrudEntityService<User, TaskRequest, Long, TaskRequestDao, TaskRequestSearchParameter> {
	TaskRequest requestInitPassword(User loginUser, TaskRequest entity);
}
