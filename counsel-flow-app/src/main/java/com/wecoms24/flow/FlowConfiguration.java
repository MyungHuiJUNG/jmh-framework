package com.wecoms24.flow;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;

import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import com.wecoms24.flow.core.FlowInterceptor;

@Configuration
public class FlowConfiguration implements WebMvcConfigurer {
	
	@Bean
	Hibernate5Module hibernate5Module() {
		return new Hibernate5Module();
	}

	@Bean
    LocaleResolver localeResolver() {
		AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
        localeResolver.setDefaultLocale(new Locale(FlowAppConstants.KOREAN_LOCALE));
        Locale.setDefault(new Locale(FlowAppConstants.KOREAN_LOCALE));
        
        return localeResolver;
	}
	
	@Bean
    LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName(FlowAppConstants.LANGUAGE);
        return interceptor;
    }

	@Bean
    MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename(FlowAppConstants.MESSAGES_CLASS_PATH);
        messageSource.setDefaultEncoding(FlowAppConstants.UTF_8_STRING_VALUE);
        messageSource.setDefaultLocale(new Locale(FlowAppConstants.KOREAN_LOCALE));
        messageSource.setUseCodeAsDefaultMessage(true);
        return messageSource;
    }
	
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler(FlowAppConstants.ALL_ASTERISK)
				.addResourceLocations(FlowAppConstants.STATIC_CLASS_PATH);
	}
	
	@Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new FlowInterceptor())
                .excludePathPatterns(FlowAppConstants.INDEX_HTML, FlowAppConstants.FAVICON, FlowAppConstants.EMPTY_PATH, FlowAppConstants.LOGIN_PATH, "/view/main", FlowAppConstants.ALL_RESOURCE_ASSETS, FlowAppConstants.ALL_RESOURCE_ICONS, FlowAppConstants.ALL_RESOURCE_CSS, FlowAppConstants.ALL_RESOURCE_IMAGES, FlowAppConstants.ALL_RESOURCE_JS);
        registry.addInterceptor(localeChangeInterceptor());
    }
}
