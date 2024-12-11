package com.wecoms24.flow.core.file;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = FileStorageProperties.PREFIX)
@Getter
@Setter
public class FileStorageProperties implements InitializingBean {
	public static final String PREFIX = FlowAppConstants.FILE_PACKAGE;
	
	private String host = "http://localhost:8080";
	private String urlRootPath = "file/storage";
	private String rootPath = System.getProperty("user.dir");

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getUrlRootPath() {
		return urlRootPath;
	}

	public void setUrlRootPath(String urlRootPath) {
		this.urlRootPath = urlRootPath;
	}

	public String getRootPath() {
		return rootPath;
	}

	public void setRootPath(String rootPath) {
		this.rootPath = rootPath;
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		if (host == null || host.isEmpty()) {
			throw new FlowException(FlowErrorCode.FILE_STORAGE_HOST_NOT_EXIST);
		}
	}
}
