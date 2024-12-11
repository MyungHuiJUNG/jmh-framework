package com.wecoms24.flow.user.command;

import java.util.List;

import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

@RestController
@RequestMapping(FlowAppConstants.REST_API_PERSONAL_COMMAND)
public class PersonalCommandController extends BaseWebCrudController<User, JwtTokenProvider, PersonalCommand, Long, PersonalCommandDao, PersonalCommandSearchParameter, PersonalCommandService> {

	@Override
	public PersonalCommand postByMessage(PersonalCommandSearchParameter entityParam) {
		User user = new User();
		user.setEntityId(entityParam.getUserEntityId());
		entityParam.getEntity().setUser(user);
		return super.postByMessage(entityParam);
	}

	@Override
	public PersonalCommand postByFomAndQueryParam(PersonalCommandSearchParameter entityParam) {
		User user = new User();
		user.setEntityId(entityParam.getUserEntityId());
		entityParam.getEntity().setUser(user);
		return super.postByFomAndQueryParam(entityParam);
	}

	@Override
	public Slice<PersonalCommand> getBySlice(PersonalCommandSearchParameter searchParam) {
		User user = new User();
		user.setEntityId(searchParam.getUserEntityId());
		searchParam.getEntity().setUser(user);
		return super.getBySlice(searchParam);
	}

	@Override
	public List<PersonalCommand> getAllBySearchParam(PersonalCommandSearchParameter searchParam) {
		User user = new User();
		user.setEntityId(searchParam.getUserEntityId());
		searchParam.getEntity().setUser(user);
		return super.getAllBySearchParam(searchParam);
	}

	@Override
	public PersonalCommand putByMessage(Long entityId, PersonalCommandSearchParameter searchParam) {
		User user = new User();
		user.setEntityId(searchParam.getUserEntityId());
		searchParam.getEntity().setUser(user);
		return super.putByMessage(entityId, searchParam);
	}

	@Override
	public PersonalCommand putByFormAndQueryParam(Long entityId, PersonalCommandSearchParameter searchParam) {
		User user = new User();
		user.setEntityId(searchParam.getUserEntityId());
		searchParam.getEntity().setUser(user);
		return super.putByFormAndQueryParam(entityId, searchParam);
	}
}
