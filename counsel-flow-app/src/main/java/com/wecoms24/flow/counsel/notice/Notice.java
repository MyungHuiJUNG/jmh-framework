package com.wecoms24.flow.counsel.notice;

import java.util.List;

import org.hibernate.annotations.Formula;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.LongVarcharJdbcType;

import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.core.file.FileMetaData;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "NOTICE")
@AttributeOverride(name = "entityId", column = @Column(name = "NOTICE_EID"))
public class Notice extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

    @SearchLike
    @Merge
    @Column(name = "TITLE", nullable = false)
    private String title;

    @Merge
    @Lob
    @JdbcType(LongVarcharJdbcType.class)
    @Column(name = "CONTENT", nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @SearchLike
    @Merge
    @Lob
    @JdbcType(LongVarcharJdbcType.class)
    @Column(name = "RAW_CONTENT", nullable = false, columnDefinition = "LONGTEXT")
    private String rawContent;

    @Formula("(SELECT COUNT(*)"
        + " FROM FILE_METADATA f"
        + " WHERE f.RESOURCE_TYPE = 'notice'"
        + " AND f.RESOURCE_KEY = NOTICE_EID)"
    )
    private Integer fileCount;

    @Transient
    private List<FileMetaData> files;

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
