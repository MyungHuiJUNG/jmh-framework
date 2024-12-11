package com.wecoms24.flow.board.reply;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.board.Board;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.LongVarcharJdbcType;

@Entity
@Getter
@Setter
@Table(name = "REPLY_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "REPLY_EID"))
public class Reply extends BaseAuditingUserIdSequenceAbstractEntity<Long> {
//	@Column(name = "BOARD_EID")
//	private Long boardEntityId;


	@JsonIgnore
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="BOARD_EID", referencedColumnName = "BOARD_EID")
	private Board board;

	@Merge
	@Lob
	@JdbcType(LongVarcharJdbcType.class)
	@Column(name = "CONTENTS", nullable = false)
	private String contents;

	@JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
	@Formula("(SELECT u.USER_ID FROM USER_TM u WHERE u.USER_EID = CREATE_BY)")
	private String createdByUserId;

	@JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
	@Formula("(SELECT u.USER_NAME FROM USER_TM u WHERE u.USER_EID = CREATE_BY)")
	private String createdByUserName;

	@JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
	@Formula("(SELECT u.USER_ID FROM USER_TM u WHERE u.USER_EID = MODIFIED_BY)")
	private String lastModifiedByUserId;

	@JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
	@Formula("(SELECT u.USER_NAME FROM USER_TM u WHERE u.USER_EID = MODIFIED_BY)")
	private String lastModifiedByUserName;
}
