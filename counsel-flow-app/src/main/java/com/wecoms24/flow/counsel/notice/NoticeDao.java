package com.wecoms24.flow.counsel.notice;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface NoticeDao extends BaseUserCrudEntityJpaDao<User, Notice, Long, NoticeSearchParameter> {
}
