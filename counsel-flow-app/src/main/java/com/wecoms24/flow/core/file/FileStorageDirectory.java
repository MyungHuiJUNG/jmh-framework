package com.wecoms24.flow.core.file;

public interface FileStorageDirectory {
	FilePath makePath();
	FilePath makePath(String fileName);
}
