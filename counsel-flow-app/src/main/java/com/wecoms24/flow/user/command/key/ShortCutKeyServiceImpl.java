package com.wecoms24.flow.user.command.key;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Primary
public class ShortCutKeyServiceImpl extends AbstractBaseUserCrudEntityService<User, ShortCutKey, Long, ShortCutKeyDao, ShortCutKeySearchParameter> implements ShortCutKeyService {

}
