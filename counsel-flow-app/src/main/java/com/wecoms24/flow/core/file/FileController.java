package com.wecoms24.flow.core.file;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping(value = FlowAppConstants.REST_API_FILE_DYNAMIC_URL)
public class FileController extends BaseWebCrudController<User, JwtTokenProvider, FileMetaData, String, FileMetaDataDao, FileMetaDataSearchParameter, FileMetaDataService> {

    @PostMapping(value = "/{resourceType}/{resourceKey}/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
    public void postFileUpload(@PathVariable("resourceType") String resourceType, @PathVariable("resourceKey") Object resourceKey, @RequestParam("file") MultipartFile[] files) {
        entityService.save(getLoginUser(), resourceType, String.valueOf(resourceKey), files);
    }

    @GetMapping(value = "/{token}/download")
    public void getFileDownload(@PathVariable("token") String token, HttpServletResponse response) {
    	FileMetaData fileMetaData = entityService.findByToken(token);
    	String encodedUploadFile = UriUtils.encode(fileMetaData.getFileName(), StandardCharsets.UTF_8);
    	response.setContentType("application/octet-stream");
    	response.setHeader("Content-Disposition", "attachment; filename=\"" + encodedUploadFile + "\"");
    	
		try (FileInputStream inputStream = new FileInputStream(fileMetaData.getFilePath());
				OutputStream outputStream = response.getOutputStream()) {
			byte[] buffer = new byte[1024];
			int bytesRead;
			while ((bytesRead = inputStream.read(buffer)) != -1) {
				outputStream.write(buffer, 0, bytesRead);
			}
		} catch (IOException e) {
			throw new FlowException(FlowErrorCode.FAIL_FIND_FILE);
		}
    }
}
