package com.wecoms24.flow.user;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
public class UserServiceImpl extends AbstractBaseUserCrudEntityService<User, User, Long, UserDao, UserSearchParameter> implements UserService {

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public User regist(User loginUser, User entity) {
		checkDuplicateUserId(entity.getId());
		entity.setPassword(passwordEncoder.encode(entity.getPassword()));
		return super.regist(loginUser, entity);
	}

	@Transactional
	@Override
	public List<User> regist(User loginUser, List<User> entities) {
		for (User entity : entities) {
			checkDuplicateUserId(entity.getId());
			entity.setPassword(passwordEncoder.encode(entity.getPassword()));
		}
		return super.regist(loginUser, entities);
	}

	@Transactional
	@Override
	public User update(User loginUser, User entity) {
		if (entity.getPassword() != null && entity.getPassword().isEmpty() == false) {
			entity.setPassword(passwordEncoder.encode(entity.getPassword()));
		}
		
		User prevUser = entityDao.findOneByEntityId(entity.getEntityId());
		if (prevUser.getRoleGroup() != null) {
			prevUser.setRoleGroup(null);
			entityDao.update(prevUser);
		}
		
		
		return super.update(loginUser, entity);
	}

	@Transactional
	@Override
	public List<User> update(User loginUser, List<User> entities) {
		for (User entity : entities) {
			if (entity.getPassword() != null && entity.getPassword().isEmpty() == false) {
				entity.setPassword(passwordEncoder.encode(entity.getPassword()));
			}
		}
		return super.update(loginUser, entities);
	}

	public void checkDuplicateUserId(String id) {
		User foundUser = entityDao.findById(id);
		if (foundUser != null)
			throw new FlowException(FlowErrorCode.DUPLICATE_USER_ID);
	}
}
