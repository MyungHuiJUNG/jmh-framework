package com.wecoms24.flow.counsel.ticket.history;

import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.LongVarcharJdbcType;

@Entity
@Getter
@Setter
@Table(name = "TICKET_HISTORY_TM", indexes = @Index(name = "IDX_TICKET_EID", columnList = "TICKET_EID"))
@AttributeOverride(name = "entityId", column = @Column(name = "TICKET_HISTORY_EID"))
public class TicketHistory extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

	@Merge
	@Column(name = "TICKET_EID")
	private Long ticketEntityId;

	@Column(name = "TYPE_CD")
	private String typeCode;

	@Column(name = "PREV_DATA")
	private String previousData;

	@Column(name = "NEW_DATA")
	private String newData;

	@Lob
	@JdbcType(LongVarcharJdbcType.class)
	@Column(name = "DETAILS")
	private String details;

	@Column(name = "TRANSFER_YN", length = 1, columnDefinition = "varchar(1) default 'N'")
	private String transferYn;
}
