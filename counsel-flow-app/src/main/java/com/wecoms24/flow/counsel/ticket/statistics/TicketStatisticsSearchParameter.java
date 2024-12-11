package com.wecoms24.flow.counsel.ticket.statistics;

import java.util.Date;

public class TicketStatisticsSearchParameter {
	private Date fromDate;
	private Date toDate;
	private String counselTypePath;
	private String organizationPath;
	private Long userEntityId;
	private String ctiExtension;
	
	public Date getFromDate() {
		return fromDate;
	}

	public void setFromDate(Date fromDate) {
		this.fromDate = fromDate;
	}

	public Date getToDate() {
		return toDate;
	}

	public void setToDate(Date toDate) {
		this.toDate = toDate;
	}
	
	public String getCounselTypePath() {
		return counselTypePath;
	}
	
	public void setCounselTypePath(String counselTypePath) {
		this.counselTypePath = counselTypePath;
	}
	
	public String getOrganizationPath() {
		return organizationPath;
	}
	
	public void setOrganizationPath(String organizationPath) {
		this.organizationPath = organizationPath;
	}
	
	public Long getUserEntityId() {
		return userEntityId;
	}
	
	public void setUserEntityId(Long userEntityId) {
		this.userEntityId = userEntityId;
	}
	
	public String getCtiExtension() {
		return ctiExtension;
	}
	
	public void setCtiExtension(String ctiExtension) {
		this.ctiExtension = ctiExtension;
	}
}
