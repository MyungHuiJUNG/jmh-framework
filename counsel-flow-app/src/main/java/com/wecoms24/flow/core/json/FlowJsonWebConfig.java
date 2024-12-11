package com.wecoms24.flow.core.json;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.util.Date;

@Configuration
public class FlowJsonWebConfig {
	private final FlowJsonDateSerializer baseJsonDateSerializer;
    private final FlowJsonDateDeserializer baseJsonDateDeserializer;
    
    public FlowJsonWebConfig(FlowJsonDateSerializer baseJsonDateSerializer, FlowJsonDateDeserializer baseJsonDateDeserializer) {
        this.baseJsonDateSerializer = baseJsonDateSerializer;
        this.baseJsonDateDeserializer = baseJsonDateDeserializer;
    }

    @Bean
    ObjectMapper objectMapper() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        builder.indentOutput(true);
        builder.defaultViewInclusion(true);
        builder.serializerByType(Date.class, baseJsonDateSerializer);
        builder.deserializerByType(Date.class, baseJsonDateDeserializer);
        return builder.build();
    }
    
    @Bean
    Jackson2ObjectMapperBuilder jacksonBuilder() {
        return Jackson2ObjectMapperBuilder.json()
                .serializerByType(Date.class, new FlowJsonDateSerializer(new FlowWebRequestHeaderJsonDateFromatProvider()))
                .deserializerByType(Date.class, new FlowJsonDateDeserializer(new FlowWebRequestHeaderJsonDateFromatProvider()));
    }
}
