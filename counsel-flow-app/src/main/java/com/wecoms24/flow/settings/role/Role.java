package com.wecoms24.flow.settings.role;

import com.fasterxml.jackson.annotation.*;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.core.template.entity.BaseTreeEntity;
import com.wecoms24.flow.settings.role.group.RoleGroup;
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
@Table(name = "ROLE_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "ROLE_EID"))
public class Role extends BaseAuditingUserIdSequenceAbstractEntity<Long> implements BaseTreeEntity<Role, Long> {
	
	@SearchLike
	@Merge
	@Column(name = "NAME", length = 256, nullable = false)
    private String name;
    
	@Pattern(regexp = FlowAppConstants.REG_EXP_ALPHABET_NUMBER, message = FlowAppConstants.REG_EXP_ALPHABET_NUMBER_ERROR_KEY)
    @Column(name = "CODE", nullable = false)
    private String code;

    @Column(name = "PATH", nullable = false, unique = true)
    private String path;

    @Merge
    @Column(name = "ORDER_NUM", length = 256, nullable = false)
    private Integer orderNumber;

    @Merge(ignoreNull = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonView({ FlowDataJsonView.SingleEntityView.class })
    @JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_EID", nullable = true, insertable = true, updatable = true, foreignKey = @ForeignKey(name = "none"))
    private Role parent;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.PagingContentsView.class, FlowDataJsonView.SingleEntityView.class })
    @JsonManagedReference
	@Fetch(FetchMode.SUBSELECT)
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinColumn(name = "PARENT_EID", foreignKey = @ForeignKey(name = "none"))
    @SQLRestriction("entity_status <> 'DELETE'")
    private Set<Role> children = new LinkedHashSet<>();
    
    @JsonView({ FlowDataJsonView.IgnoreView.class })
    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinTable(
            name = "ROLEGROUP_ROLES",
            joinColumns = @JoinColumn(name = "ROLE_EID"),
            inverseJoinColumns = @JoinColumn(name = "ROLE_GROUP_EID")
        )
	private List<RoleGroup> roleGroups;
    
    @Override
    public Long getParentEntityId() {
        return parent != null ? parent.getEntityId() : null;
    }
    
    @Override
    public List<Role> getChildren() {
		if (children != null) {
			return new ArrayList<>(children);
		}
		return null;
	}
	
    @Override
	public void setChildren(List<Role> children) {
		if (children != null) {
			this.children = new LinkedHashSet<>(children);
		}
	}

    @Override
	public void addChild(Role child) {
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
	public void addChild(List<Role> children) {
		if (children != null) {
			for (Role child : children) {
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

