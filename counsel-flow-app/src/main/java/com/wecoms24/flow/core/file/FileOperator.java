package com.wecoms24.flow.core.file;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.CopyOption;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;

import org.springframework.stereotype.Component;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;

@Component
public class FileOperator {
	
	public Path write(String filePath, String contents) {
		return write(getPath(filePath), contents);
	}

	public Path write(Path filePath, String contents) {
		return doWrite(filePath, contents.getBytes());
	}

	public byte[] read(String filePath) {
		return read(getPath(filePath));
	}

	public byte[] read(Path filePath) {
		return doRead(filePath);
	}

	public Path copy(Path sourceFilePath, Path targetFilePath) {
		return doCopy(sourceFilePath, targetFilePath);
	}

	public Path copy(String sourceFilePath, String targetFilePath) {
		return doCopy(sourceFilePath, targetFilePath);
	}

	public long copy(InputStream sourceInputStream, String targetFilePath) {
		return doCopy(sourceInputStream, targetFilePath, StandardCopyOption.REPLACE_EXISTING);
	}

	public boolean delete(String filePath) {
		try {
			return Files.deleteIfExists(Paths.get(filePath));
		} catch (Exception e) {
			throw new FlowException(FlowErrorCode.FAIL_FILE_DELETE);
		}
	}

	public void delete(String filePath, boolean isRecursive) {
		if (!isDirectory(filePath)) {
			delete(filePath);
			return;
		}

		try {
			Files.walkFileTree(getPath(filePath), new SimpleFileVisitor<Path>() {
				@Override
				public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
					Files.delete(file);
					return FileVisitResult.CONTINUE;
				}
				
				@Override
				public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
					Files.delete(dir);
					return FileVisitResult.CONTINUE;
				}
			});
		} catch (IOException e) {
			throw new FlowException(FlowErrorCode.FAIL_FILE_DELETE);
		}
	}

	public boolean isDirectory(String path) {
		return isDirectory(getPath(path));
	}

	public boolean isDirectory(Path filePath) {
		return Files.isDirectory(filePath);
	}
	
	public boolean isExist(String path) {
		return Files.exists(Paths.get(path));
	}
	
	public Path createFolder(String path) {
		try {
			return Files.createDirectory(Paths.get(path));
		} catch (IOException e) {
			throw new FlowException(FlowErrorCode.FAIL_CREATE_DIRECTORY);
		}
	}
	
	public Path createFolders(String path, String...more) {
		try {
			return Files.createDirectories(Paths.get(path, more));
		} catch (IOException e) {
			throw new FlowException(FlowErrorCode.FAIL_CREATE_DIRECTORY);
		}
	}

	protected Path doCopy(String sourcePathString, String targetPathString) {
		return doCopy(Paths.get(sourcePathString), Paths.get(targetPathString));
	}

	protected long doCopy(InputStream sourceInputStream, String targetPathString, CopyOption... options) {
		try {
			Path targetPath = Paths.get(targetPathString);
			if (!Files.exists(targetPath.getParent(), LinkOption.NOFOLLOW_LINKS)) {
				Files.createDirectories(targetPath.getParent());
			}
			return Files.copy(sourceInputStream, targetPath, options);
		} catch (IOException e) {
			throw new FlowException(FlowErrorCode.FAIL_OPERATION_COPY);
		}
	}

	protected Path doCopy(Path sourceFilePath, Path targetFilePath) {
		try {
			return Files.copy(sourceFilePath, targetFilePath, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new FlowException(FlowErrorCode.FAIL_OPERATION_COPY);
		}
	}

	protected Path doWrite(Path filePath, byte[] bytes) {
		try {
			return Files.write(filePath, bytes);
		} catch (IOException e) {
			throw new FlowException(FlowErrorCode.FAIL_OPERATION_COPY);
		}
	}

	public byte[] doRead(Path filePath) {
		try {
			return Files.readAllBytes(filePath);
		} catch (IOException e) {
			throw new FlowException(FlowErrorCode.FAIL_OPERATION_COPY);
		}
	}

	protected Path getPath(String pathString) {
		return Paths.get(pathString);
	}
}
