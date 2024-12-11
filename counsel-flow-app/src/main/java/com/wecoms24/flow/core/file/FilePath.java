package com.wecoms24.flow.core.file;

import java.nio.file.Path;
import java.nio.file.Paths;

public class FilePath {
	public static FilePath getSystemUserDir(String... more) {
		final String SYSTEM_PROPERTY_USER_DIR = "user.dir";
		String userDir = System.getProperty(SYSTEM_PROPERTY_USER_DIR);
		return new FilePath(Paths.get(userDir, more).toString());
	}

	public static FilePath get(String fileName) {
		return new FilePath(fileName);
	}
	
	public static FilePath get(String path, String...more) {
		return new FilePath(path, more);
	}

	private Path path;

	public FilePath(Path path) {
		this.path = path;
	}

	public FilePath(String path) {
		this.path = Paths.get(path);
	}

	public FilePath(String path, String... more) {
		this.path = Paths.get(path, more);
	}

	public String getName() {
		return path.getFileName().toString();
	}

	public String getPath() {
		return path.toString();
	}

	public String getParentPath() {
		return path.getParent().toString();
	}

	public String getFileExtension() {
		String fileName = getName();
		if (fileName != null && !fileName.isEmpty()) {
			int lastIndexOf = fileName.lastIndexOf(".");
			if (lastIndexOf >= 0) {
				return fileName.substring(lastIndexOf + 1);
			}
		}
		return null;
	}

	@Override
	public String toString() {
		return path.toString();
	}

	public FilePath additionalPath(String...more) {
		return FilePath.get(getPath(), more);
	}
}
