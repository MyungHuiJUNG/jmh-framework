package com.wecoms24.flow.counsel.customer;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface CustomerInfoDao extends BaseUserCrudEntityJpaDao<User, CustomerInfo, Long, CustomerInfoSearchParameter> {

}
