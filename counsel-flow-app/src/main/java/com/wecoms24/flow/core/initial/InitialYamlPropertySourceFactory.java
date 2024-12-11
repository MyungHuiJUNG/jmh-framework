package com.wecoms24.flow.core.initial;

import org.springframework.core.env.PropertySource;
import org.springframework.core.env.SimpleCommandLinePropertySource;
import org.springframework.core.io.support.DefaultPropertySourceFactory;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.ResourcePropertySource;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class InitialYamlPropertySourceFactory extends DefaultPropertySourceFactory {

	@Override
    public PropertySource<?> createPropertySource(String name, EncodedResource resource) throws IOException {
        if (resource == null) {
            return new SimpleCommandLinePropertySource();
        }
        return (name != null) ? new ResourcePropertySource(name, resource) : new ResourcePropertySource(resource);
    }
}
