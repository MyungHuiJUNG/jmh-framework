package com.wecoms24.flow.counsel.type;

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
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "COUNSEL_TYPE_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "COUNSEL_TYPE_EID"))
public class CounselType extends BaseAuditingUserIdSequenceAbstractEntity<Long> implements BaseTreeEntity<CounselType, Long> {

	@Merge
	@Pattern(regexp = FlowAppConstants.REG_EXP_ALPHABET_NUMBER, message = FlowAppConstants.REG_EXP_ALPHABET_NUMBER_ERROR_KEY)
    @Column(name = "CODE", nullable = false, unique = true)
    private String code;
	
	@Merge
    @Column(name = "PATH", nullable = false, unique = true)
    private String path;

	@SearchLike
	@Merge
	@Column(name = "NAME", length = 1024, nullable = false)
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
    private CounselType parent;

	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.PagingContentsView.class, FlowDataJsonView.SingleEntityView.class })
    @JsonManagedReference
	@Fetch(FetchMode.SUBSELECT)
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinColumn(name = "PARENT_EID", foreignKey = @ForeignKey(name = "none"))
    @SQLRestriction("entity_status <> 'DELETE'")
    private Set<CounselType> children = new LinkedHashSet<>();
    
	@Override
    public Long getParentEntityId() {
        return parent != null ? parent.getEntityId() : null;
    }
	
	@Override
    public List<CounselType> getChildren() {
		if (children != null) {
			return new ArrayList<>(children);
		}
		return null;
	}
	
	@Override
	public void setChildren(List<CounselType> children) {
		if (children != null) {
			this.children = new LinkedHashSet<>(children);
		}
	}

	@Override
	public void addChild(CounselType child) {
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
	public void addChild(List<CounselType> children) {
		if (children != null) {
			for (CounselType child : children) {
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
