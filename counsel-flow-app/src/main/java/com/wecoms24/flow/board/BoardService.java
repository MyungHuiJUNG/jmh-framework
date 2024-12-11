package com.wecoms24.flow.board;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface BoardService extends BaseUserCrudEntityService<User, Board, Long, BoardDao, BoardSearchParameter> {
}
