package com.wecoms24.flow.counsel.customer;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

@Service
@Primary
public class CustomerInfoServiceImpl extends AbstractBaseUserCrudEntityService<User, CustomerInfo, Long, CustomerInfoDao, CustomerInfoSearchParameter> implements CustomerInfoService {

}
