package com.wecoms24.flow.core.json;

import com.wecoms24.flow.FlowAppConstants;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@RequestScope
public class FlowWebRequestHeaderJsonDateFromatProvider implements FlowJsonDateFormatProvider {

	@Override
	public String getDateFormat() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		String dateFormat = request.getHeader(FlowAppConstants.DATE_FORMAT_HEADER_KEY);
		String responseDateFormat = request.getHeader(FlowAppConstants.RESPONSE_DATE_FORMAT_HEADER_KEY);
		
		if(responseDateFormat != null && !responseDateFormat.isEmpty())
			dateFormat = responseDateFormat;
		
		return dateFormat;
	}
}
