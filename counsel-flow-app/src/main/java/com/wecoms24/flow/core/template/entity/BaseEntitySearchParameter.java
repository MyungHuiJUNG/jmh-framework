package com.wecoms24.flow.core.template.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;

import com.wecoms24.flow.FlowAppConstants;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID> {
	private int page;
	private int size;
	private ENTITY_ID fromEntityId;
	private ENTITY_ID toEntityId;
	private Date fromCreatedDate;
	private Date toCreatedDate;
	private ENTITY_TYPE entity;
	private List<ENTITY_ID> entityIds;
	private List<ENTITY_TYPE> entities;
	private String sort;
	private Boolean containDeleteStatusEntity = false;
	private Boolean isTopCode;
	private Boolean isSearchLike = true;

	public BaseEntitySearchParameter(Class<ENTITY_TYPE> entityClass) {
		try {
			this.entity = entityClass.getConstructor().newInstance();
		} catch (Exception e) {
		}
	}
	
	public Boolean getIsTopCode() {
		return isTopCode;
	}

	public void setIsTopCode(Boolean isTopCode) {
		if (BaseTreeEntity.class.isAssignableFrom(this.entity.getClass()) && isTopCode == false) {
			setSort("path,asc");
		}
		this.isTopCode = isTopCode;
	}

	public Sort getSort() {
		if (sort == null || sort.isEmpty()) {
            return Sort.unsorted();
        }
		
		List<Order> orderList = new ArrayList<>();
		String[] sorts = sort.split(FlowAppConstants.HYPHEN);
		for (String sort : sorts) {
			String[] parts = sort.split(FlowAppConstants.COMMA);
			if (parts.length == 2) {
				orderList.add(Sort.Order.by(parts[0]).with(Sort.Direction.fromString(parts[1])));
			} else if (parts.length == 1) {
				orderList.add(Sort.Order.by(parts[0]).with(Sort.Direction.ASC));
			}
		}
		
		return Sort.by(orderList);
    }

    public void setSort(String sort) {
    	if (BaseTreeEntity.class.isAssignableFrom(this.entity.getClass()) && isTopCode == false) {
    		sort = "path,asc";
    	}
        this.sort = sort;
    }
}
