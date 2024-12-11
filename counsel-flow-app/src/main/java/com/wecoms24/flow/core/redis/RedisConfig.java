package com.wecoms24.flow.core.redis;

import java.time.Duration;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisClusterConfiguration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.websocket.FlowRedisMessageSubscriber;

import io.lettuce.core.api.StatefulRedisConnection;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(RedisProperties.class)
public class RedisConfig {
    
    @Bean
    @ConditionalOnProperty(name = FlowAppConstants.REDIS_ENABLE, havingValue = FlowAppConstants.TRUE_STRING_VALUE, matchIfMissing = false)
    RedisProperties redisProperties() {
        return new RedisProperties();
    }

    @Bean
    @ConditionalOnProperty(name = FlowAppConstants.REDIS_ENABLE, havingValue = FlowAppConstants.TRUE_STRING_VALUE)
    LettuceConnectionFactory lettuceConnectionFactory(RedisProperties redisProperties) {
        if (redisProperties != null && redisProperties.isEnable()) {
        	GenericObjectPoolConfig<StatefulRedisConnection<String, String>> genericObjectPoolConfig = new GenericObjectPoolConfig<>();
            genericObjectPoolConfig.setMaxTotal(50);
            genericObjectPoolConfig.setMinIdle(10);
            genericObjectPoolConfig.setMaxIdle(30);
            
        	LettucePoolingClientConfiguration clientConfig = LettucePoolingClientConfiguration.builder()
        			.poolConfig(genericObjectPoolConfig)
        		    .commandTimeout(Duration.ofSeconds(10))
        		    .shutdownTimeout(Duration.ofMillis(100))
        		    .build();
        	
        	log.info("RedisURL: " + redisProperties.getHost() + ":" + redisProperties.getPort());
        	
            switch (redisProperties.getMode()) {
                case STANDALONE: {
                    RedisStandaloneConfiguration redisConfiguration = new RedisStandaloneConfiguration();
                    redisConfiguration.setHostName(redisProperties.getHost());
                    redisConfiguration.setPort(redisProperties.getPort());
                    redisConfiguration.setUsername(redisProperties.getUsername());
                    redisConfiguration.setPassword(redisProperties.getPassword());
                    return new LettuceConnectionFactory(redisConfiguration, clientConfig);
                }
                case CLUSTER: {
                    RedisClusterConfiguration clusterConfig = new RedisClusterConfiguration(redisProperties.getCluster().getNodes());
                    clusterConfig.setUsername(redisProperties.getUsername());
                    clusterConfig.setPassword(redisProperties.getPassword());
                    return new LettuceConnectionFactory(clusterConfig, clientConfig);
                }
                default:
                    return null;
            }
        } else {
        	log.info("Redis is Null...");
        }
        return null;
    }

    @Bean
    @ConditionalOnProperty(name = FlowAppConstants.REDIS_ENABLE, havingValue = FlowAppConstants.TRUE_STRING_VALUE)
    RedisTemplate<?, ?> redisTemplate(LettuceConnectionFactory lettuceConnectionFactory) {
        if (lettuceConnectionFactory == null) {
            return null;
        }

        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setConnectionFactory(lettuceConnectionFactory);
        return redisTemplate;
    }
    
    @Bean
    @ConditionalOnProperty(name = FlowAppConstants.REDIS_PUB_SUB_ENABLE, havingValue = FlowAppConstants.TRUE_STRING_VALUE)
    RedisMessageListenerContainer redisMessageListenerContainer(LettuceConnectionFactory lettuceConnectionFactory, MessageListenerAdapter listenerAdapter, RedisKeyExpirationListener expirationListenerAdapter) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(lettuceConnectionFactory);

        for (String topic : redisProperties().getBroadcaster().getTopics()) {
        	log.info("Add RedisTopic: " + topic);
            container.addMessageListener(listenerAdapter, new ChannelTopic(topic));
        }
        
        container.addMessageListener(expirationListenerAdapter, new PatternTopic(FlowAppConstants.EXPIRED_EVENT_PATTERN));
        container.addMessageListener(expirationListenerAdapter, new PatternTopic(FlowAppConstants.EXPIRED_SPACE_PATTERN));

        return container;
    }

    @Bean
    @ConditionalOnProperty(name = FlowAppConstants.REDIS_PUB_SUB_ENABLE, havingValue = FlowAppConstants.TRUE_STRING_VALUE)
    MessageListenerAdapter listenerAdapter(FlowRedisMessageSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber);
    }
}
