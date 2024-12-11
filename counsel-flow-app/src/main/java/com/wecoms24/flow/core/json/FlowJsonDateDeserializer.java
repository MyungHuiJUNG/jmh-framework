package com.wecoms24.flow.core.json;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
@Getter
@Setter
public class FlowJsonDateDeserializer extends StdDeserializer<Date> {
	private static final long serialVersionUID = 8728916746500612450L;
	
	@Autowired
	private FlowJsonDateFormatProvider dateFormatProvider;
	
	public FlowJsonDateDeserializer() {
		super(Date.class);
	}
	
	public FlowJsonDateDeserializer(FlowJsonDateFormatProvider dateFormatProvider) {
		this();
		this.dateFormatProvider = dateFormatProvider;
	}

	@Override
	public Date deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JacksonException {
		String value = jp.getText();
		if (value == null || value.isEmpty()) {
			return null;
		}
		
		String dateFormat = null;
		if (dateFormatProvider != null) {
			dateFormat = dateFormatProvider.getDateFormat();
		}
		
		if (dateFormat == null || dateFormat.isEmpty()) {
			return new Date(Long.parseLong(value));
		}
		
		Date parseDate = null;
		try {
			parseDate = new SimpleDateFormat(dateFormat).parse(value);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		return parseDate;
	}
}
