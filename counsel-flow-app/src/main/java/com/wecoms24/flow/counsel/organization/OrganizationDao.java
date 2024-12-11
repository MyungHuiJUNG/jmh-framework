package com.wecoms24.flow.counsel.organization;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface OrganizationDao extends BaseUserCrudEntityJpaDao<User, Organization, Long, OrganizationSearchParameter> {

}
