package com.wecoms24.flow.settings.valiable;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.converter.BaseBooleanToYNStringIgnoreCaseConverter;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdAbstractEntity;
import com.wecoms24.flow.core.template.entity.BaseTreeEntity;
import jakarta.persistence.*;
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
@Table(name = "SYSTEM_VAR_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "SYSTEM_VAR_EID"))
public class SystemVariable extends BaseAuditingUserIdAbstractEntity<String> implements BaseTreeEntity<SystemVariable, String> {
	
    @Column(name = "PATH", nullable = false, unique = true)
    private String path;
	
	@Column(name = "TYPE", length = 64, nullable = true)
	private String type;

	@Merge
	@Column(name = "VALUE", length = 1024, nullable = true)
	private String value;

	@Column(name = "EDIT_TYPE", length = 128, nullable = true)
	private String editType;
	
	@Column(name = "EDIT_ITEM", length = 1024, nullable = true)
	private String editItem;
	
	@Column(name = "EDITABLE", length = 1, nullable = true)
	@Convert(converter = BaseBooleanToYNStringIgnoreCaseConverter.class)
	private Boolean editable;

	@SearchLike
	@Merge
	@Column(name = "DISPLAY_NAME", length = 256, nullable = false)
	private String displayName;

	@Merge(ignoreNull = false)
	@Column(name = "DISCRIPTION", length = 512, nullable = true)
	private String description;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
    @JsonBackReference
	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PARENT_EID", nullable = true, insertable = true, updatable = true, foreignKey = @ForeignKey(name = "none"))
    private SystemVariable parent;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.PagingContentsView.class, FlowDataJsonView.SingleEntityView.class })
    @JsonManagedReference
	@Fetch(FetchMode.SUBSELECT)
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "PARENT_EID", foreignKey = @ForeignKey(name = "none"))
    @SQLRestriction("entity_status <> 'DELETE'")
    private Set<SystemVariable> children = new LinkedHashSet<>();
	
	public String getKey() {
		return getEntityId();
	}

	public void setKey(String key) {
		this.setEntityId(key);
	}
	
	@Override
    public String getParentEntityId() {
        return parent != null ? parent.getEntityId() : null;
    }
	
	@Override
	public List<SystemVariable> getChildren() {
		if (children != null) {
			return new ArrayList<>(children);
		}
		return null;
	}
	
	@Override
	public void setChildren(List<SystemVariable> children) {
		if (children != null) {
			this.children = new LinkedHashSet<>(children);
		}
	}

	@Override
	public void addChild(SystemVariable child) {
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
	public void addChild(List<SystemVariable> children) {
		if (children != null) {
			for (SystemVariable child : children) {
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
		return getParent() != null ? getParent().getPath() + "." + getKey() : getKey();
	}
	
	@Override
	public void updatePath() {
		setPath(createPath());
	}
}
