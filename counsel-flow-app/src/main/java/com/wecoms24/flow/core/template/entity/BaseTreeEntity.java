package com.wecoms24.flow.core.template.entity;

import java.util.List;

public interface BaseTreeEntity<ENTITY extends BaseTreeEntity<? super ENTITY, ENTITY_ID>, ENTITY_ID> {
	ENTITY getParent();

	void setParent(ENTITY parent);

	ENTITY_ID getParentEntityId();
	
	List<ENTITY> getChildren();

	void setChildren(List<ENTITY> children);

	void addChild(ENTITY child);
	
	void addChild(List<ENTITY> children);

	boolean hasChild();
	
	String createPath();
	
	void updatePath();
}
