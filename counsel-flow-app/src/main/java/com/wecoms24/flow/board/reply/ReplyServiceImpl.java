package com.wecoms24.flow.board.reply;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

@Service
@Primary
public class ReplyServiceImpl extends AbstractBaseUserCrudEntityService<User, Reply, Long, ReplyDao, ReplySearchParameter> implements ReplyService {

}
