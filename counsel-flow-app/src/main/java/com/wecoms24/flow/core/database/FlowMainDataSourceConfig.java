package com.wecoms24.flow.core.database;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.persistenceunit.MutablePersistenceUnitInfo;
import org.springframework.orm.jpa.persistenceunit.PersistenceUnitPostProcessor;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.wecoms24.flow.FlowAppConstants;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = FlowAppConstants.FLOW_PACKAGE,
    entityManagerFactoryRef = FlowAppConstants.MAIN_DB_ENTITY_MANAGER,
    transactionManagerRef = FlowAppConstants.MAIN_DB_TRANSACTION_MANAGER,
    excludeFilters = {@ComponentScan.Filter(type = FilterType.REGEX, pattern = "com.wecoms24.flow.chemp.*")}
)
@EnableJpaAuditing(auditorAwareRef = FlowAppConstants.AUTH_USER_AUDITOR_CLASS_NAME)
@EnableConfigurationProperties(FlowMainDataSourceProperties.class)
@RequiredArgsConstructor
public class FlowMainDataSourceConfig {
	
	private final FlowMainDataSourceProperties dataSourceProperties;
    
	@Bean(name = FlowAppConstants.MAIN_DB_DATASOURCE)
    @Primary
    DataSource flowMainDataSource() {
		HikariConfig config = new HikariConfig();
    	config.setJdbcUrl(dataSourceProperties.getUrl());
    	config.setUsername(dataSourceProperties.getUsername());
    	config.setPassword(dataSourceProperties.getPassword());
    	config.setDriverClassName(dataSourceProperties.getDriverClassName());
    	config.setAutoCommit(dataSourceProperties.getHikari().isAutoCommit());
    	config.setMaximumPoolSize(dataSourceProperties.getHikari().getMaximumPoolSize());
    	config.setConnectionTimeout(dataSourceProperties.getHikari().getConnectionTimeout());
    	config.setValidationTimeout(dataSourceProperties.getHikari().getValidationTimeout());
    	config.setMinimumIdle(dataSourceProperties.getHikari().getMinimumIdle());
        config.setIdleTimeout(dataSourceProperties.getHikari().getIdleTimeout());
        config.setMaxLifetime(dataSourceProperties.getHikari().getMaxLifetime());
        config.setReadOnly(dataSourceProperties.getHikari().isReadOnly());
        
    	return new HikariDataSource(config);
    }

    @Bean(name = FlowAppConstants.MAIN_DB_ENTITY_MANAGER)
    @Primary
    LocalContainerEntityManagerFactoryBean flowMainEntityManager(@Qualifier(FlowAppConstants.MAIN_DB_DATASOURCE) DataSource dataSource) {
    	 LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
         em.setDataSource(dataSource);
         em.setPackagesToScan(FlowAppConstants.FLOW_PACKAGE);
         em.setPersistenceUnitName(FlowAppConstants.MAIN_DB.toLowerCase());
         em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
         em.setPersistenceUnitPostProcessors(new PersistenceUnitPostProcessor() {
             @Override
             public void postProcessPersistenceUnitInfo(MutablePersistenceUnitInfo pui) {
                 List<String> managedClassNames = pui.getManagedClassNames();
                 managedClassNames.removeIf(className -> className.startsWith("com.wecoms24.flow.chemp"));
             }
         });
         
         Map<String, Object> properties = new HashMap<>();
         properties.put("hibernate.hbm2ddl.auto", dataSourceProperties.getJpa().getHibernate().getDdlAuto());
         properties.put("hibernate.show_sql", dataSourceProperties.getJpa().isShowSql());
         properties.put("hibernate.format_sql", dataSourceProperties.getJpa().getHibernate().isFormatSql());
         em.setJpaPropertyMap(properties);
         
         return em;
    }

    @Bean(name = FlowAppConstants.MAIN_DB_TRANSACTION_MANAGER)
    @Primary
    PlatformTransactionManager mainTransactionManager(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManagerFactory mainEntityManagerFactory) {
        return new JpaTransactionManager(mainEntityManagerFactory);
    }
}
