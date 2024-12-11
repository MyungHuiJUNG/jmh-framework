package com.wecoms24.flow.core.notification.message;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

@RestController
@RequestMapping(FlowAppConstants.REST_API_MESSAGE)
public class MessageController extends BaseWebCrudController<User, JwtTokenProvider, Message, Long, MessageDao, MessageSearchParameter, MessageService> {

}
