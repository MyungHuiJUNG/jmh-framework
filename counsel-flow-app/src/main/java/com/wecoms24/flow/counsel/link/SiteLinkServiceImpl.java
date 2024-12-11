package com.wecoms24.flow.counsel.link;

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
public class SiteLinkServiceImpl extends AbstractBaseUserCrudEntityService<User, SiteLink, Long, SiteLinkDao, SiteLinkSearchParameter> implements SiteLinkService {

	@Autowired
	private FileMetaDataService fileMetaDataService;
	
	@Override
	public SiteLink findOne(User loginUser, SiteLink entity) {
		SiteLink foundSiteLink = super.findOne(loginUser, entity);
		if (foundSiteLink != null) {
			setDownloadUrls(foundSiteLink);
		}
		return foundSiteLink;
	}

	@Override
	public List<SiteLink> find(User loginUser, SiteLinkSearchParameter searchParameter) {
		List<SiteLink> foundSiteLinks = super.find(loginUser, searchParameter);
		for (SiteLink foundSiteLink : foundSiteLinks) {
			setDownloadUrls(foundSiteLink);
		}
		return foundSiteLinks;
	}

	@Override
	public Slice<SiteLink> findSlice(User loginUser, SiteLinkSearchParameter searchParameter) {
		Slice<SiteLink> foundPaging = super.findSlice(loginUser, searchParameter);
		List<SiteLink> foundSiteLinks = foundPaging.getContent();
		for (SiteLink foundSiteLink : foundSiteLinks) {
			setDownloadUrls(foundSiteLink);
		}
		return foundPaging;
	}

	@Transactional
	@Override
	public SiteLink regist(User loginUser, SiteLink entity, MultipartFile iconFile) {
		SiteLink registedEntity = super.regist(loginUser, entity);
		if (iconFile != null) {
			FileMetaData savedIconFile = fileMetaDataService.save(loginUser, FlowAppConstants.FILE_RESOURCE_TYPE_SITE_LINK_ICON, registedEntity.getEntityId(), iconFile);
			registedEntity.setIconImageFile(savedIconFile);
			registedEntity = entityDao.update(loginUser, entity);
		}
		return registedEntity;
	}

	@Transactional
	@Override
	public SiteLink update(User loginUser, SiteLink entity, MultipartFile iconFile) {
		SiteLink foundSiteLink = entityDao.findOneByEntityId(entity.getEntityId());
		if (foundSiteLink == null)
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		if (iconFile != null) {
			if (foundSiteLink.getIconImageFile() != null) {
				fileMetaDataService.deleteByToken(foundSiteLink.getIconImageFile().getToken());
			}
			
			FileMetaData savedIconFile = fileMetaDataService.save(loginUser, FlowAppConstants.FILE_RESOURCE_TYPE_SITE_LINK_ICON, entity.getEntityId(), iconFile);
			entity.setIconImageFile(savedIconFile);
		} else {
			entity.setIconImageFile(foundSiteLink.getIconImageFile());
		}
		
		return entityDao.update(loginUser, entity);
	}
	
	@Transactional
	@Override
	public void delete(User loginUser, Long entityId) {
		SiteLink foundSiteLink = entityDao.findOneByEntityId(entityId);
		if (foundSiteLink == null)
			return;
		
		if (foundSiteLink.getIconImageFile() != null) {
			fileMetaDataService.deleteByToken(foundSiteLink.getIconImageFile().getToken());
		}
		super.delete(loginUser, entityId);
	}

	@Transactional
	@Override
	public void delete(User loginUser, List<Long> entityIds) {
		for (Long entityId : entityIds) {
			delete(loginUser, entityId);
		}
	}

	@Transactional
	@Override
	public void deleteIconFile(User loginUser, Long entityId) {
		SiteLink foundSiteLink = entityDao.findOneByEntityId(entityId);
		if (foundSiteLink == null)
			throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
		
		if (foundSiteLink.getIconImageFile() != null) {
			fileMetaDataService.deleteByToken(foundSiteLink.getIconImageFile().getToken());
			foundSiteLink.setIconImageFile(null);
			
			entityDao.update(loginUser, foundSiteLink);
		}
	}
	
	private void setDownloadUrls(SiteLink siteLink) {
        if (siteLink.getIconImageFile() != null) {
            fileMetaDataService.setDownloadUrl(siteLink.getIconImageFile());
        }
    }
}
