package com.wecoms24.flow.core.exception;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
@Builder
public class FlowErrorResponse {
	private String code;
    private String message;
    
    public static ResponseEntity<FlowErrorResponse> toResponseEntity(HttpStatus httpStatus, Integer code, String message){
        return ResponseEntity
                .status(httpStatus)
                .body(FlowErrorResponse.builder()
                        .code(String.valueOf(code))
                        .message(message)
                        .build());
    }
}
