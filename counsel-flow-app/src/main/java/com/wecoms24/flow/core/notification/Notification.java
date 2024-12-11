package com.wecoms24.flow.core.notification;

import java.util.Date;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.LongVarcharJdbcType;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.converter.BaseBooleanToYNStringIgnoreCaseConverter;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.user.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "NOTIFICATION_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "NOTIFICATION_EID"))
public class Notification extends BaseAuditingUserIdSequenceAbstractEntity<Long> {
	
	@Column(name = "TYPE_CD")
	private String typeCode;
	
	@Column(name = "SUB_TYPE_CD")
	private String subTypeCode;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SENDER_EID")
    private User sender;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RECEIVER_EID")
	private User receiver;
	
	@Column(name = "SEND_TIME")
    private Date sendTime;

	@Merge
    @Column(name = "CLASS_NAME")
    private String className;

    @SearchLike
    @Column(name = "TITLE")
    private String title;
    
    @SearchLike
    @Column(name = "MESSAGE", length = 5000)
    private String message;
    
    @Merge
    @Lob
    @JdbcType(LongVarcharJdbcType.class)
    @Column(name = "JSON_STR_CONTENT")
    private String jsonStringContent;
    
    @Column(name = "RESERVATION_DATE")
    private Date reservationDate;
    
    @Merge
	@Column(name = "IS_READ", length = 1, nullable = true)
    @ColumnDefault("'N'")
	@Convert(converter = BaseBooleanToYNStringIgnoreCaseConverter.class)
	private Boolean isRead;
    
    @Merge
    @Column(name = "READ_DATE")
    private Date readDate;
}
