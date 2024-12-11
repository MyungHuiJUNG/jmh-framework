package com.wecoms24.flow.settings.menu;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.file.FileMetaData;
import com.wecoms24.flow.core.file.FileMetaDataService;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

@Service
@Primary
public class MenuServiceImpl extends AbstractBaseUserCrudEntityService<User, Menu, Long, MenuDao, MenuSearchParameter> implements MenuService {
	
	@Autowired
	private FileMetaDataService fileMetaDataService;

	@Transactional
	@Override
	public Menu regist(User loginUser, Menu entity) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Transactional
	@Override
	public List<Menu> regist(User loginUser, List<Menu> entities) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Override
	public Menu findOne(User loginUser, Menu entity) {
		Menu foundMenu = super.findOne(loginUser, entity);
		if (foundMenu != null) {
			setDownloadUrls(foundMenu);
		}
		return foundMenu;
	}

	@Override
	public List<Menu> find(User loginUser, MenuSearchParameter searchParameter) {
		List<Menu> foundMenus = super.find(loginUser, searchParameter);
		for (Menu foundMenu : foundMenus) {
			setDownloadUrls(foundMenu);
		}
		return foundMenus;
	}

	@Override
	public Slice<Menu> findSlice(User loginUser, MenuSearchParameter searchParameter) {
		Slice<Menu> foundPaging = super.findSlice(loginUser, searchParameter);
		List<Menu> foundMenus = foundPaging.getContent();
		for (Menu foundMenu : foundMenus) {
			setDownloadUrls(foundMenu);
		}
		return foundPaging;
	}
	
	@Transactional
	@Override
	public Menu update(User loginUser, Menu entity, MultipartFile iconFile, MultipartFile quickIconFile) {
		Menu foundMenu = entityDao.findOneByEntityId(entity.getEntityId());
		if (foundMenu == null)
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		if (iconFile != null) {
			if (foundMenu.getIconImageFile() != null) {
				fileMetaDataService.deleteByToken(foundMenu.getIconImageFile().getToken());
			}
			
			FileMetaData savedIconFile = fileMetaDataService.save(loginUser, FlowAppConstants.FILE_RESOURCE_TYPE_MENU_ICON, entity.getEntityId(), iconFile);
			entity.setIconImageFile(savedIconFile);
		} else {
			entity.setIconImageFile(foundMenu.getIconImageFile());
		}
		
		if (quickIconFile != null) {
			if (foundMenu.getQuickIconImageFile() != null) {
				fileMetaDataService.deleteByToken(foundMenu.getQuickIconImageFile().getToken());
			}
			
			FileMetaData savedQuickIconFile = fileMetaDataService.save(loginUser, FlowAppConstants.FILE_RESOURCE_TYPE_MENU_QUICK_ICON, entity.getEntityId(), quickIconFile);
			entity.setQuickIconImageFile(savedQuickIconFile);
		} else {
			entity.setQuickIconImageFile(foundMenu.getQuickIconImageFile());
		}
		
		Menu parent = validateAndGetParentEntity(entity);
		foundMenu.setParent(parent);
		foundMenu.setName(entity.getName());
		foundMenu.setOrderNumber(entity.getOrderNumber());
		updatePathRecursive(foundMenu);
		
		return entityDao.update(entity);
	}
	
	@Transactional
	@Override
	public void deleteIconFiles(User loginUser, Long entityId, String removeIconType) {
		Menu foundMenu = entityDao.findOneByEntityId(entityId);
		if (foundMenu == null)
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		switch (removeIconType) {
			case FlowAppConstants.MENU_REMOVE_ICON_TYPE_ALL:
				if (foundMenu.getIconImageFile() != null) {
					fileMetaDataService.deleteByToken(foundMenu.getIconImageFile().getToken());
					foundMenu.setIconImageFile(null);
				}
				if (foundMenu.getQuickIconImageFile() != null) {
					fileMetaDataService.deleteByToken(foundMenu.getQuickIconImageFile().getToken());
					foundMenu.setQuickIconImageFile(null);
				}
				break;
			case FlowAppConstants.MENU_REMOVE_ICON_TYPE_BASE_ICON:
				if (foundMenu.getIconImageFile() != null) {
					fileMetaDataService.deleteByToken(foundMenu.getIconImageFile().getToken());
					foundMenu.setIconImageFile(null);
				}
				break;
			case FlowAppConstants.MENU_REMOVE_ICON_TYPE_QUICK_ICON:
				if (foundMenu.getQuickIconImageFile() != null) {
					fileMetaDataService.deleteByToken(foundMenu.getQuickIconImageFile().getToken());
					foundMenu.setQuickIconImageFile(null);
				}
				break;
	
			default:
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		}
		entityDao.update(loginUser, foundMenu);
	}
	
	@Transactional
	@Override
	public void delete(User loginUser, Long entityId) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
	}

	@Transactional
	@Override
	public void delete(User loginUser, List<Long> entityIds) {
		throw new FlowException(FlowErrorCode.NOT_SUPPORTED_API);
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
	
	private Menu validateAndGetParentEntity(Menu entity) {
		Menu parent = null;
		if (entity.getParent() != null && entity.getParent().getEntityId() != null && entity.getParent().getEntityId() != 0) {
			parent = entityDao.findOneByEntityId(entity.getParent().getEntityId());
			if (parent == null) {
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
			}
			
			if (entity.getEntityId() == entity.getParent().getEntityId()) {
				throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
			}
		}
		
		return parent;
	}
	
	private void updatePathRecursive(Menu baseEntity) {
		baseEntity.updatePath();
		
		List<Menu> children = baseEntity.getChildren();
		if (children != null) {
			for (Menu child : children) {
				updatePathRecursive(child);
			}
		}
	}
}
