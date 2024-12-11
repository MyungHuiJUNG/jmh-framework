package com.wecoms24.flow.user.command.key;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.user.command.PersonalCommand;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "SHORT_CUT_KEY_TP", uniqueConstraints = {
        @UniqueConstraint(
                name=FlowAppConstants.SQL_UNIQUE_NM_SHORT_CUT_UNIQUE,
                columnNames={"COMMAND_TYPE", "CUSTOM_KEY", "PERSONAL_COMMAND_EID"}
        )})
@AttributeOverride(name = "entityId", column = @Column(name = "SHORT_CUT_KEY_EID"))
public class ShortCutKey extends BaseAuditingUserIdSequenceAbstractEntity<Long> {
	@Merge
	@Column(name = "COMMAND_TYPE", length = 64, nullable = false)
	@Enumerated(EnumType.STRING)
	private KeyType keyType;
	
	@Merge
    @Column(name = "CUSTOM_KEY", nullable = false)
	private String customKey;
	
	@Merge
    @Column(name = "ORDER_NUM")
	private Integer orderNumber;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PERSONAL_COMMAND_EID", nullable = false)
	private PersonalCommand personalCommand;
}
