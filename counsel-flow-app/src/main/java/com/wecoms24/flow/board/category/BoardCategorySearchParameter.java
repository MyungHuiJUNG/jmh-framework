package com.wecoms24.flow.board.category;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class BoardCategorySearchParameter extends BaseEntitySearchParameter<BoardCategory, Long> {

	public BoardCategorySearchParameter() {
		super(BoardCategory.class);
		setIsTopCode(true);
	}
}
