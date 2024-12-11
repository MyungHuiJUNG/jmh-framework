package com.wecoms24.flow.settings;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.file.FileMetaDataService;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.settings.menu.Menu;
import com.wecoms24.flow.settings.menu.MenuDao;
import com.wecoms24.flow.settings.menu.MenuSearchParameter;
import com.wecoms24.flow.settings.role.Role;
import com.wecoms24.flow.settings.role.RoleDao;
import com.wecoms24.flow.settings.role.RoleSearchParameter;
import com.wecoms24.flow.settings.role.group.RoleGroup;
import com.wecoms24.flow.settings.role.group.RoleGroupDao;
import com.wecoms24.flow.settings.role.group.RoleGroupSearchParameter;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserDao;
import com.wecoms24.flow.user.UserSearchParameter;

@Service
@Primary
public class RoleGroupSettingServiceImpl implements RoleGroupSettingService {

	@Autowired
	private FileMetaDataService fileMetaDataService;

	@Autowired
	private RoleGroupDao roleGroupDao;
	
	@Autowired
	private RoleDao roleDao;
	
	@Autowired
	private MenuDao menuDao;
	
	@Autowired
	private UserDao userDao;
	
	@Transactional
	@Override
	public RoleGroup registRole(User loginUser, Long roleGroupEntityId, Role entity) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		Role addTargetRole = findRoleWithValidate(entity);
		roleGroup.addRole(addTargetRole);
		
