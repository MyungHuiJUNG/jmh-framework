package com.wecoms24.flow.core.template.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseAuditingUserIdSequenceAbstractEntity<ENTITY_ID> extends BaseAuditingTimeEntity implements BaseEntity<ENTITY_ID> {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ENTITY_ID")
	private ENTITY_ID entityId;
	
	@CreatedBy
    @Column(name = "CREATE_BY", updatable = false)
    private Long createdBy;
	
    @LastModifiedBy
    @Column(name = "MODIFIED_BY")
    private Long lastModifiedBy;
}
