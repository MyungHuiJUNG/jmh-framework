package com.wecoms24.flow.settings.menu;

import org.springframework.web.multipart.MultipartFile;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface MenuService extends BaseUserCrudEntityService<User, Menu, Long, MenuDao, MenuSearchParameter> {
	Menu update(User loginUser, Menu entity, MultipartFile iconFile, MultipartFile quickIconFile);
	void deleteIconFiles(User loginUser, Long entityId, String removeIconType);
}
