package com.wecoms24.flow.core.file;

import java.util.Calendar;

public class FileStorageTimestampDirectory implements FileStorageDirectory {
	private FilePath rootPath;
	
	public FileStorageTimestampDirectory() {
		rootPath = FilePath.getSystemUserDir();
	}
	
	public FileStorageTimestampDirectory(String root) {
		rootPath = new FilePath(root);
	}
	
	@Override
	public FilePath makePath() {
		return makeyByTodayDatetime();
	}
	
	@Override
	public FilePath makePath(String fileName) {
		return makeyByTodayDatetime(fileName);
	}
	
	public FilePath makeyByTodayDatetime() {
		return makeyByTodayDatetime(null);
	}
	
	public FilePath makeyByTodayDatetime(String fileName) {
		Calendar calendar = Calendar.getInstance();
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH) + 1;
		int day = calendar.get(Calendar.DAY_OF_MONTH);
		return new FilePath(rootPath.toString(), String.format("%d", year), String.format("%02d", month), String.format("%02d", day), fileName);
	}
}
