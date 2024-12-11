package com.wecoms24.flow.core.file;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

import lombok.RequiredArgsConstructor;

@Service
@Primary
@RequiredArgsConstructor
@EnableConfigurationProperties(FileStorageProperties.class)
public class FileMetaDataServiceImpl extends AbstractBaseUserCrudEntityService<User, FileMetaData, String, FileMetaDataDao, FileMetaDataSearchParameter> implements FileMetaDataService {

	private final FileStorageProperties fileStorageProperties;

	private final FileOperator fileOperator;

	@Override
	public FileMetaData findOne(User loginUser, FileMetaData entity) {
		return findByToken(entity.getToken());
	}
	
	@Override
	public List<FileMetaData> find(String resourceType, Long resourceKey) {
		return find(resourceType, String.valueOf(resourceKey));
	}

	@Override
	public List<FileMetaData> find(String resourceType, String resourceKey) {
		List<FileMetaData> fileMetaDatas = null;
		validateEmptyString(resourceType, FlowErrorCode.NULL_RESOURCE_TYPE);
		validateEmptyString(resourceKey, FlowErrorCode.NULL_RESOURCE_KEY);
		try {
			fileMetaDatas = entityDao.findAllByResourceTypeAndResourceKey(resourceType, resourceKey);
			if (fileMetaDatas == null || fileMetaDatas.isEmpty()) {
				throw new FlowException(FlowErrorCode.NOT_EXIST_FILE_META_DATAS);
			}
			setDownloadUrl(fileMetaDatas);
		} catch (Exception e) {
			throw new FlowException(FlowErrorCode.FAIL_FIND_FILES);
		}
		return fileMetaDatas;
	}

	@Override
	public FileMetaData findByToken(String token) {
		FileMetaData fileMetaData = null;
		validateEmptyString(token, FlowErrorCode.NULL_TOKEN);
		try {
			fileMetaData = entityDao.findById(token).orElse(null);
			if (fileMetaData == null) {
				throw new FlowException(FlowErrorCode.NOT_EXIST_FILE_META_DATA);
			}
			setDownloadUrl(fileMetaData);
		} catch (Exception e) {
			throw new FlowException(FlowErrorCode.FAIL_FIND_FILE);
		}
		return fileMetaData;
	}

	@Override
	public FileMetaData save(User loginUser, String resourceType, long resourceKey, MultipartFile file) {
		return save(file, resourceType, resourceKey);
	}
	
	@Transactional
	@Override
	public List<FileMetaData> save(User loginUser, String resourceType, long resourceKey, MultipartFile[] files) {
		return save(loginUser, resourceType, String.valueOf(resourceKey), files);
	}
	
	@Override
	public FileMetaData save(User loginUser, String resourceType, String resourceKey, MultipartFile file) {
		return save(file, resourceType, resourceKey);
	}

	@Transactional
	@Override
	public List<FileMetaData> save(User loginUser, String resourceType, String resourceKey, MultipartFile[] files) {
		List<FileMetaData> fileMetaDatas = new ArrayList<FileMetaData>();
		for (MultipartFile file : files) {
			FileMetaData fileMetaData = save(file, resourceType, resourceKey);
			fileMetaDatas.add(fileMetaData);
		}
		return fileMetaDatas;
	}

	@Transactional
	@Override
	public void delete(User loginUser, String entityId) {
		deleteByToken(entityId);
	}

	@Transactional
	@Override
	public void delete(User loginUser, List<String> entityIds) {
		deleteByTokens(entityIds);
	}
	
	@Transactional
	@Override
	public void deleteByToken(String token) {
		FileMetaData fileMetaData = entityDao.findOneByEntityId(token);
		if (fileMetaData == null) {
			return;
		}

		try {
			entityDao.remove(fileMetaData);
			fileOperator.delete(fileMetaData.getFilePath());
		} catch (Exception e) {
			throw new FlowException(FlowErrorCode.FAIL_DELETE_FILE);
		}		
	}

	@Transactional
	@Override
	public void deleteByTokens(List<String> tokens) {
		for (String token : tokens) {
			deleteByToken(token);
		}		
	}
	
	@Override
	public void setDownloadUrl(List<FileMetaData> fileMetaDatas) {
		if (fileMetaDatas != null) {
			for (FileMetaData fileMetaData : fileMetaDatas) {
				setDownloadUrl(fileMetaData);
			}
		}
	}

	@Override
	public void setDownloadUrl(FileMetaData fileMetaData) {
		if (fileMetaData != null) {
			String downloadUrl = fileStorageProperties.getHost() + fileStorageProperties.getUrlRootPath() + "/" + fileMetaData.getToken() + "/download";
			fileMetaData.setDownloadUrl(downloadUrl);
		}
	}

	@Transactional
	public FileMetaData save(MultipartFile file, String resourceType, long resourceKey) {
		return save(file, resourceType, String.valueOf(resourceKey));
	}

	@Transactional
	public FileMetaData save(MultipartFile file, String resourceType, String resourceKey) {
		try {
			return save(file.getInputStream(), file.getOriginalFilename(), file.getSize(), resourceType, resourceKey);
		} catch (IOException e) {
			throw new FlowException(FlowErrorCode.FAIL_SAVE_FILE);
		}
	}

	public FileMetaData save(InputStream inputStream, String originFileName, long fileSize, String resourceType, String resourceKey) {
		validateEmptyString(originFileName, FlowErrorCode.NULL_FILE_NAME);
		validateEmptyString(resourceType, FlowErrorCode.NULL_RESOURCE_TYPE);
		validateEmptyString(resourceKey, FlowErrorCode.NULL_RESOURCE_KEY);

		FileMetadataBuilder fileMetadataBuilder = FileMetadataBuilder.create(fileStorageProperties.getRootPath());
		fileMetadataBuilder.withOriginalFileName(originFileName);
		fileMetadataBuilder.withFileSize(fileSize);
		fileMetadataBuilder.withResourceType(resourceType);
		fileMetadataBuilder.withResourceKey(resourceKey);
		FileMetaData fileMetadata = fileMetadataBuilder.build();

		return save(inputStream, fileMetadata);
	}

	public FileMetaData save(InputStream inputStream, FileMetaData fileMetadata) {
		try {
			FilePath targetPath = FilePath.get(fileMetadata.getFilePath());
			fileOperator.copy(inputStream, targetPath.toString());
			FileMetaData savedFileMetadata = entityDao.save(fileMetadata);

			setDownloadUrl(savedFileMetadata);

			return savedFileMetadata;
		} catch (Exception e) {
			e.printStackTrace();
			throw new FlowException(FlowErrorCode.FAIL_SAVE_FILE);
		}
	}

	private void validateEmptyString(String string, FlowErrorCode errorCode) {
		if (string == null || string.isEmpty()) {
			throw new FlowException(errorCode);
		}
	}
}
