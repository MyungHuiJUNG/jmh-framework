package com.wecoms24.flow.counsel.link;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

@RestController
@RequestMapping(FlowAppConstants.REST_API_SITE_LINK)
public class SiteLinkController extends BaseWebCrudController<User, JwtTokenProvider, SiteLink, Long, SiteLinkDao, SiteLinkSearchParameter, SiteLinkService> {

	@PostMapping(value = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
    public SiteLink poststByMultipartForm(SiteLinkSearchParameter searchParam, @RequestParam(value = "iconFile", required = false) MultipartFile iconFile) {
		return entityService.regist(getLoginUser(), searchParam.getEntity(), iconFile);
    }
	
	@PutMapping(value = "/{entityId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
    public SiteLink putByMultipartForm(@PathVariable("entityId") Long entityId, SiteLinkSearchParameter searchParam, @RequestParam(value = "iconFile", required = false) MultipartFile iconFile) {
		searchParam.getEntity().setEntityId(entityId);
		return entityService.update(getLoginUser(), searchParam.getEntity(), iconFile);
    }
	
	@DeleteMapping(value = "/{entityId}/files", produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteIconFile(@PathVariable("entityId") Long entityId, SiteLinkSearchParameter searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		entityService.deleteIconFile(getLoginUser(), searchParam.getEntity().getEntityId());
	}
}
