package com.wecoms24.flow.core.template.controller;

import com.wecoms24.flow.FlowAppConstants;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.beans.PropertyEditorSupport;
import java.text.SimpleDateFormat;
import java.util.Date;

public abstract class BaseWebController {

	@InitBinder
	private void dateBinder(WebDataBinder binder) {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		String dateFormat = request.getHeader(FlowAppConstants.DATE_FORMAT_HEADER_KEY);
		if (dateFormat != null) {
			binder.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat(dateFormat), true));
		} else {
			binder.registerCustomEditor(Date.class, new PropertyEditorSupport() {
				@Override
				public void setAsText(String text) throws IllegalArgumentException {
					setValue(new Date(Long.parseLong(text)));
				}
				
				@Override
				public String getAsText() {
					long dateTime = ((Date) getValue()).getTime();
					return String.valueOf(dateTime);
				}
			});
		}
	}
}
