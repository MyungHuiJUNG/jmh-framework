package com.wecoms24.flow.core.template.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseAuditingTimeEntity {
	
	@CreatedDate
    @Column(name = "CREATE_DATE", updatable = false)
    private Date createdDate;
	
    @LastModifiedDate
    @Column(name = "MODIFIED_DATE")
    private Date lastModifiedDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ENTITY_STATUS")
    private EntityStatus entityStatus = EntityStatus.UNKNOWN;
    
    @PrePersist
    protected void onCreate() {
        this.createdDate = new Date();
        if (this.entityStatus == null || this.entityStatus == EntityStatus.UNKNOWN)
        	this.entityStatus = EntityStatus.NEW;
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastModifiedDate = new Date();
        if (this.entityStatus == null || this.entityStatus == EntityStatus.UNKNOWN)
        	this.entityStatus = EntityStatus.UPDATE;
    }
}
