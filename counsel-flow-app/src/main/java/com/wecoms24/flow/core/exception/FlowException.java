package com.wecoms24.flow.core.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FlowException extends RuntimeException {
	private static final long serialVersionUID = 8938273413165351358L;
	
	private final FlowErrorCode errorCode;
}
