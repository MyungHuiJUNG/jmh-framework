package com.wecoms24.flow.settings.valiable;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
public class SystemVariableServiceImpl extends AbstractBaseUserCrudEntityService<User, SystemVariable, String, SystemVariableDao, SystemVariableSearchParameter> implements SystemVariableService {

	@Transactional
	@Override
	public SystemVariable regist(User loginUser, SystemVariable entity) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Transactional
	@Override
	public List<SystemVariable> regist(User loginUser, List<SystemVariable> entities) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Transactional
	@Override
	public void delete(User loginUser, String entityId) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Transactional
	@Override
	public void delete(User loginUser, List<String> entityIds) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}
}


