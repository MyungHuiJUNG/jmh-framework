package com.wecoms24.flow.board.reply;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(FlowAppConstants.REST_API_REPLY)
public class ReplyController extends BaseWebCrudController<User, JwtTokenProvider, Reply, Long, ReplyDao, ReplySearchParameter, ReplyService> {
}
