package com.wecoms24.flow.chemp.sms;

import java.util.List;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

@Service
@Primary
public class ChempSmsServiceImpl extends AbstractBaseUserCrudEntityService<User, ChempSms, Integer, ChempSmsDao, ChempSmsSearchParameter> implements ChempSmsService {

	@Transactional(value = FlowAppConstants.CHEMP_DB_TRANSACTION_MANAGER)
	@Override
	public ChempSms regist(User loginUser, ChempSms entity) {
		return super.regist(loginUser, entity);
	}

	@Transactional(value = FlowAppConstants.CHEMP_DB_TRANSACTION_MANAGER)
	@Override
	public List<ChempSms> regist(User loginUser, List<ChempSms> entities) {
		return super.regist(loginUser, entities);
	}

	@Transactional(value = FlowAppConstants.CHEMP_DB_TRANSACTION_MANAGER)
	@Override
	public ChempSms update(User loginUser, ChempSms entity) {
		return super.update(loginUser, entity);
	}

	@Transactional(value = FlowAppConstants.CHEMP_DB_TRANSACTION_MANAGER)
	@Override
	public List<ChempSms> update(User loginUser, List<ChempSms> entities) {
		return super.update(loginUser, entities);
	}

	@Transactional(value = FlowAppConstants.CHEMP_DB_TRANSACTION_MANAGER)
	@Override
	public void delete(User loginUser, Integer entityId) {
		super.delete(loginUser, entityId);
	}

	@Transactional(value = FlowAppConstants.CHEMP_DB_TRANSACTION_MANAGER)
	@Override
	public void delete(User loginUser, List<Integer> entityIds) {
		super.delete(loginUser, entityIds);
	}
}