		return roleGroupDao.create(loginUser, roleGroup);
	}
	
	@Transactional
	@Override
	public RoleGroup registRoles(User loginUser, Long roleGroupEntityId, List<Role> entities) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		if (entities.isEmpty()) {
			roleGroup.setRoles(entities);
			return roleGroupDao.create(roleGroup);
		} else {
			validateRoleEntities(entities);
			roleGroup.setRoles(entities);
			return roleGroupDao.create(loginUser, roleGroup);
		}
	}
	
	@Override
	public Slice<Role> findRolesByPaging(User loginUser, Long roleGroupEntityId, RoleSearchParameter searchParam) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
        List<Role> roles = roleGroup.getRoles();

        int page = searchParam.getPage();
        int size = searchParam.getSize();

        int start = page * size;
        int end = Math.min(start + size, roles.size());

        List<Role> content = roles.subList(start, end);

        boolean hasNext = end < roles.size();
        return new SliceImpl<>(content, PageRequest.of(page, size), hasNext);
	}

	@Override
	public List<Role> findRoles(User loginUser, Long roleGroupEntityId, RoleSearchParameter searchParam) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
        return roleGroup.getRoles();
	}

	@Transactional
	@Override
	public void deleteRole(User loginUser, Long roleGroupEntityId, Long entityId) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		List<Role> filteredRoles = roleGroup.getRoles().stream()
	            .filter(role -> !Objects.equals(role.getEntityId(), entityId))
	            .collect(Collectors.toList());
		
		roleGroup.setRoles(filteredRoles);
		roleGroupDao.create(loginUser, roleGroup);
	}

	@Transactional
	@Override
	public void deleteRoles(User loginUser, Long roleGroupEntityId, List<Long> entityIds) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		List<Role> filteredRoles = roleGroup.getRoles().stream()
	            .filter(role -> !entityIds.contains(role.getEntityId()))
	            .collect(Collectors.toList());
		
		roleGroup.setRoles(filteredRoles);
		roleGroupDao.create(loginUser, roleGroup);
	}

	@Transactional
	@Override
	public RoleGroup registMenu(User loginUser, Long roleGroupEntityId, Menu entity) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		Menu addTargetMenu = findMenuWithValidate(entity);
		roleGroup.addMenu(addTargetMenu);
		
		return roleGroupDao.create(loginUser, roleGroup);
	}
	
	@Transactional
	@Override
	public RoleGroup registMenus(User loginUser, Long roleGroupEntityId, List<Menu> entities) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		if (entities.isEmpty()) {
			roleGroup.setMenus(entities);
			return roleGroupDao.create(roleGroup);
		} else {
			validateMenuEntities(entities);
			roleGroup.setMenus(entities);
			
			return roleGroupDao.create(loginUser, roleGroup);
		}
	}

	@Override
	public Slice<Menu> findMenusByPaging(User loginUser, Long roleGroupEntityId, MenuSearchParameter searchParam) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		List<Menu> menus = roleGroup.getMenus();

		for (Menu foundMenu : menus) {
			setDownloadUrls(foundMenu);
		}

        int page = searchParam.getPage();
        int size = searchParam.getSize();

        int start = page * size;
        int end = Math.min(start + size, menus.size());

        List<Menu> content = menus.subList(start, end);

        boolean hasNext = end < menus.size();
        return new SliceImpl<>(content, PageRequest.of(page, size), hasNext);
	}

	@Override
	public List<Menu> findMenus(User loginUser, Long roleGroupEntityId, MenuSearchParameter searchParam) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);

		for (Menu foundMenu : roleGroup.getMenus()) {
			setDownloadUrls(foundMenu);
		}

        return roleGroup.getMenus();
	}

	@Transactional
	@Override
	public void deleteMenu(User loginUser, Long roleGroupEntityId, Long entityId) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		
		List<Menu> filteredMenus = roleGroup.getMenus().stream()
	            .filter(role -> !Objects.equals(role.getEntityId(), entityId))
	            .collect(Collectors.toList());
		
		roleGroup.setMenus(filteredMenus);
		roleGroupDao.create(loginUser, roleGroup);
	}

	@Transactional
	@Override
	public void deleteMenus(User loginUser, Long roleGroupEntityId, List<Long> entityIds) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
	
		List<Menu> filteredMenus = roleGroup.getMenus().stream()
	            .filter(role -> !entityIds.contains(role.getEntityId()))
	            .collect(Collectors.toList());
		
		roleGroup.setMenus(filteredMenus);
		roleGroupDao.create(loginUser, roleGroup);
	}
	
	@Transactional
	@Override
	public RoleGroup registUser(User loginUser, Long roleGroupEntityId, User entity) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		User addTargetUser = findUserWithValidate(entity);
		if (addTargetUser.getRoleGroup() != null) {
			addTargetUser.setRoleGroup(null);
			userDao.update(loginUser, addTargetUser);
		}

		roleGroup.addUser(addTargetUser);
		
		return roleGroupDao.create(loginUser, roleGroup);
	}
	
	@Transactional
	@Override
	public RoleGroup registUsers(User loginUser, Long roleGroupEntityId, List<User> entities) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		List<User> removeRoleGroupTargets = validateUserEntities(entities);
		if (!removeRoleGroupTargets.isEmpty()) {
			userDao.updateAll(loginUser, removeRoleGroupTargets);
		}
		
		roleGroup.setUsers(entities);
		
		return roleGroupDao.create(loginUser, roleGroup);
	}

	@Override
	public Slice<User> findUsersByPaging(User loginUser, Long roleGroupEntityId, UserSearchParameter searchParam) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		List<User> users = roleGroup.getUsers();
		users.sort(Comparator.comparing(User::getEntityId));
		
		int page = searchParam.getPage();
        int size = searchParam.getSize();

        int start = page * size;
        int end = Math.min(start + size, users.size());

        List<User> content = users.subList(start, end);

        boolean hasNext = end < users.size();
        return new SliceImpl<>(content, PageRequest.of(page, size), hasNext);
	}

	@Override
	public List<User> findUsers(User loginUser, Long roleGroupEntityId, UserSearchParameter searchParam) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		List<User> users = roleGroup.getUsers();
		users.sort(Comparator.comparing(User::getEntityId));
		
		return users;
	}

	@Transactional
	@Override
	public void deleteUser(User loginUser, Long roleGroupEntityId, Long entityId) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		
		List<User> filteredUsers = roleGroup.getUsers().stream()
	            .filter(user -> !Objects.equals(user.getEntityId(), entityId))
	            .collect(Collectors.toList());
		
		roleGroup.setUsers(filteredUsers);
		roleGroupDao.create(loginUser, roleGroup);		
	}

	@Transactional
	@Override
	public void deleteUsers(User loginUser, Long roleGroupEntityId, List<Long> entityIds) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		
		List<User> filteredUsers = roleGroup.getUsers().stream()
	            .filter(role -> !entityIds.contains(role.getEntityId()))
	            .collect(Collectors.toList());
		
		roleGroup.setUsers(filteredUsers);
		roleGroupDao.create(loginUser, roleGroup);		
	}
	
	@Transactional
	@Override
	public RoleGroup copyRoleGroup(User loginUser, Long roleGroupEntityId) {
		RoleGroup roleGroup = getRoleGroupWithValidate(roleGroupEntityId);
		String copyName = findNameToCopyWithRecusive(roleGroup.getName(), 1);
		
		List<Role> roles = roleGroup.getRoles();
		List<Menu> menus = roleGroup.getMenus();
		
		RoleGroup copyTargetRoleGroup = new RoleGroup();
		copyTargetRoleGroup.setName(copyName);
		copyTargetRoleGroup.setRoles(roles);
		copyTargetRoleGroup.setMenus(menus);
		
		return roleGroupDao.create(loginUser, copyTargetRoleGroup);
	}
	
	private RoleGroup getRoleGroupWithValidate(Long roleGroupEntityId) {
		RoleGroup roleGroup = roleGroupDao.findOneByEntityId(roleGroupEntityId);
		if (roleGroup == null)
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		return roleGroup;
	}

	private Role findRoleWithValidate(Role entity) {
		RoleSearchParameter roleSearchParameter = new RoleSearchParameter();
		roleSearchParameter.getEntity().setEntityId(entity.getEntityId());
		roleSearchParameter.setIsTopCode(false);
		Role foundrole = roleDao.findOne(roleSearchParameter);
		if (foundrole == null)
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		return foundrole;
	}
	
	private void validateRoleEntities(List<Role> entities) {
		List<Long> roleEntityIds = entities.stream().map(BaseAuditingUserIdSequenceAbstractEntity::getEntityId).collect(Collectors.toList());
		
		RoleSearchParameter roleSearchParameter = new RoleSearchParameter();
		roleSearchParameter.setEntityIds(roleEntityIds);
		roleSearchParameter.setIsTopCode(false);
		List<Role> foundRoleEntities = roleDao.find(roleSearchParameter);
		
		if (foundRoleEntities == null || foundRoleEntities.size() != entities.size())
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
	}
	
	private Menu findMenuWithValidate(Menu entity) {
		MenuSearchParameter menuSearchParameter = new MenuSearchParameter();
		menuSearchParameter.getEntity().setEntityId(entity.getEntityId());
		menuSearchParameter.setIsTopCode(false);
		Menu foundMenu = menuDao.findOne(menuSearchParameter);
		
		if (foundMenu == null)
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		return foundMenu;
	}
	
	private void validateMenuEntities(List<Menu> entities) {
		List<Long> menuEntityIds = entities.stream().map(BaseAuditingUserIdSequenceAbstractEntity::getEntityId).collect(Collectors.toList());
		
		MenuSearchParameter menuSearchParameter = new MenuSearchParameter();
		menuSearchParameter.setEntityIds(menuEntityIds);
		menuSearchParameter.setIsTopCode(false);
		List<Menu> foundMenuEntities = menuDao.find(menuSearchParameter);
		
		if (foundMenuEntities == null || foundMenuEntities.size() != entities.size())
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
	}
	
	private User findUserWithValidate(User entity) {
		UserSearchParameter userSearchParameter = new UserSearchParameter();
		userSearchParameter.getEntity().setEntityId(entity.getEntityId());
		User foundUser = userDao.findOne(userSearchParameter);
		
		if (foundUser == null)
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		return foundUser;
	}
	
	private List<User> validateUserEntities(List<User> entities) {
		List<Long> userEntityIds = entities.stream().map(BaseAuditingUserIdSequenceAbstractEntity::getEntityId).collect(Collectors.toList());
		
		UserSearchParameter userSearchParameter = new UserSearchParameter();
		userSearchParameter.setEntityIds(userEntityIds);
		List<User> foundUserEntities = userDao.find(userSearchParameter);
		
		List<User> removeRoleGroupTargets = new ArrayList<>();
		if (foundUserEntities == null || foundUserEntities.size() != entities.size())
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		for (User foundUser : foundUserEntities) {
			if (foundUser.getRoleGroup() == null)
				continue;
			
			foundUser.setRoleGroup(null);
			removeRoleGroupTargets.add(foundUser);
		}
		
		return removeRoleGroupTargets;
	}
	
	public String findNameToCopyWithRecusive(String name, int tryCount) {
		name += FlowAppConstants.NAME_TO_COPY_SUFFIX;
		RoleGroupSearchParameter searchParameter = new RoleGroupSearchParameter();
		searchParameter.getEntity().setName(name);
		searchParameter.setIsSearchLike(false);
		RoleGroup foundDuplicateRoleGroup = roleGroupDao.findOne(searchParameter);
		if (foundDuplicateRoleGroup != null) {
			if (tryCount >= 3)
				throw new FlowException(FlowErrorCode.UNABLE_COPY_WHEN_DUPLICATE_ROLEGROUP_NAME);
			
			tryCount += 1;
			return findNameToCopyWithRecusive(name, tryCount);
		} else {
			return name;
		}
	}

	private void setDownloadUrls(Menu menu) {
		if (menu.getIconImageFile() != null) {
			fileMetaDataService.setDownloadUrl(menu.getIconImageFile());
		}

		if (menu.getQuickIconImageFile() != null) {
			fileMetaDataService.setDownloadUrl(menu.getQuickIconImageFile());
		}

		if (menu.hasChild()) {
			menu.getChildren().forEach(this::setDownloadUrls);
		}
	}
}
