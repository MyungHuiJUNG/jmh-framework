package com.wecoms24.flow.chemp.sms;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties({ "entityStatus", "createdBy", "lastModifiedBy" })
public class ChempSms extends BaseAuditingUserIdSequenceAbstractEntity<Integer> {
	private Integer smsType;
	private String senderNumber;
	private String receiverType;
	private String receiverNumber;
	private String subject;
	private String contents;
	private String transmitType;
	private Date reservationDate;
	private Boolean usable;
	private String registUserId;
	private String modifyUserId;
}
