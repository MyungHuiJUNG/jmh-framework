package com.wecoms24.flow.counsel.type;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(FlowAppConstants.REST_API_COUNSEL_TYPE)
public class CounselTypeController extends BaseWebCrudController<User, JwtTokenProvider, CounselType, Long, CounselTypeDao, CounselTypeSearchParameter, CounselTypeService> {
	
}
