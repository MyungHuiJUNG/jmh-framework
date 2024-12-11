package com.wecoms24.flow.core.database;

import java.io.IOException;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import com.wecoms24.flow.FlowAppConstants;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableConfigurationProperties(FlowChempDataSourceProperties.class)
@RequiredArgsConstructor
public class FlowChempDataSourceConfig {
	
	private final FlowChempDataSourceProperties dataSourceProperties;
    
	@Bean(name = FlowAppConstants.CHEMP_DB_DATASOURCE)
    DataSource flowChempDataSource() {
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
	
    @Bean(name = FlowAppConstants.CHEMP_DB_SESSION_FACTORY)
    SqlSessionFactory flowChempSqlSessionFactory(@Qualifier(FlowAppConstants.CHEMP_DB_DATASOURCE) DataSource dataSource) throws Exception {
    	SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        
        try {
            Resource[] mapperResources = new PathMatchingResourcePatternResolver().getResources("classpath:mybatis/" + FlowAppConstants.CHEMP_DB.toLowerCase() + "/*Mapper.xml");
            if (mapperResources != null && mapperResources.length > 0) {
                sessionFactory.setMapperLocations(mapperResources);
            }
        } catch (IOException e) {
        	log.warn("Mapper XML files not found, but continuing without them.");
        }

        return sessionFactory.getObject();
    }

    @Bean(name = FlowAppConstants.CHEMP_DB_SESSION_TEMPLATE)
    SqlSessionTemplate flowChempSqlSessionTemplate(@Qualifier(FlowAppConstants.CHEMP_DB_SESSION_FACTORY) SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
    
    @Bean(name = FlowAppConstants.CHEMP_DB_TRANSACTION_MANAGER)
    DataSourceTransactionManager chempTransactionManager(@Qualifier(FlowAppConstants.CHEMP_DB_DATASOURCE) DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
