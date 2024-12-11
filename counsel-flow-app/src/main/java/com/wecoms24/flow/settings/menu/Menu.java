package com.wecoms24.flow.settings.menu;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.file.FileMetaData;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.converter.BaseBooleanToYNStringIgnoreCaseConverter;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.core.template.entity.BaseTreeEntity;
import com.wecoms24.flow.settings.role.group.RoleGroup;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "MENU_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "MENU_EID"))
public class Menu extends BaseAuditingUserIdSequenceAbstractEntity<Long> implements BaseTreeEntity<Menu, Long> {

	@Merge
	@Column(name = "ACTION_TYPE", length = 64, nullable = true)
	@Enumerated(EnumType.STRING)
	private MenuActionType actionType;
	
	@Merge
	@Column(name = "ACTION_ID", length = 128, nullable = true)
	private String actionId;
	
	@Merge
	@Column(name = "ACTION_NUMBER", nullable = true)
	private Integer actionNumber;
	
    @Column(name = "CODE", nullable = false, unique = true)
    @Pattern(regexp = FlowAppConstants.REG_EXP_ALPHABET_NUMBER, message = FlowAppConstants.REG_EXP_ALPHABET_NUMBER_ERROR_KEY)
    private String code;
	
    @Column(name = "PATH", nullable = false, unique = true)
    private String path;
	
	@SearchLike
	@Merge
	@Column(name = "NAME", length = 1024, nullable = false)
    private String name;
	
	@Merge
	@Column(name = "ORDER_NUM", nullable = false)
    private Integer orderNumber;

	@Column(name = "USABLE", length = 1, nullable = false)
	@ColumnDefault("'Y'")
	@Merge
	@Convert(converter = BaseBooleanToYNStringIgnoreCaseConverter.class)
	private Boolean usable;

	@Merge(ignoreNull = false)
	@Column(name = "QUICK_ORDER_NUM", nullable = true)
	private Integer quickOrderNumber;

	@Merge
	@Column(name = "QUICK_USABLE", length = 1, nullable = true)
	@Convert(converter = BaseBooleanToYNStringIgnoreCaseConverter.class)
	private Boolean quickUsable;
	
	@Merge(ignoreNull = false)
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "ICON_FILE_TOKEN", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private FileMetaData iconImageFile;
	
	@Merge(ignoreNull = false)
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "QUICK_ICON_FILE_TOKEN", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private FileMetaData quickIconImageFile;
	
	@Merge(ignoreNull = false)
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
    @JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_EID", nullable = true, insertable = true, updatable = true, foreignKey = @ForeignKey(name = "none"))
    private Menu parent;

	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.PagingContentsView.class })
    @JsonManagedReference
	@Fetch(FetchMode.SUBSELECT)
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinColumn(name = "PARENT_EID", foreignKey = @ForeignKey(name = "none"))
    @SQLRestriction("entity_status <> 'DELETE'")
    private Set<Menu> children = new LinkedHashSet<>();
    
	@JsonView({ FlowDataJsonView.IgnoreView.class })
    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinTable(
            name = "ROLEGROUP_MENUS",
            joinColumns = @JoinColumn(name = "MENU_EID"),
            inverseJoinColumns = @JoinColumn(name = "ROLE_GROUP_EID")
        )
	private List<RoleGroup> roleGroups;
    
	@Override
    public Long getParentEntityId() {
        return parent != null ? parent.getEntityId() : null;
    }
	
	@Override
    public List<Menu> getChildren() {
		if (children != null) {
			return new ArrayList<>(children);
		}
		return null;
	}
	
	@Override
	public void setChildren(List<Menu> children) {
		if (children != null) {
			this.children = new LinkedHashSet<>(children);
		}
	}

	@Override
	public void addChild(Menu child) {
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
	public void addChild(List<Menu> children) {
		if (children != null) {
			for (Menu child : children) {
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
