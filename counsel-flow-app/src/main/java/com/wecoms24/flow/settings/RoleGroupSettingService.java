package com.wecoms24.flow.settings;

import com.wecoms24.flow.settings.menu.Menu;
import com.wecoms24.flow.settings.menu.MenuSearchParameter;
import com.wecoms24.flow.settings.role.Role;
import com.wecoms24.flow.settings.role.RoleSearchParameter;
import com.wecoms24.flow.settings.role.group.RoleGroup;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserSearchParameter;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface RoleGroupSettingService {
	
	RoleGroup registRole(User loginUser, Long roleGroupEntityId, Role entity);
	
	RoleGroup registRoles(User loginUser, Long roleGroupEntityId, List<Role> entities);

	void deleteRole(User loginUser, Long roleGroupEntityId, Long entityId);

	void deleteRoles(User loginUser, Long roleGroupEntityId, List<Long> entityIds);

	Slice<Role> findRolesByPaging(User loginUser, Long roleGroupEntityId, RoleSearchParameter searchParam);

	List<Role> findRoles(User loginUser, Long roleGroupEntityId, RoleSearchParameter searchParam);

	RoleGroup registMenu(User loginUser, Long roleGroupEntityId, Menu entity);
	
	RoleGroup registMenus(User loginUser, Long roleGroupEntityId, List<Menu> entities);

	Slice<Menu> findMenusByPaging(User loginUser, Long roleGroupEntityId, MenuSearchParameter searchParam);

	List<Menu> findMenus(User loginUser, Long roleGroupEntityId, MenuSearchParameter searchParam);

	void deleteMenu(User loginUser, Long roleGroupEntityId, Long entityId);

	void deleteMenus(User loginUser, Long roleGroupEntityId, List<Long> entityIds);

	RoleGroup registUser(User loginUser, Long roleGroupEntityId, User entity);
	
	RoleGroup registUsers(User loginUser, Long roleGroupEntityId, List<User> entities);

	Slice<User> findUsersByPaging(User loginUser, Long roleGroupEntityId, UserSearchParameter searchParam);

	List<User> findUsers(User loginUser, Long roleGroupEntityId, UserSearchParameter searchParam);

	void deleteUser(User loginUser, Long roleGroupEntityId, Long entityId);

	void deleteUsers(User loginUser, Long roleGroupEntityId, List<Long> entityIds);
	
	RoleGroup copyRoleGroup(User loginUser, Long roleGroupEntityId);
}
