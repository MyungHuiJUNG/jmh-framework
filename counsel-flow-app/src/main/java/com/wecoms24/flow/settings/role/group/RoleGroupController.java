package com.wecoms24.flow.settings.role.group;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(FlowAppConstants.REST_API_SETTINGS_ROLE_GROUP)
public class RoleGroupController extends BaseWebCrudController<User, JwtTokenProvider, RoleGroup, Long, RoleGroupDao, RoleGroupSearchParameter, RoleGroupService> {

}
