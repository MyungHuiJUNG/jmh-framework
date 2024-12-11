package com.wecoms24.flow.settings.role.group;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.converter.BaseBooleanToYNStringIgnoreCaseConverter;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.settings.menu.Menu;
import com.wecoms24.flow.settings.role.Role;
import com.wecoms24.flow.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.ColumnDefault;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "ROLE_GROUP_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "ROLE_GROUP_EID"))
public class RoleGroup extends BaseAuditingUserIdSequenceAbstractEntity<Long> {
	
	@SearchLike
	@Merge
	@Column(name = "NAME", nullable = false, unique = true)
    private String name;
	
	@Column(name = "USABLE", length = 1, nullable = false)
	@ColumnDefault("'Y'")
	@Merge
	@Convert(converter = BaseBooleanToYNStringIgnoreCaseConverter.class)
	private Boolean usable;
	
	@BatchSize(size = 100)
	@JsonIgnore
	@Merge(ignoreNull = false)
	@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "ROLEGROUP_ROLES",
        joinColumns = @JoinColumn(name = "ROLE_GROUP_EID"),
        inverseJoinColumns = @JoinColumn(name = "ROLE_EID")
    )
	private Set<Role> roles = new LinkedHashSet<>();
	
	@BatchSize(size = 100)
	@JsonIgnore
	@Merge(ignoreNull = false)
	@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "ROLEGROUP_MENUS",
        joinColumns = @JoinColumn(name = "ROLE_GROUP_EID"),
        inverseJoinColumns = @JoinColumn(name = "MENU_EID")
    )
	private Set<Menu> menus = new LinkedHashSet<>();

	@BatchSize(size = 100)
	@JsonIgnore
	@Merge(ignoreNull = false)
	@OneToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "ROLEGROUP_USERS",
    	joinColumns = @JoinColumn(name = "ROLE_GROUP_EID"),
    	inverseJoinColumns = @JoinColumn(name = "USER_EID")
    )
	private Set<User> users = new LinkedHashSet<>();
	
	public List<Role> getRoles() {
		if (roles != null) {
			return new ArrayList<>(roles);
		}
		return null;
	}
	
	public void setRoles(List<Role> roles) {
		if (roles != null) {
			this.roles = new LinkedHashSet<>(roles);
		}
	}
	
	public void addRole(Role role) {
		if (roles == null) {
			roles = new LinkedHashSet<>();
		}
		roles.add(role);
	}
	
	public List<Menu> getMenus() {
		if (menus != null) {
			return new ArrayList<>(menus);
		}
		return null;
	}
	
	public void setMenus(List<Menu> menus) {
		if (menus != null) {
			this.menus = new LinkedHashSet<>(menus);
		}
	}
	
	public void addMenu(Menu menu) {
		if (menus == null) {
			menus = new LinkedHashSet<>();
		}
		menus.add(menu);
	}
	
	public List<User> getUsers() {
		if (users != null) {
			return new ArrayList<>(users);
		}
		return null;
	}
	
	public void setUsers(List<User> users) {
		if (users != null) {
			this.users = new LinkedHashSet<>(users);
		}
	}
	
	public void addUser(User user) {
		if (users == null) {
			users = new LinkedHashSet<>();
		}
		users.add(user);
	}
}

