package com.wecoms24.flow.core.template.entity;

public interface BaseEntity<ENTITY_ID> {
	ENTITY_ID getEntityId();
	void setEntityId(ENTITY_ID entityId);
	EntityStatus getEntityStatus();
	void setEntityStatus(EntityStatus entityStatus);
}
