package com.wecoms24.flow.counsel.link;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecoms24.flow.core.file.FileMetaData;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.converter.BaseBooleanToYNStringIgnoreCaseConverter;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "SITE_LINK_TM")
@AttributeOverride(name = "entityId", column = @Column(name = "SITE_LINK_EID"))
public class SiteLink extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

	@Merge
	@Column(name = "NAME", nullable = false)
	private String name;
	
	@Merge
	@Column(name = "LINK_URL", nullable = false)
	private String linkUrl;
	
	@Merge
	@Column(name = "USABLE", length = 1)
	@Convert(converter = BaseBooleanToYNStringIgnoreCaseConverter.class)
	private Boolean usable;
	
	@Merge(ignoreNull = false)
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "ICON_FILE_TOKEN", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private FileMetaData iconImageFile;
	
	@Merge
	@Column(name = "ORDER_NUM", nullable = false)
	private Integer orderNumber;
	
	@Merge
	@Column(name = "DESCRIPTION", length = 3000)
	private String description;
}
