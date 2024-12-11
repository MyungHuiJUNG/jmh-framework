package com.wecoms24.flow.chemp.sms;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

@RestController
@RequestMapping(FlowAppConstants.REST_API_CHEMP_SMS)
public class ChempSmsController extends BaseWebCrudController<User, JwtTokenProvider, ChempSms, Integer, ChempSmsDao, ChempSmsSearchParameter, ChempSmsService> {

}
