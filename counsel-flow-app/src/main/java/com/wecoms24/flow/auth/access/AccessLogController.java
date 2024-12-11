package com.wecoms24.flow.auth.access;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

@RestController
@RequestMapping(FlowAppConstants.REST_API_ACCESS_LOG)
public class AccessLogController extends BaseWebCrudController<User, JwtTokenProvider, AccessLog, Long, AccessLogDao, AccessLogSearchParameter, AccessLogService> {

}
