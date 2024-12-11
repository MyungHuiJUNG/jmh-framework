package com.wecoms24.flow.core.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
@Getter
@Setter
public class FlowJsonDateSerializer extends StdSerializer<Date> {
	private static final long serialVersionUID = 510650566264096860L;
	
	@Autowired
	private FlowJsonDateFormatProvider dateFormatProvider;

	public FlowJsonDateSerializer() {
		super(Date.class);
	}
	
	public FlowJsonDateSerializer(FlowJsonDateFormatProvider dateFormatProvider) {
		this();
		this.dateFormatProvider = dateFormatProvider;
	}

	@Override
	public void serialize(Date value, JsonGenerator gen, SerializerProvider provider) throws IOException {
		String dateFormat = dateFormatProvider.getDateFormat();
		if (dateFormat != null) {
			gen.writeString(new SimpleDateFormat(dateFormat).format(value));
		} else {
			gen.writeNumber(value.getTime());
		}
	}
}
