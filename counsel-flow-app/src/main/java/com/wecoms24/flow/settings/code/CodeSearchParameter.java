package com.wecoms24.flow.settings.code;

import java.util.List;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeSearchParameter extends BaseEntitySearchParameter<Code, Long> {
	private String searchCode;
	private String searchName;
	private List<Boolean> usables;
	
	public CodeSearchParameter() {
		super(Code.class);
		setIsTopCode(true);
	}
}
