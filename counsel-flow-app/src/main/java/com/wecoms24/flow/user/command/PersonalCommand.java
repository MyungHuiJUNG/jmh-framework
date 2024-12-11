package com.wecoms24.flow.user.command;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.command.key.ShortCutKey;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "PERSONAL_COMMAND_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "PERSONAL_COMMAND_EID"))
public class PersonalCommand extends BaseAuditingUserIdSequenceAbstractEntity<Long> {
	
	@Merge
	@Column(name = "COMMAND_TYPE", length = 64, nullable = false)
	@Enumerated(EnumType.STRING)
	private CommandType commandType; 
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonManagedReference
	@Merge
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "personalCommand", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ShortCutKey> shortCutKeys;
	
	@Merge
    @Column(name = "COMMAND", length = 5000)
	private String command;
	
	@Merge
    @Column(name = "DESCRIPTION")
	private String description;
	
	@ManyToOne
    @JoinColumn(name = "USER_EID", nullable = false)
	private User user;
	
	public void addShortCutKey(ShortCutKey shortCutKey) {
        this.shortCutKeys.add(shortCutKey);
        shortCutKey.setPersonalCommand(this);
    }

    public void removeShortCutKey(ShortCutKey shortCutKey) {
        this.shortCutKeys.remove(shortCutKey);
        shortCutKey.setPersonalCommand(null);
    }
}
