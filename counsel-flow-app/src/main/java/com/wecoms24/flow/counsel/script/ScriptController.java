package com.wecoms24.flow.counsel.script;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

@RestController
@RequestMapping(FlowAppConstants.REST_API_SCRIPT)
public class ScriptController extends BaseWebCrudController<User, JwtTokenProvider, Script, Long, ScriptDao, ScriptSearchParameter, ScriptService> {

}
