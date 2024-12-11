package com.wecoms24.flow.core.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum FlowErrorCode {
	WRONG_RESOURCE_NO(HttpStatus.BAD_REQUEST, 9000, "com.wecoms24.flow.wrong-resource-no"),
	UNKNOWN_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, 9001, "com.wecoms24.flow.unknown-error"),
	NOT_SUPPORTED_API(HttpStatus.INTERNAL_SERVER_ERROR, 9002, "com.wecoms24.flow.not-supported-api"),
	BAD_REQUEST_PARENT_EID(HttpStatus.BAD_REQUEST, 9003, "com.wecoms24.flow.bad-request-role-parent-eid"),
	DUPLICATE_CODE(HttpStatus.BAD_REQUEST, 9004, "com.wecoms24.flow.duplicate-code"),
	DUPLICATE_NAME(HttpStatus.BAD_REQUEST, 9004, "com.wecoms24.flow.duplicate-name"),
	BAD_PARAMETERS(HttpStatus.BAD_REQUEST, 9005, "com.wecoms24.flow.bad-parameters"),
	FILE_STORAGE_HOST_NOT_EXIST(HttpStatus.INTERNAL_SERVER_ERROR, 9006, "com.wecoms24.flow.core.file.host-is-not-exist"),
	INVALID_INPUT(HttpStatus.INTERNAL_SERVER_ERROR, 9007, "com.wecoms24.flow.invalid-input"),
	WRONG_CODE(HttpStatus.INTERNAL_SERVER_ERROR, 9008, "com.wecoms24.flow.wrong-code"),
	FAIL_FILE_DELETE(HttpStatus.INTERNAL_SERVER_ERROR, 9009, "com.wecoms24.flow.core.file.host-is-not-exist"),
	
	WRONG_AUTH_ID_OR_PASSWORD(HttpStatus.INTERNAL_SERVER_ERROR, 1000, "com.wecoms24.flow.auth.wrong-auth-id-or-password"),
	INVALID_TOKEN(HttpStatus.INTERNAL_SERVER_ERROR, 1001, "com.wecoms24.flow.auth.invalid-token"),
	MAX_LOGIN_EXPIRATION_REACHED(HttpStatus.INTERNAL_SERVER_ERROR, 1003, "com.wecoms24.flow.auth.max-login-expiration-reached"),
	WRONG_TOKEN_TYPE(HttpStatus.INTERNAL_SERVER_ERROR, 1004, "com.wecoms24.flow.auth.wrong-token-type"),
	UNABLE_RETRIEVE_TOKEN_INFO(HttpStatus.INTERNAL_SERVER_ERROR, 1005, "com.wecoms24.flow.auth.unable-retrieve-token-info"),
	CONVERT_JSON_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, 1006, "com.wecoms24.flow.auth.convert-json-fail"),
	NOT_FOUND_USER(HttpStatus.INTERNAL_SERVER_ERROR, 1007, "com.wecoms24.flow.auth.not-found-user"),
	DISABLED_PERMISSION_GROUP(HttpStatus.INTERNAL_SERVER_ERROR, 1008, "com.wecoms24.flow.auth.disabled-permission-group"),
	CANNOT_CHANGE_SUPER_ADMIN_GROUP(HttpStatus.INTERNAL_SERVER_ERROR, 1009, "com.wecoms24.flow.auth.can-not-change-supar-admin-group"),

	UNABLE_COPY_WHEN_DUPLICATE_ROLEGROUP_NAME(HttpStatus.INTERNAL_SERVER_ERROR, 2000, "com.wecoms24.flow.settings.unable-copy-when-duplicate-rolegroup-name"),
	
	DUPLICATE_USER_ID(HttpStatus.BAD_REQUEST, 3000, "com.wecoms24.flow.user.duplicate-user-id"),
	
	FAIL_CREATE_DIRECTORY(HttpStatus.INTERNAL_SERVER_ERROR, 8000, "com.wecoms24.flow.core.file.fail-create-directory"),
	FAIL_OPERATION_COPY(HttpStatus.INTERNAL_SERVER_ERROR, 8001, "com.wecoms24.flow.core.file.fail-operation-copy"),
	FAIL_SAVE_FILE(HttpStatus.INTERNAL_SERVER_ERROR, 8002, "com.wecoms24.flow.core.file.fail-save-file"),
	NULL_FILE_NAME(HttpStatus.BAD_REQUEST, 8003, "com.wecoms24.flow.core.file.null-file-name"),
	NULL_RESOURCE_TYPE(HttpStatus.BAD_REQUEST, 8004, "com.wecoms24.flow.core.file.null-resource-type"),
	NULL_RESOURCE_KEY(HttpStatus.BAD_REQUEST, 8005, "com.wecoms24.flow.core.file.null-resource-key"),
	NULL_TOKEN(HttpStatus.BAD_REQUEST, 8006, "com.wecoms24.flow.core.file.null-token"),
	FAIL_FIND_FILE(HttpStatus.BAD_REQUEST, 8007, "com.wecoms24.flow.core.file.fail-find-file"),
	FAIL_FIND_FILES(HttpStatus.BAD_REQUEST, 8008, "com.wecoms24.flow.core.file.fail-find-files"),
	FAIL_DELETE_FILE(HttpStatus.INTERNAL_SERVER_ERROR, 8009, "com.wecoms24.flow.core.file.fail-delete-file"),
	NOT_EXIST_FILE_META_DATA(HttpStatus.BAD_REQUEST, 8010, "com.wecoms24.flow.core.file.not-exist-file-meta-data"),
	NOT_EXIST_FILE_META_DATAS(HttpStatus.BAD_REQUEST, 8011, "com.wecoms24.flow.core.file.not-exist-file-meta-datas"),
	
	DUPLICATE_UNIQUE_KEY_IN_SHORT_CUT_KEY(HttpStatus.INTERNAL_SERVER_ERROR, 4000, "com.wecoms24.flow.user.command.key.duplicate-unique-key-in-short-cut-key"),
	DUPLICATE_COUNSEL_TYPE_EID_IN_SCRIPT(HttpStatus.INTERNAL_SERVER_ERROR, 5000, "com.wecoms24.flow.counsel.script.duplicate-counsel-type-id-in-script"),
    ;

    private final HttpStatus httpStatus;
    private final Integer code;
    private final String messageKey;
}
