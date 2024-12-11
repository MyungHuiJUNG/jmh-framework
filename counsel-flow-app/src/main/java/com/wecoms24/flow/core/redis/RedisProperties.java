package com.wecoms24.flow.core.redis;

import com.wecoms24.flow.FlowAppConstants;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

@ConfigurationProperties(prefix = RedisProperties.PREFIX)
@Getter
@Setter
public class RedisProperties {
	public static final String PREFIX = FlowAppConstants.REDIS_PACKAGE;
	
	private boolean enable = false;
	private ClientMode mode = ClientMode.STANDALONE;
	private int database = 0;
	private String url;
	private String host = FlowAppConstants.LOCAL_ADDRESS;
	private String username;
	private String password;
	private int port = FlowAppConstants.REDIS_BASE_PORT;
	private Duration timeout;
	private Duration connectTimeout;
	private String clientName;
	private ClientType clientType;
	private Cluster cluster;
	private Broadcaster broadcaster = new Broadcaster();
	
	public enum ClientMode {
		STANDALONE,
		CLUSTER
	}
	
	public enum ClientType {
		LETTUCE,
		JEDIS
	}
	
	@Getter
	@Setter
	public static class Cluster {
		private List<String> nodes;
		private Integer maxRedirects;
	}
	
	@Getter
	@Setter
	public static class Broadcaster {
		private boolean enable = false;
		private List<String> topics;
	}
}
