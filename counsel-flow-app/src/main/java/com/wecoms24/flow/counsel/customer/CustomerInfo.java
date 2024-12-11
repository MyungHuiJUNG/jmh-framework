package com.wecoms24.flow.counsel.customer;

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "CUSTOMER_INFO_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "CUSTOMER_INFO_EID"))
public class CustomerInfo extends BaseAuditingUserIdSequenceAbstractEntity<Long> {
	
	@Merge
	@Column(name = "CUSTOMER_TYPE_CD", length = 50, nullable = false)
	private String customerTypeCode;
	
	@SearchLike
	@Merge
	@Column(name = "NAME", length = 500, nullable = false)
	private String name;
	
	@Merge
	@Column(name = "REP_NUMBER", length = 50, nullable = false)
	private String representativeNumber;
	
	@Merge(ignoreNull = false)
	@Column(name = "SECOND_NUMBER", length = 50)
	private String secondaryNumber;
	
	@Merge(ignoreNull = false)
	@Column(name = "THIRD_NUMBER", length = 50)
	private String thirdNumber;
	
	@SearchLike
	@Merge
	@Column(name = "MANAGER_NAME", length = 500)
	private String managerName;
	
	@Merge(ignoreNull = false)
	@Column(name = "NOTE", length = 500)
	private String note;
	
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_ID FROM USER_TM u WHERE u.USER_EID = CREATE_BY)")
    private String createdByUserId;

    @JsonView({ FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_NAME FROM USER_TM u WHERE u.USER_EID = CREATE_BY)")
    private String createdByUserName;

    @JsonView({ FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_ID FROM USER_TM u WHERE u.USER_EID = MODIFIED_BY)")
    private String lastModifiedByUserId;

    @JsonView({ FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_NAME FROM USER_TM u WHERE u.USER_EID = MODIFIED_BY)")
    private String lastModifiedByUserName;
}
