package com.wecoms24.flow.board.reply;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplySearchParameter extends BaseEntitySearchParameter<Reply, Long> {
	private Long boardEid;

	public ReplySearchParameter() {
		super(Reply.class);
	}

}
