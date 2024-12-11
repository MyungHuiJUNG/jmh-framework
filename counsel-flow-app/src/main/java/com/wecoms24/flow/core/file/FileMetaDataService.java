package com.wecoms24.flow.core.file;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

public interface FileMetaDataService extends BaseUserCrudEntityService<User, FileMetaData, String, FileMetaDataDao, FileMetaDataSearchParameter> {
	List<FileMetaData> find(String resourceType, Long resourceKey);
	List<FileMetaData> find(String resourceType, String resourceKey);
	FileMetaData findByToken(String token);
	FileMetaData save(User loginUser, String resourceType, long resourceKey, MultipartFile file);
	List<FileMetaData> save(User loginUser, String resourceType, long resourceKey, MultipartFile[] files);
	FileMetaData save(User loginUser, String resourceType, String resourceKey, MultipartFile file);
	List<FileMetaData> save(User loginUser, String resourceType, String resourceKey, MultipartFile[] files);
	void deleteByToken(String token);
	void deleteByTokens(List<String> tokens);
	void setDownloadUrl(List<FileMetaData> fileMetaDatas);
	void setDownloadUrl(FileMetaData fileMetaData);
}
