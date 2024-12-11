package com.wecoms24.flow.user.command.key;

import java.util.List;

import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.command.PersonalCommand;

@RestController
@RequestMapping(FlowAppConstants.REST_API_PERSONAL_SHORTCUT_KEY)
public class ShortCutKeyController extends BaseWebCrudController<User, JwtTokenProvider, ShortCutKey, Long, ShortCutKeyDao, ShortCutKeySearchParameter, ShortCutKeyService> {

	@Override
	public ShortCutKey postByFomAndQueryParam(ShortCutKeySearchParameter entityParam) {
		PersonalCommand command = new PersonalCommand();
		command.setEntityId(entityParam.getCommandEntityId());
		entityParam.getEntity().setPersonalCommand(command);
		return super.postByFomAndQueryParam(entityParam);
	}

	@Override
	public List<ShortCutKey> postEntitiesByFomAndQueryParam(ShortCutKeySearchParameter entityParam) {
		PersonalCommand command = new PersonalCommand();
		command.setEntityId(entityParam.getCommandEntityId());
		for (ShortCutKey entity : entityParam.getEntities()) {
			entity.setPersonalCommand(command);
		}
		return super.postEntitiesByFomAndQueryParam(entityParam);
	}

	@Override
	public Slice<ShortCutKey> getBySlice(ShortCutKeySearchParameter searchParam) {
		PersonalCommand command = new PersonalCommand();
		command.setEntityId(searchParam.getCommandEntityId());
		searchParam.getEntity().setPersonalCommand(command);
		return super.getBySlice(searchParam);
	}

	@Override
	public List<ShortCutKey> getAllBySearchParam(ShortCutKeySearchParameter searchParam) {
		PersonalCommand command = new PersonalCommand();
		command.setEntityId(searchParam.getCommandEntityId());
		searchParam.getEntity().setPersonalCommand(command);
		return super.getAllBySearchParam(searchParam);
	}

	@Override
	public ShortCutKey putByMessage(Long entityId, ShortCutKeySearchParameter searchParam) {
		PersonalCommand command = new PersonalCommand();
		command.setEntityId(searchParam.getCommandEntityId());
		searchParam.getEntity().setPersonalCommand(command);
		return super.putByMessage(entityId, searchParam);
	}

	@Override
	public ShortCutKey putByFormAndQueryParam(Long entityId, ShortCutKeySearchParameter searchParam) {
		PersonalCommand command = new PersonalCommand();
		command.setEntityId(searchParam.getCommandEntityId());
		searchParam.getEntity().setPersonalCommand(command);
		return super.putByFormAndQueryParam(entityId, searchParam);
	}
	
	@Override
	public List<ShortCutKey> putEntitiesByFomAndQueryParam(ShortCutKeySearchParameter entityParam) {
		PersonalCommand command = new PersonalCommand();
		command.setEntityId(entityParam.getCommandEntityId());
		for (ShortCutKey entity : entityParam.getEntities()) {
			entity.setPersonalCommand(command);
		}
		return super.putEntitiesByFomAndQueryParam(entityParam);
	}
}
