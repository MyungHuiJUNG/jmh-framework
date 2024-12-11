package com.wecoms24.flow.settings.code;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.converter.BaseBooleanToYNStringIgnoreCaseConverter;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.core.template.entity.BaseTreeEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "CODE_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "CODE_EID"))
public class Code extends BaseAuditingUserIdSequenceAbstractEntity<Long> implements BaseTreeEntity<Code, Long> {
	
	@Merge
	@Column(name = "CODE_TYPE", length = 64, nullable = true)
	@Enumerated(EnumType.STRING)
	private CodeType codeType;

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
	
	@SearchLike
	@Merge
	@Column(name = "REMARK_TEXT", length = 1024, nullable = true)
	private String remarkText;
	
	@Merge
    @Column(name = "ORDER_NUM", nullable = false)
    private Integer orderNumber;
	
	@Column(name = "USABLE", length = 1, nullable = false)
	@ColumnDefault("'Y'")
	@Merge
	@Convert(converter = BaseBooleanToYNStringIgnoreCaseConverter.class)
	private Boolean usable;
    
	@Merge(ignoreNull = false)
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
    @JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_EID", nullable = true, insertable = true, updatable = true, foreignKey = @ForeignKey(name = "none"))
    private Code parent;

	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.PagingContentsView.class })
    @JsonManagedReference
	@Fetch(FetchMode.SUBSELECT)
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinColumn(name = "PARENT_EID", foreignKey = @ForeignKey(name = "none"))
    @SQLRestriction("entity_status <> 'DELETE'")
    private Set<Code> children = new LinkedHashSet<>();
    
	@Override
    public Long getParentEntityId() {
        return parent != null ? parent.getEntityId() : null;
    }
	
    @Override
    public List<Code> getChildren() {
		if (children != null) {
			return new ArrayList<>(children);
		}
		return null;
	}
	
    @Override
	public void setChildren(List<Code> children) {
		if (children != null) {
			this.children = new LinkedHashSet<>(children);
		}
	}

    @Override
	public void addChild(Code child) {
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
	public void addChild(List<Code> children) {
		if (children != null) {
			for (Code child : children) {
				addChild(child);
			}
		}
	}

    @Override
	public boolean hasChild() {
		return children != null && children.size() > 0;
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
