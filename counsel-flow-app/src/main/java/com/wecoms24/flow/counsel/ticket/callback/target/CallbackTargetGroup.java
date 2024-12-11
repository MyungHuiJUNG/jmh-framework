package com.wecoms24.flow.counsel.ticket.callback.target;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.user.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "CALLBACK_TARGET_GROUP")
@AttributeOverride(name = "entityId", column = @Column(name = "CALLBACK_TARGET_GROUP_EID"))
public class CallbackTargetGroup extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

	@Column(name = "REPRESENT_NUMBER", unique = true)
    private String representNumber;
    
    @Column(name = "REPRESENT_NUMBER_NAME")
    private String representNumberName;
    
	@Merge(ignoreNull = false)
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "CALLBACK_TARGET_GROUP_USERS",
    	joinColumns = @JoinColumn(name = "CALLBACK_TARGET_GROUP_EID"),
    	inverseJoinColumns = @JoinColumn(name = "USER_EID")
    )
    private List<User> users;
}
