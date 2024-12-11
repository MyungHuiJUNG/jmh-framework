package com.wecoms24.flow.counsel.task;

import java.util.Date;

import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.user.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "TASK_REQ_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "TASK_REQ_EID"))
public class TaskRequest extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

	@Column(name = "REQ_TYPE", length = 64, nullable = false)
	@Enumerated(EnumType.STRING)
	private RequestType requestType;
	
	@Merge
	@Column(name = "STATE_TYPE", length = 64, nullable = false)
	@Enumerated(EnumType.STRING)
	private RequestStateType stateType;
	
	@ManyToOne
    @JoinColumn(name = "REQ_USER_EID", nullable = false)
    private User requestor;

	@Column(name = "REQ_DATE")
    private Date requestDate;
	
	@Merge
	@Column(name = "RES_DATE")
    private Date responseDate;
	
	@Column(name = "DESCRIPTION")
	private String description;
}
