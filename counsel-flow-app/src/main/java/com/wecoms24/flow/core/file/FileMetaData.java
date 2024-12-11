package com.wecoms24.flow.core.file;

import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdAbstractEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "FILE_METADATA", indexes = @Index(name = "IDX_RESOURCE_KEY", columnList = "RESOURCE_TYPE, RESOURCE_KEY"))
@AttributeOverride(name = "entityId", column = @Column(name = "FILE_TOKEN"))
public class FileMetaData extends BaseAuditingUserIdAbstractEntity<String> {

    @Column(name = "FILE_NAME", nullable = false)
    private String fileName;
    
    @Column(name = "FILE_PATH", nullable = false)
    private String filePath;

    @Column(name = "FILE_PARENT_PATH")
    private String fileParentPath;
    
    @Column(name = "FILE_EXTENSTION", nullable = false)
    private String fileExtension;

    @Column(name = "FILE_SIZE", nullable = false)
    private Long fileSize;

    @Column(name = "RESOURCE_TYPE", nullable = false)
    private String resourceType;

    @Column(name = "RESOURCE_KEY", nullable = false)
    private String resourceKey;

    @Transient
	private String downloadUrl;
    
    public String getToken() {
		return getEntityId();
	}

	public void setToken(String token) {
		this.setEntityId(token);
	}
}
