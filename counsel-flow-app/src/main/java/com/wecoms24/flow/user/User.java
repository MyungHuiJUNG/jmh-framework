package com.wecoms24.flow.user;

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.counsel.organization.Organization;
import com.wecoms24.flow.settings.role.group.RoleGroup;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "USER_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "USER_EID"))
@JsonIgnoreProperties(ignoreUnknown =true)
public class User extends BaseAuditingUserIdSequenceAbstractEntity<Long> {
    
	@SearchLike
	@Column(name = "USER_ID", nullable = false, unique = true)
    private String id;

	@JsonProperty(access = Access.WRITE_ONLY)
    @Merge
    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @SearchLike
    @Merge
    @Column(name = "USER_NAME", nullable = false)
    private String name;
    
    @Merge
    @Column(name = "USE_TYPE_CD", nullable = false)
    private String useTypeCode;
    
    @Merge(ignoreNull = false)
    @Column(name = "MAIL_ADDR")
    private String email;
    
    @Merge(ignoreNull = false)
    @Column(name = "CTI_LOGIN_ID", length = 50)
    private String ctiLoginId;
    
    @Merge(ignoreNull = false)
    @Column(name = "CTI_LOGIN_PASSWORD", length = 50)
	private String ctiLoginPassword;
    
    @Merge(ignoreNull = false)
    @Column(name = "CTI_EXTENSION", length = 50)
    private String ctiExtension;
    
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonView({ UserJsonView.UserListEntityView.class, UserJsonView.UserSingleEntityView.class })
    @Merge(ignoreNull = false)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinTable(name = "ROLEGROUP_USERS",
		joinColumns = @JoinColumn(name = "USER_EID"),
		inverseJoinColumns = @JoinColumn(name = "ROLE_GROUP_EID")
	)
	private RoleGroup roleGroup;
    
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonView({ UserJsonView.UserListEntityView.class, UserJsonView.UserSingleEntityView.class })
    @Merge(ignoreNull = false)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinTable(name = "ORG_USERS",
		joinColumns = @JoinColumn(name = "USER_EID"),
		inverseJoinColumns = @JoinColumn(name = "ORG_EID")
	)
    private Organization organization;
    
    @JsonView({ UserJsonView.UserListEntityView.class, UserJsonView.UserSingleEntityView.class })
    @Formula("(SELECT u.USER_ID"
			+ " FROM USER_TM u"
			+ " WHERE u.USER_EID = CREATE_BY)")
    private String createdByUserId;
    
    @JsonView({ UserJsonView.UserListEntityView.class, UserJsonView.UserSingleEntityView.class })
    @Formula("(SELECT u.USER_NAME"
			+ " FROM USER_TM u"
			+ " WHERE u.USER_EID = CREATE_BY)")
    private String createdByUserName;
    
    @JsonView({ UserJsonView.UserListEntityView.class, UserJsonView.UserSingleEntityView.class })
    @Formula("(SELECT u.USER_ID"
			+ " FROM USER_TM u"
			+ " WHERE u.USER_EID = MODIFIED_BY)")
    private String lastModifiedByUserId;
    
    @JsonView({ UserJsonView.UserListEntityView.class, UserJsonView.UserSingleEntityView.class })
    @Formula("(SELECT u.USER_NAME"
			+ " FROM USER_TM u"
			+ " WHERE u.USER_EID = MODIFIED_BY)")
    private String lastModifiedByUserName;
}
