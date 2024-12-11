package com.wecoms24.flow.core.redis;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.access.AccessLog;
import com.wecoms24.flow.auth.access.AccessLogDao;
import com.wecoms24.flow.auth.access.AccessType;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserDao;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RedisKeyExpirationListener implements MessageListener {
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private AccessLogDao accessLogDao;

	@Override
	public void onMessage(Message message, byte[] pattern) {
		String expiredKey = message.toString();
		log.info("ExpiredKey: " + expiredKey);
		if (expiredKey == null || expiredKey.isEmpty() || expiredKey.contains(FlowAppConstants.KEY_ACCESS_TOKEN) == false)
			return;
		
		String[] split = expiredKey.split(FlowAppConstants.COLON);
		if (split.length < 3)
			return;
		
		String userId = split[0];
		String key = split[1];
		String clientIpAddress = split[2];
		
		User user = userDao.findById(userId);
		if (FlowAppConstants.KEY_ACCESS_TOKEN.equalsIgnoreCase(key) == false || user == null)
			return;
		
		
		AccessLog accessLog = new AccessLog();
		accessLog.setAccessType(AccessType.ACCESS_LOGOUT);
		accessLog.setIsAutoAccess(true);
        accessLog.setUser(user);
        accessLog.setClientIpAddress(clientIpAddress);
        accessLog.setAccessDate(new Date());
        accessLogDao.create(accessLog);
	}
}
