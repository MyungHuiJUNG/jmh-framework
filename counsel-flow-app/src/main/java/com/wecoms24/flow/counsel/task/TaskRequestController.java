package com.wecoms24.flow.counsel.task;

import java.util.List;

import org.springframework.data.domain.Slice;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserJsonView;

@RestController
@RequestMapping(FlowAppConstants.REST_API_TASK_REQUEST)
public class TaskRequestController extends BaseWebCrudController<User, JwtTokenProvider, TaskRequest, Long, TaskRequestDao, TaskRequestSearchParameter, TaskRequestService> {

	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@Override
	public TaskRequest postByMessage(TaskRequestSearchParameter entityParam) {
		return super.postByMessage(entityParam);
	}

	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@Override
	public TaskRequest postByFomAndQueryParam(TaskRequestSearchParameter entityParam) {
		return super.postByFomAndQueryParam(entityParam);
	}

	@JsonView({ UserJsonView.UserListEntityView.class })
	@Override
	public Slice<TaskRequest> getBySlice(TaskRequestSearchParameter searchParam) {
		return super.getBySlice(searchParam);
	}

	@JsonView({ UserJsonView.UserListEntityView.class })
	@Override
	public List<TaskRequest> getAllBySearchParam(TaskRequestSearchParameter searchParam) {
		return super.getAllBySearchParam(searchParam);
	}

	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@Override
	public TaskRequest putByMessage(Long entityId, TaskRequestSearchParameter searchParam) {
		return super.putByMessage(entityId, searchParam);
	}

	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@Override
	public TaskRequest putByFormAndQueryParam(Long entityId, TaskRequestSearchParameter searchParam) {
		return super.putByFormAndQueryParam(entityId, searchParam);
	}
	
	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@PostMapping(value = "/request-init-password", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public TaskRequest requestInitPasswordByMessage(@RequestBody TaskRequestSearchParameter entityParam) {
		return entityService.requestInitPassword(getLoginUser(), entityParam.getEntity());
	}
	
	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@PostMapping(value = "/request-init-password", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public TaskRequest requestInitPasswordByFomAndQueryParam(TaskRequestSearchParameter entityParam) {
		return entityService.requestInitPassword(getLoginUser(), entityParam.getEntity());
	}
}
