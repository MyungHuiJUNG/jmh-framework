package com.wecoms24.flow.board;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class BoardSearchParameter extends BaseEntitySearchParameter<Board, Long> {
	private String keyword;

	private String createdByName;

	public BoardSearchParameter() {
        super(Board.class);
    }

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getCreatedByName() {
		return createdByName;
	}

	public void setCreatedByName(String createdByName) {
		this.createdByName = createdByName;
	}
}
