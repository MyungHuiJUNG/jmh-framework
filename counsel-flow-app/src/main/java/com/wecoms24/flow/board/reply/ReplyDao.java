package com.wecoms24.flow.board.reply;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface ReplyDao extends BaseUserCrudEntityJpaDao<User, Reply, Long, ReplySearchParameter> {

}