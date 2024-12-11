package com.wecoms24.flow.counsel.script;

import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.LongVarcharJdbcType;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.counsel.type.CounselType;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "SCRIPT_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "SCRIPT_EID"))
@JsonIgnoreProperties(ignoreUnknown =true)
public class Script extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COUNSEL_TYPE_EID")
	private CounselType counselType;
	
	@Merge
    @Column(name = "TITLE")
    private String title;
    
	@Merge
    @Lob
    @JdbcType(LongVarcharJdbcType.class)
    @Column(name = "CONTENT", columnDefinition = "LONGTEXT")
    private String contents;
	
	@SearchLike
    @Merge
    @Lob
    @JdbcType(LongVarcharJdbcType.class)
    @Column(name = "RAW_CONTENT", columnDefinition = "LONGTEXT")
    private String rawContent;
}
