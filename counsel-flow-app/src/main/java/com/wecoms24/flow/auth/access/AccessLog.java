package com.wecoms24.flow.auth.access;

import java.util.Date;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecoms24.flow.core.template.converter.BaseBooleanToYNStringIgnoreCaseConverter;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.user.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "ACCESS_LOG_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "ACCESS_LOG_EID"))
@JsonIgnoreProperties({ "createdBy", "lastModifiedBy", "createdDate", "lastModifiedDate" })
public class AccessLog extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

	@Column(name = "ACCESS_TYPE", length = 64, nullable = false)
	@Enumerated(EnumType.STRING)
	private AccessType accessType;
	
	@Column(name = "IS_AUTO_ACCESS", length = 1, nullable = true)
    @ColumnDefault("'N'")
	@Convert(converter = BaseBooleanToYNStringIgnoreCaseConverter.class)
	private Boolean isAutoAccess;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EID", nullable = false)
	private User user;
	
	@Column(name = "ACCESS_DATE")
	private Date accessDate;
	
	@Column(name = "CLIENT_IP_ADDR")
	private String clientIpAddress;
}
