package com.wecoms24.flow.board;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.board.category.BoardCategory;
import com.wecoms24.flow.board.reply.Reply;
import com.wecoms24.flow.core.file.FileMetaData;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Table;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;
import org.hibernate.type.descriptor.jdbc.LongVarcharJdbcType;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "BOARD_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "BOARD_EID"))
public class Board extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

    @SearchLike
    @Merge
    @Column(name = "TITLE", nullable = false)
    private String title;

    @SearchLike
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

    @Merge
    @ColumnDefault("0")
    @Column(name = "READ_COUNT", nullable = false)
    private Integer readCount;

    @Merge(ignoreNull = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(targetEntity = BoardCategory.class, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "CATEGORY_ID", referencedColumnName = "BOARD_CATEGORY_EID",
            insertable = false, updatable = false,
            foreignKey = @ForeignKey(name = "none"))
    private BoardCategory category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CREATE_BY", referencedColumnName = "USER_EID", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "none"))
    private User createdByUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MODIFIED_BY", referencedColumnName = "USER_EID", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "none"))
    private User modifiedByUser;

    @Merge(ignoreNull = false)
    @Column(name = "CATEGORY_ID")
    private Long categoryId;

    @Formula("(SELECT COUNT(*)"
            + " FROM FILE_METADATA f"
            + " WHERE f.RESOURCE_TYPE = '" + FlowAppConstants.FILE_RESOURCE_TYPE_BOARD + "'"
            + " AND f.RESOURCE_KEY = BOARD_EID)"
    )
    private Integer fileCount;

    @Transient
    private List<FileMetaData> files;


    @JsonIgnoreProperties("board")
    @JsonView({FlowDataJsonView.ListEntityView.class, FlowDataJsonView.PagingContentsView.class, FlowDataJsonView.SingleEntityView.class})
    @JsonManagedReference
    @Fetch(FetchMode.SUBSELECT)
    @OneToMany(mappedBy = "board", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @SQLRestriction("entity_status <> 'DELETE'")
    private Set<Reply> replies = new LinkedHashSet<>();
}
