package com.wecoms24.flow.settings.menu;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
@RequestMapping(FlowAppConstants.REST_API_SETTINGS_MENU)
public class MenuController extends BaseWebCrudController<User, JwtTokenProvider, Menu, Long, MenuDao, MenuSearchParameter, MenuService> {

	@PutMapping(value = "/{entityId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
    public Menu putByMultipartForm(@PathVariable("entityId") Long entityId, MenuSearchParameter searchParam, @RequestParam(value = "iconFile", required = false) MultipartFile iconFile, @RequestParam(value = "quickIconFile", required = false) MultipartFile quickIconFile) {
		searchParam.getEntity().setEntityId(entityId);
		return entityService.update(getLoginUser(), searchParam.getEntity(), iconFile, quickIconFile);
    }
	
	@DeleteMapping(value = "/{entityId}/files", params = { "removeIconType"}, produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteIconFilesBySearchParameter(@PathVariable("entityId") Long entityId, MenuSearchParameter searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		entityService.deleteIconFiles(getLoginUser(), searchParam.getEntity().getEntityId(), searchParam.getRemoveIconType());
	}
}
