package com.wecoms24.flow.core.json;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.util.Date;

public class FlowWebJacksonObjectMapperBuilder {
	
	public static ObjectMapper defaultObjectMapper() {
		Jackson2ObjectMapperBuilder objectMpperBuilder = Jackson2ObjectMapperBuilder.json();
		objectMpperBuilder.indentOutput(true);
		objectMpperBuilder.defaultViewInclusion(true);
		objectMpperBuilder.serializerByType(Date.class, new FlowJsonDateSerializer(new FlowWebRequestHeaderJsonDateFromatProvider()));
		objectMpperBuilder.deserializerByType(Date.class, new FlowJsonDateDeserializer(new FlowWebRequestHeaderJsonDateFromatProvider()));
		return objectMpperBuilder.build();
	}
}
