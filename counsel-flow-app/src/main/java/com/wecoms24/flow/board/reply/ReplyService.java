package com.wecoms24.flow.board.reply;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface ReplyService extends BaseUserCrudEntityService<User, Reply, Long, ReplyDao, ReplySearchParameter> {
}
