package com.wecoms24.flow.counsel.notice;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface NoticeService extends BaseUserCrudEntityService<User, Notice, Long, NoticeDao, NoticeSearchParameter> {
}
