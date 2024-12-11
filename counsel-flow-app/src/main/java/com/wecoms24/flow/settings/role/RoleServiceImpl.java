package com.wecoms24.flow.settings.role;

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
public class RoleServiceImpl extends AbstractBaseUserCrudEntityService<User, Role, Long, RoleDao, RoleSearchParameter> implements RoleService {

	@Transactional
	@Override
	public Role regist(User loginUser, Role entity) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Transactional
	@Override
	public List<Role> regist(User loginUser, List<Role> entities) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}
	
	@Transactional
	@Override
	public void delete(User loginUser, Long entityId) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Transactional
	@Override
	public void delete(User loginUser, List<Long> entityIds) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}
}
