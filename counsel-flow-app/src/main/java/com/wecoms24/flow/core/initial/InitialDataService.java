package com.wecoms24.flow.core.initial;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.common.SHA2Util;
import com.wecoms24.flow.core.initial.InitialDataConfig.CodeConfig;
import com.wecoms24.flow.core.initial.InitialDataConfig.SystemVariableConfig;
import com.wecoms24.flow.settings.code.Code;
import com.wecoms24.flow.settings.code.CodeDao;
import com.wecoms24.flow.settings.code.CodeSearchParameter;
import com.wecoms24.flow.settings.code.CodeType;
import com.wecoms24.flow.settings.menu.Menu;
import com.wecoms24.flow.settings.menu.MenuActionType;
import com.wecoms24.flow.settings.menu.MenuDao;
import com.wecoms24.flow.settings.menu.MenuSearchParameter;
import com.wecoms24.flow.settings.role.Role;
import com.wecoms24.flow.settings.role.RoleDao;
import com.wecoms24.flow.settings.role.RoleSearchParameter;
import com.wecoms24.flow.settings.role.group.RoleGroup;
import com.wecoms24.flow.settings.role.group.RoleGroupDao;
import com.wecoms24.flow.settings.role.group.RoleGroupSearchParameter;
import com.wecoms24.flow.settings.valiable.SystemVariable;
import com.wecoms24.flow.settings.valiable.SystemVariableDao;
import com.wecoms24.flow.settings.valiable.SystemVariableSearchParameter;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserDao;
import com.wecoms24.flow.user.UserSearchParameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class InitialDataService {
	
	@Autowired
    private InitialDataConfig initialDataConfig;
	
	@Autowired
    private RoleGroupDao roleGroupDao;

	@Autowired
	private SystemVariableDao systemVariableDao;
	
    @Autowired
    private RoleDao roleDao;

    @Autowired
    private MenuDao menuDao;
    
    @Autowired
    private CodeDao codeDao;

    @Autowired
    private UserDao userDao;
    
    @Autowired
	private PasswordEncoder passwordEncoder;
    
    private AtomicBoolean hasChanged = new AtomicBoolean(false);
    
    @EventListener(ApplicationReadyEvent.class)
    @Transactional(rollbackFor = Exception.class, transactionManager = "flowMainTransactionManager")
    public void initializeData() {
    	try {
    		List<SystemVariableConfig> systemVariableConfigs = initialDataConfig.getSystemVariables();
    		if (systemVariableConfigs != null && systemVariableConfigs.isEmpty() == false) {
    			systemVariableConfigs.forEach(systemVariableConfig -> saveSystemVariable(null, systemVariableConfig));
    		}
    		
    		List<CodeConfig> codeConfigs = initialDataConfig.getCodes();
    		if (codeConfigs != null && codeConfigs.isEmpty() == false) {
    			codeConfigs.forEach(codeConfig -> saveCode(null, codeConfig));
    		}
    		
    		RoleGroup superAdminGroup = getSuperAdminRoleGroup();
        	setSuperAdminAuthToAdminUser(superAdminGroup);

        	List<InitialDataConfig.RoleConfig> roleConfigs = initialDataConfig.getRoles();
            if (roleConfigs != null && roleConfigs.isEmpty() == false) {
            	roleConfigs.forEach(roleConfig -> saveRole(null, roleConfig));
            }
            
            List<InitialDataConfig.MenuConfig> menuConfigs = initialDataConfig.getMenus();
            if (menuConfigs != null && menuConfigs.isEmpty() == false) {
            	menuConfigs.forEach(menuConfig -> saveMenu(null, menuConfig));
            }
            
            addAllAuthToSuperAdminAuth(superAdminGroup);
    	} catch (Exception e) {
            throw e;
        }
    }
    
    private RoleGroup getSuperAdminRoleGroup() {
    	RoleGroupSearchParameter searchParameter = new RoleGroupSearchParameter();
    	searchParameter.getEntity().setName(FlowAppConstants.SUPER_ADMIN_ROLE_GROUP_NAME);
    	searchParameter.setIsSearchLike(false);
    	RoleGroup roleGroup = roleGroupDao.findOne(searchParameter);
    	if (roleGroup == null) {
    		RoleGroup superAdminGroup = new RoleGroup();
            superAdminGroup.setName(FlowAppConstants.SUPER_ADMIN_ROLE_GROUP_NAME);
            roleGroup = roleGroupDao.create(superAdminGroup);
            hasChanged.compareAndSet(false, true);
    	}
    	return roleGroup;
    }
    
    private void setSuperAdminAuthToAdminUser(RoleGroup superAdminGroup) {
    	UserSearchParameter searchParameter = new UserSearchParameter();
    	searchParameter.getEntity().setId(FlowAppConstants.SUPER_ADMIN_ID);
    	User user = userDao.findOne(searchParameter);
    	if (user == null) {
    		User adminUser = new User();
            adminUser.setId(FlowAppConstants.SUPER_ADMIN_ID);
            adminUser.setName(FlowAppConstants.SUPER_ADMIN_NAME);
            adminUser.setUseTypeCode(FlowAppConstants.USE_TYPE_CODE_USE);
            String encryptPassword = SHA2Util.encrypt(FlowAppConstants.SUPER_ADMIN_PWD, FlowAppConstants.ENCODING_ALGORITM);
            adminUser.setPassword(passwordEncoder.encode(encryptPassword));
            adminUser.setRoleGroup(superAdminGroup);
            userDao.create(adminUser);
            hasChanged.compareAndSet(false, true);
    	}
    }
    
    private void saveSystemVariable(SystemVariable parent, InitialDataConfig.SystemVariableConfig systemVariableConfig) {
    	SystemVariableSearchParameter searchParameter = new SystemVariableSearchParameter();
    	searchParameter.getEntity().setKey(systemVariableConfig.getKey());
    	searchParameter.setIsTopCode(false);
    	SystemVariable systemVariable = systemVariableDao.findOne(searchParameter);
    	if (systemVariable == null) {
    		systemVariable = new SystemVariable();
    		systemVariable.setKey(systemVariableConfig.getKey());
    		systemVariable.setDisplayName(systemVariableConfig.getDisplayName());
    		systemVariable.setDescription(systemVariableConfig.getDescription());
    		systemVariable.setEditable(systemVariableConfig.getEditable());
    		systemVariable.setEditType(systemVariableConfig.getEditType());
    		systemVariable.setEditItem(systemVariableConfig.getEditItem());
    		systemVariable.setType(systemVariableConfig.getType());
    		systemVariable.setValue(systemVariableConfig.getValue());
    		systemVariable.setParent(parent);
    		systemVariable.updatePath();
    		systemVariable = systemVariableDao.create(systemVariable);
    	}
    	
    	SystemVariable currentSystemVariable = systemVariable;
    	if (systemVariableConfig.getChildren() != null) {
    		systemVariableConfig.getChildren().forEach(childConfig -> saveSystemVariable(currentSystemVariable, childConfig));
    	}
    }
    
    private void saveCode(Code parent, InitialDataConfig.CodeConfig codeConfig) {
    	CodeSearchParameter searchParameter = new CodeSearchParameter();
    	searchParameter.getEntity().setCode(codeConfig.getCode());
    	searchParameter.setIsTopCode(false);
        Code code = codeDao.findOne(searchParameter);
        if (code == null) {
            code = new Code();
            if (parent == null) {
            	code.setCodeType(CodeType.valueOf(codeConfig.getCodeType()));
            } else {
            	code.setCodeType(parent.getCodeType());
            }
            code.setName(codeConfig.getName());
            code.setCode(codeConfig.getCode());
            code.setRemarkText(codeConfig.getRemarkText());
            code.setOrderNumber(codeConfig.getOrderNumber());
            code.setParent(parent);
            code.updatePath();
            code = codeDao.create(code);
        }

        Code currentCode = code;
        if (codeConfig.getChildren() != null) {
            codeConfig.getChildren().forEach(childConfig -> saveCode(currentCode, childConfig));
        }
    }
    
    private void saveRole(Role parent, InitialDataConfig.RoleConfig roleConfig) {
    	RoleSearchParameter searchParameter = new RoleSearchParameter();
    	searchParameter.getEntity().setCode(roleConfig.getCode());
    	searchParameter.setIsTopCode(false);
        Role role = roleDao.findOne(searchParameter);
        if (role == null) {
            role = new Role();
            role.setName(roleConfig.getName());
            role.setCode(roleConfig.getCode());
            role.setOrderNumber(roleConfig.getOrderNumber());
            role.setParent(parent);
            role.updatePath();
            role = roleDao.create(role);
            hasChanged.compareAndSet(false, true);
        }

        Role currentRole = role;
        if (roleConfig.getChildren() != null) {
            roleConfig.getChildren().forEach(childConfig -> saveRole(currentRole, childConfig));
        }
    }

    private void saveMenu(Menu parent, InitialDataConfig.MenuConfig menuConfig) {
    	MenuSearchParameter searchParameter = new MenuSearchParameter();
    	searchParameter.getEntity().setCode(menuConfig.getCode());
    	searchParameter.setIsTopCode(false);
        Menu menu = menuDao.findOne(searchParameter);
        if (menu == null) {
            menu = new Menu();
            menu.setName(menuConfig.getName());
            menu.setCode(menuConfig.getCode());
            menu.setActionId(menuConfig.getActionId());
            menu.setActionNumber(menuConfig.getActionNumber());
            menu.setOrderNumber(menuConfig.getOrderNumber());
            menu.setUsable(menuConfig.getUsable());
            menu.setQuickOrderNumber(menuConfig.getQuickOrderNumber());
            menu.setQuickUsable(menuConfig.getQuickUsable());
            menu.setParent(parent);
            menu.updatePath();
            
            if (menuConfig.getActionType() != null) {
                menu.setActionType(MenuActionType.valueOf(menuConfig.getActionType()));
            }

            menuDao.create(menu);
            hasChanged.compareAndSet(false, true);
        }

        Menu currentMenu = menu;
        if (menuConfig.getChildren() != null) {
            menuConfig.getChildren().forEach(childConfig -> saveMenu(currentMenu, childConfig));
        }
    }
    
    private void addAllAuthToSuperAdminAuth(RoleGroup superAdminGroup) {
    	if (hasChanged.get()) {
    		RoleSearchParameter roleSearchParameter = new RoleSearchParameter();
        	roleSearchParameter.setIsTopCode(false);
        	List<Role> allRoles = roleDao.find(roleSearchParameter);
        	superAdminGroup.setRoles(allRoles);
        	
        	MenuSearchParameter menuSearchParameter = new MenuSearchParameter();
        	menuSearchParameter.setIsTopCode(false);
        	List<Menu> allMenus = menuDao.find(menuSearchParameter);
        	superAdminGroup.setMenus(allMenus);
        	
        	roleGroupDao.update(superAdminGroup);
    	}
    }
}
