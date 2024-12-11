package com.wecoms24.flow.auth.access;

import java.util.List;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

@Service
@Primary
public class AccessLogServiceImpl extends AbstractBaseUserCrudEntityService<User, AccessLog, Long, AccessLogDao, AccessLogSearchParameter> implements AccessLogService {

	@Override
	public AccessLog regist(User loginUser, AccessLog entity) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Override
	public List<AccessLog> regist(User loginUser, List<AccessLog> entities) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Override
	public AccessLog update(User loginUser, AccessLog entity) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Override
	public List<AccessLog> update(User loginUser, List<AccessLog> entities) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Override
	public void delete(User loginUser, Long entityId) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Override
	public void delete(User loginUser, List<Long> entityIds) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}
}
