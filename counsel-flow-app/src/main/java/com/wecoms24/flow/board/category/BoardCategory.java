package com.wecoms24.flow.board.category;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.core.template.entity.BaseTreeEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "BOARD_CATEGORY_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "BOARD_CATEGORY_EID"))
public class BoardCategory extends BaseAuditingUserIdSequenceAbstractEntity<Long> implements BaseTreeEntity<BoardCategory, Long> {

	@Merge
	@Pattern(regexp = FlowAppConstants.REG_EXP_ALPHABET_NUMBER, message = FlowAppConstants.REG_EXP_ALPHABET_NUMBER_ERROR_KEY)
    @Column(name = "CODE", nullable = false)
    private String code;
	
	@Merge
    @Column(name = "PATH", nullable = false, unique = true)
    private String path;

	@SearchLike
	@Merge
	@Column(name = "NAME", length = 1024, nullable = false, unique = true)
    private String name;
	
	@Merge
    @Column(name = "ORDER_NUM", nullable = false)
    private Integer orderNumber;

	@Merge(ignoreNull = false)
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
    @JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_EID", nullable = true, insertable = true, updatable = true, foreignKey = @ForeignKey(name = "none"))
    private BoardCategory parent;

	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.PagingContentsView.class, FlowDataJsonView.SingleEntityView.class })
    @JsonManagedReference
	@Fetch(FetchMode.SUBSELECT)
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "PARENT_EID", foreignKey = @ForeignKey(name = "none"))
    @SQLRestriction("entity_status <> 'DELETE'")
    private Set<BoardCategory> children = new LinkedHashSet<>();
	
	@Formula("(SELECT COUNT(T1.BOARD_EID) FROM board_tm T1 LEFT JOIN board_category_tm T2 ON T1.CATEGORY_ID = T2.BOARD_CATEGORY_EID AND T2.ENTITY_STATUS != 'DELETE' WHERE T1.ENTITY_STATUS != 'DELETE' AND T2.PATH LIKE CONCAT(PATH, '%'))")
    private Integer boardCountWithChildren;
	
	@Formula("(SELECT COUNT(T1.BOARD_EID) FROM board_tm T1 WHERE T1.ENTITY_STATUS != 'DELETE' AND T1.CATEGORY_ID = BOARD_CATEGORY_EID)")
    private Integer boardCount;
    
	@Override
    public Long getParentEntityId() {
        return parent != null ? parent.getEntityId() : null;
    }
	
	@Override
    public List<BoardCategory> getChildren() {
		if (children != null) {
			return new ArrayList<>(children);
		}
		return null;
	}
	
	@Override
	public void setChildren(List<BoardCategory> children) {
		if (children != null) {
			this.children = new LinkedHashSet<>(children);
		}
	}

	@Override
	public void addChild(BoardCategory child) {
		if (child != null) {
			child.setParent(this);
			child.setPath(child.createPath());
			
			if (children == null) {
				children = new LinkedHashSet<>();
			}
			children.add(child);
		}
	}

	@Override
	public void addChild(List<BoardCategory> children) {
		if (children != null) {
			for (BoardCategory child : children) {
				addChild(child);
			}
		}
	}

	@Override
	public boolean hasChild() {
		return children != null && !children.isEmpty();
	}
    
	@Override
    public String createPath() {
		return getParent() != null ? getParent().getPath() + "." + this.code : this.code;
	}
    
	@Override
    public void updatePath() {
		setPath(createPath());
	}
}
