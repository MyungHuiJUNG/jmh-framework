package com.wecoms24.flow.counsel.ticket.callback.target;

import java.util.List;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CallbackTargetGroupSearchParameter extends BaseEntitySearchParameter<CallbackTargetGroup, Long> {
	private List<String> representNumbers;

	public CallbackTargetGroupSearchParameter() {
		super(CallbackTargetGroup.class);
	}
}
