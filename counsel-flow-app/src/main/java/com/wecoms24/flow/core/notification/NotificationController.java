package com.wecoms24.flow.core.notification;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

@RestController
@RequestMapping(FlowAppConstants.REST_API_NOTIFICATION)
public class NotificationController extends BaseWebCrudController<User, JwtTokenProvider, Notification, Long, NotificationDao, NotificationSearchParameter, NotificationService> {

	@PostMapping(value = "/send-message", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public void sendMessageByMessage(@RequestBody NotificationSearchParameter entityParam) {
		entityService.sendMessage(getLoginUser(), entityParam);
	}

	@PostMapping(value = "/send-message", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public void sendMessageByFomAndQueryParam(NotificationSearchParameter entityParam) {
		entityService.sendMessage(getLoginUser(), entityParam);
	}
}
