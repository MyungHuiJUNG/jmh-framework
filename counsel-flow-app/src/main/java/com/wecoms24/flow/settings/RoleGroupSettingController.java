package com.wecoms24.flow.settings;

import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.AuthUserDetails;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.controller.BaseWebController;
import com.wecoms24.flow.settings.menu.Menu;
import com.wecoms24.flow.settings.menu.MenuSearchParameter;
import com.wecoms24.flow.settings.role.Role;
import com.wecoms24.flow.settings.role.RoleSearchParameter;
import com.wecoms24.flow.settings.role.group.RoleGroup;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserJsonView;
import com.wecoms24.flow.user.UserSearchParameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(FlowAppConstants.REST_API_SETTINGS_AUTH)
public class RoleGroupSettingController extends BaseWebController {
	
	@Autowired
	private RoleGroupSettingService entityService;
	
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/roles", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postRoleByMessage(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, @RequestBody RoleSearchParameter entityParam) {
		return entityService.registRole(getLoginUser(), roleGroupEntityId, entityParam.getEntity());
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/roles", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postRoleByFomAndQueryParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, RoleSearchParameter entityParam) {
		return entityService.registRole(getLoginUser(), roleGroupEntityId, entityParam.getEntity());
	}
	
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/roles/multiple", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postRolesByMessage(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, @RequestBody RoleSearchParameter entityParam) {
		return entityService.registRoles(getLoginUser(), roleGroupEntityId, entityParam.getEntities());
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/roles/multiple", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postRolesByFomAndQueryParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, RoleSearchParameter entityParam) {
		return entityService.registRoles(getLoginUser(), roleGroupEntityId, entityParam.getEntities());
	}
	
	@JsonView({ FlowDataJsonView.RootView.class })
	@GetMapping(value = "/roles", params = { "page", "size" }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public Slice<Role> getRolesByPaging(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, RoleSearchParameter searchParam) {
		return entityService.findRolesByPaging(getLoginUser(), roleGroupEntityId, searchParam);
	}

	@JsonView({ FlowDataJsonView.RootView.class })
	@GetMapping(value = "/roles", produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<Role> getRolesBySearchParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, RoleSearchParameter searchParam) {
		return entityService.findRoles(getLoginUser(), roleGroupEntityId, searchParam);
	}
	
	@DeleteMapping(value = "/roles/{entityId}", produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteRoleBySearchParameter(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, @PathVariable("entityId") Long entityId, RoleSearchParameter searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		entityService.deleteRole(getLoginUser(), roleGroupEntityId, searchParam.getEntity().getEntityId());
	}

	@DeleteMapping(value = "/roles", produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteRolesBySearchParameter(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, RoleSearchParameter searchParam) {
		entityService.deleteRoles(getLoginUser(), roleGroupEntityId, searchParam.getEntityIds());
	}
	
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/menus", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postMenuByMessage(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, @RequestBody MenuSearchParameter entityParam) {
		return entityService.registMenu(getLoginUser(), roleGroupEntityId, entityParam.getEntity());
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/menus", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postMenuByFomAndQueryParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, MenuSearchParameter entityParam) {
		return entityService.registMenu(getLoginUser(), roleGroupEntityId, entityParam.getEntity());
	}
	
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/menus/multiple", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postMenusByMessage(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, @RequestBody MenuSearchParameter entityParam) {
		return entityService.registMenus(getLoginUser(), roleGroupEntityId, entityParam.getEntities());
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/menus/multiple", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postMenusByFomAndQueryParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, MenuSearchParameter entityParam) {
		return entityService.registMenus(getLoginUser(), roleGroupEntityId, entityParam.getEntities());
	}
	
	@JsonView({ FlowDataJsonView.RootView.class })
	@GetMapping(value = "/menus", params = { "page", "size" }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public Slice<Menu> getMenusByPaging(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, MenuSearchParameter searchParam) {
		return entityService.findMenusByPaging(getLoginUser(), roleGroupEntityId, searchParam);
	}

	@JsonView({ FlowDataJsonView.RootView.class })
	@GetMapping(value = "/menus", produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<Menu> getMenusBySearchParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, MenuSearchParameter searchParam) {
		return entityService.findMenus(getLoginUser(), roleGroupEntityId, searchParam);
	}
	
	@DeleteMapping(value = "/menus/{entityId}", produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteMenuBySearchParameter(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, @PathVariable("entityId") Long entityId, MenuSearchParameter searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		entityService.deleteMenu(getLoginUser(), roleGroupEntityId, searchParam.getEntity().getEntityId());
	}

	@DeleteMapping(value = "/menus", produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteMenusBySearchParameter(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, MenuSearchParameter searchParam) {
		entityService.deleteMenus(getLoginUser(), roleGroupEntityId, searchParam.getEntityIds());
	}
	
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/users", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postUserByMessage(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, @RequestBody UserSearchParameter entityParam) {
		return entityService.registUser(getLoginUser(), roleGroupEntityId, entityParam.getEntity());
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/users", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postUserByFomAndQueryParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, UserSearchParameter entityParam) {
		return entityService.registUser(getLoginUser(), roleGroupEntityId, entityParam.getEntity());
	}
	
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/users/multiple", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postUsersByMessage(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, @RequestBody UserSearchParameter entityParam) {
		return entityService.registUsers(getLoginUser(), roleGroupEntityId, entityParam.getEntities());
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "/users/multiple", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup postUsersByFomAndQueryParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, UserSearchParameter entityParam) {
		return entityService.registUsers(getLoginUser(), roleGroupEntityId, entityParam.getEntities());
	}
	
	@JsonView({ UserJsonView.UserListEntityView.class })
	@GetMapping(value = "/users", params = { "page", "size" }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public Slice<User> getUsersByPaging(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, UserSearchParameter searchParam) {
		return entityService.findUsersByPaging(getLoginUser(), roleGroupEntityId, searchParam);
	}

	@JsonView({ UserJsonView.UserListEntityView.class })
	@GetMapping(value = "/users", produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<User> getUsersBySearchParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, UserSearchParameter searchParam) {
		return entityService.findUsers(getLoginUser(), roleGroupEntityId, searchParam);
	}
	
	@DeleteMapping(value = "/users/{entityId}", produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteUserBySearchParameter(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, @PathVariable("entityId") Long entityId, UserSearchParameter searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		entityService.deleteUser(getLoginUser(), roleGroupEntityId, searchParam.getEntity().getEntityId());
	}

	@DeleteMapping(value = "/users", produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteUsersBySearchParameter(@PathVariable("roleGroupEntityId") Long roleGroupEntityId, UserSearchParameter searchParam) {
		entityService.deleteUsers(getLoginUser(), roleGroupEntityId, searchParam.getEntityIds());
	}
	
	@PostMapping(value = "/copy", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup copyRoleGroupByMessage(@PathVariable("roleGroupEntityId") Long roleGroupEntityId) {
		return entityService.copyRoleGroup(getLoginUser(), roleGroupEntityId);
	}

	@PostMapping(value = "/copy", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public RoleGroup copyRoleGroupByFomAndQueryParam(@PathVariable("roleGroupEntityId") Long roleGroupEntityId) {
		return entityService.copyRoleGroup(getLoginUser(), roleGroupEntityId);
	}
	
	public User getLoginUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof AuthUserDetails) {
        	AuthUserDetails userDetails = (AuthUserDetails) authentication.getPrincipal();
            return userDetails.getUser();
        }
        
        return null;
	}
}
