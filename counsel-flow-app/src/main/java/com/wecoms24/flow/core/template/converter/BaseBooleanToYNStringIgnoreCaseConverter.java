package com.wecoms24.flow.core.template.converter;

import com.wecoms24.flow.FlowAppConstants;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class BaseBooleanToYNStringIgnoreCaseConverter implements AttributeConverter<Boolean, String> {
	@Override
	public String convertToDatabaseColumn(Boolean attribute) {
		return (attribute != null && attribute) ? FlowAppConstants.Y_STRING_VALUE : FlowAppConstants.N_STRING_VALUE;
	}

	@Override
	public Boolean convertToEntityAttribute(String dbData) {
		return "Y".equalsIgnoreCase(dbData);
	}
}
