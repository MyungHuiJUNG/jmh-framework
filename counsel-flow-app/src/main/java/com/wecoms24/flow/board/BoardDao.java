package com.wecoms24.flow.board;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface BoardDao extends BaseUserCrudEntityJpaDao<User, Board, Long, BoardSearchParameter> {
}
