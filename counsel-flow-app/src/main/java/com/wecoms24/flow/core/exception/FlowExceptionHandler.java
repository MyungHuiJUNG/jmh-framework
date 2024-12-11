package com.wecoms24.flow.core.exception;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.wecoms24.flow.FlowAppConstants;

import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class FlowExceptionHandler extends ResponseEntityExceptionHandler {
	private final MessageSource messageSource;
	
	@ExceptionHandler(FlowException.class)
	public ResponseEntity<FlowErrorResponse> handleTempException(FlowException e, Locale locale) {
		e.printStackTrace();
		String message = messageSource.getMessage(e.getErrorCode().getMessageKey(), null, locale);
		return FlowErrorResponse.toResponseEntity(e.getErrorCode().getHttpStatus(), e.getErrorCode().getCode(), message);
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<FlowErrorResponse> handleGenericException(Exception e, Locale locale) {
		Throwable cause = e.getCause();
		e.printStackTrace();
		if (cause != null) {
			if (cause.getMessage().contains(FlowAppConstants.SQL_ERROR_DUPLICATE_ENTRY) && cause.getMessage().contains(FlowAppConstants.SQL_UNIQUE_NM_SHORT_CUT_UNIQUE)) {
				String message = messageSource.getMessage(FlowErrorCode.DUPLICATE_UNIQUE_KEY_IN_SHORT_CUT_KEY.getMessageKey(), null, locale);
				return FlowErrorResponse.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, FlowErrorCode.DUPLICATE_UNIQUE_KEY_IN_SHORT_CUT_KEY.getCode(), message);
	        } else if (cause.getMessage().contains(FlowAppConstants.SQL_ERROR_DUPLICATE_ENTRY) && cause.getMessage().contains(FlowAppConstants.SQL_ONE_TO_ONE_SCRIPT)) {
	        	String message = messageSource.getMessage(FlowErrorCode.DUPLICATE_COUNSEL_TYPE_EID_IN_SCRIPT.getMessageKey(), null, locale);
				return FlowErrorResponse.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, FlowErrorCode.DUPLICATE_COUNSEL_TYPE_EID_IN_SCRIPT.getCode(), message);
	        }
		}
		
		return FlowErrorResponse.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, FlowErrorCode.UNKNOWN_ERROR.getCode(), e.getMessage());
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<FlowErrorResponse> handleConstraintViolationException(ConstraintViolationException e, Locale locale) {
	    e.printStackTrace();
	    String errorMessage = e.getConstraintViolations().stream()
	        .findFirst()
	        .map(violation -> violation.getMessage())
	        .orElse(FlowErrorCode.INVALID_INPUT.getMessageKey());
	    
	    String message = messageSource.getMessage(errorMessage, null, locale);
	    log.error(message);
	    return FlowErrorResponse.toResponseEntity(HttpStatus.BAD_REQUEST, FlowErrorCode.INVALID_INPUT.getCode(), message);
	}
}
