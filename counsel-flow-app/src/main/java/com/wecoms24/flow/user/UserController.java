package com.wecoms24.flow.user;

import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;

import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(FlowAppConstants.REST_API_USER)
public class UserController extends BaseWebCrudController<User, JwtTokenProvider, User, Long, UserDao, UserSearchParameter, UserService> {

	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@Override
	public User postByMessage(UserSearchParameter entityParam) {
		return super.postByMessage(entityParam);
	}

	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@Override
	public User postByFomAndQueryParam(UserSearchParameter entityParam) {
		return super.postByFomAndQueryParam(entityParam);
	}

	@JsonView({ UserJsonView.UserListEntityView.class })
	@Override
	public List<User> postEntitiesByMessage(UserSearchParameter entityParam) {
		return super.postEntitiesByMessage(entityParam);
	}

	@JsonView({ UserJsonView.UserListEntityView.class })
	@Override
	public List<User> postEntitiesByFomAndQueryParam(UserSearchParameter entityParam) {
		return super.postEntitiesByFomAndQueryParam(entityParam);
	}

	@JsonView({ UserJsonView.UserListEntityView.class })
	@Override
	public Slice<User> getBySlice(UserSearchParameter searchParam) {
		return super.getBySlice(searchParam);
	}

	@JsonView({ UserJsonView.UserListEntityView.class })
	@Override
	public List<User> getAllBySearchParam(UserSearchParameter searchParam) {
		return super.getAllBySearchParam(searchParam);
	}

	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@Override
	public User getOneBySearchParam(Long entityId, UserSearchParameter searchParam) {
		return super.getOneBySearchParam(entityId, searchParam);
	}

	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@Override
	public User putByMessage(Long entityId, UserSearchParameter searchParam) {
		return super.putByMessage(entityId, searchParam);
	}

	@JsonView({ UserJsonView.UserSingleEntityView.class })
	@Override
	public User putByFormAndQueryParam(Long entityId, UserSearchParameter searchParam) {
		return super.putByFormAndQueryParam(entityId, searchParam);
	}

	@JsonView({ UserJsonView.UserListEntityView.class })
	@Override
	public List<User> putEntitiesByMessage(UserSearchParameter entityParam) {
		return super.putEntitiesByMessage(entityParam);
	}

	@JsonView({ UserJsonView.UserListEntityView.class })
	@Override
	public List<User> putEntitiesByFomAndQueryParam(UserSearchParameter entityParam) {
		return super.putEntitiesByFomAndQueryParam(entityParam);
	}
}
