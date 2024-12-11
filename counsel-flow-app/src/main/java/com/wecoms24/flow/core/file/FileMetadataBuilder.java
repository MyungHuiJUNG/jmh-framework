package com.wecoms24.flow.core.file;

import java.util.UUID;

public class FileMetadataBuilder {
	private FileStorageDirectory fileStorageDirectory;
	private String originalFileName;
	private String resourceType;
    private String resourceKey;
    private Long fileSize;
    
	public static FileMetadataBuilder create(String rootPath) {
		return new FileMetadataBuilder(rootPath);
	}
	
	private FileMetadataBuilder(String rootPath) {
		this(new FileStorageTimestampDirectory(rootPath));
	}
	
	private FileMetadataBuilder(FileStorageDirectory fileStorageDirectory) {
		this.fileStorageDirectory = fileStorageDirectory;
	}
	
	public FileMetadataBuilder withOriginalFileName(String originalFileName) {
		this.originalFileName = originalFileName;
		return this;
	}
	
	public FileMetadataBuilder withResourceType(String resourceType) {
		this.resourceType = resourceType;
		return this;
	}
	
	public FileMetadataBuilder withResourceKey(String resourceKey) {
		this.resourceKey = resourceKey;
		return this;
	}
	
	public FileMetadataBuilder withFileSize(Long fileSize) {
		this.fileSize = fileSize;
		return this;
	}
	
	public FileMetaData build() {
		String fileToken = UUID.randomUUID().toString().replaceAll("-", "").toUpperCase();
		FilePath filePath = fileStorageDirectory.makePath(fileToken + "." + FilePath.get(originalFileName).getFileExtension());
		
		FileMetaData fileMetadata = new FileMetaData();
		fileMetadata.setToken(fileToken);
		fileMetadata.setFileName(originalFileName);
		fileMetadata.setFilePath(filePath.getPath());
		fileMetadata.setFileParentPath(filePath.getParentPath());
		fileMetadata.setFileExtension(filePath.getFileExtension());
		fileMetadata.setFileSize(fileSize);
		fileMetadata.setResourceType(resourceType);
		fileMetadata.setResourceKey(resourceKey);
		return fileMetadata;
	}
}
