package com.wecoms24.flow.counsel.link;

import org.springframework.web.multipart.MultipartFile;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface SiteLinkService extends BaseUserCrudEntityService<User, SiteLink, Long, SiteLinkDao, SiteLinkSearchParameter> {
	SiteLink regist(User loginUser, SiteLink entity, MultipartFile iconFile);
	SiteLink update(User loginUser, SiteLink entity, MultipartFile iconFile);
	void deleteIconFile(User loginUser, Long entityId);
}
