package com.wecoms24.flow.core.notification.message;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecoms24.flow.core.notification.Notification;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.user.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
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
@Table(name = "MESSAGE_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "MESSAGE_EID"))
public class Message extends BaseAuditingUserIdSequenceAbstractEntity<Long> {
	
	@Column(name = "MESSAGE_TYPE", length = 64, nullable = false)
	@Enumerated(EnumType.STRING)
	private MessageType type;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NOTIFICATION_EID", nullable = false)
	private Notification notification;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OWNER_EID", nullable = false)
	private User owner;
}
