package com.wecoms24.flow.core.initial;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.util.List;

@Getter
@Setter
@Configuration
@PropertySource(value = "classpath:initial-data.yml", factory = InitialYamlPropertySourceFactory.class)
@ConfigurationProperties(prefix = "initial-data")
public class InitialDataConfig {
	private List<SystemVariableConfig> systemVariables;
	private List<RoleConfig> roles;
    private List<MenuConfig> menus;
    private List<CodeConfig> codes;

    @Getter
    @Setter
    public static class SystemVariableConfig {
    	private String key;
    	private String displayName;
    	private String description;
    	private Boolean editable;
        private String editType;
        private String editItem;
        private String type;
        private String value;
        private List<SystemVariableConfig> children;
    }
    
    @Getter
    @Setter
    public static class RoleConfig {
        private String name;
        private String code;
        private Integer orderNumber;
        private List<RoleConfig> children;
    }

    @Getter
    @Setter
    public static class MenuConfig {
        private String actionType;
        private String actionId;
        private Integer actionNumber;
        private String code;
        private String name;
        private Integer orderNumber;
        private Boolean usable = true;
        private Integer quickOrderNumber;
        private Boolean quickUsable = false;
        private List<MenuConfig> children;
    }
    
    @Getter
    @Setter
    public static class CodeConfig {
    	private String codeType;
    	private String code;
        private String name;
        private String remarkText;
        private Integer orderNumber;
        private List<CodeConfig> children;
    }
}
