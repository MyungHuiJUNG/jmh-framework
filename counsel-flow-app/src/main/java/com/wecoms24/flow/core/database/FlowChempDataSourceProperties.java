package com.wecoms24.flow.core.database;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import com.wecoms24.flow.FlowAppConstants;

@ConfigurationProperties(prefix = FlowChempDataSourceProperties.PREFIX)
@Getter
@Setter
public class FlowChempDataSourceProperties {
	public static final String PREFIX = FlowAppConstants.CHEMP_DB_PROPERTIES;
	
	private String url;
    private String username;
    private String password;
    private String driverClassName;
    private Hikari hikari;
    private JpaProperties jpa;
    
    @Getter
    @Setter
    public static class Hikari {
    	private int maximumPoolSize = 10;
        private long connectionTimeout = 30000;
        private long validationTimeout = 5000;
        private int minimumIdle = 10;
        private long idleTimeout = 600000;
        private long maxLifetime = 1800000;
        private boolean autoCommit = true;
        private boolean readOnly = false;
    }
    
    @Getter
    @Setter
    public static class JpaProperties {
    	private boolean showSql = false;
        private HibernateProperties hibernate;

        @Getter
        @Setter
        public static class HibernateProperties {
            private String ddlAuto = "none";
            private boolean formatSql = false;
        }
    }
}
