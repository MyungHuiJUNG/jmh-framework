package com.wecoms24.flow.counsel.notice;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.file.FileMetaData;
import com.wecoms24.flow.core.file.FileMetaDataDao;
import com.wecoms24.flow.core.file.FileMetaDataService;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.core.websocket.FlowRedisMessageListener;
import com.wecoms24.flow.core.websocket.FlowRedisMessageSubscriber;
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.user.User;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@Primary
public class NoticeServiceImpl extends AbstractBaseUserCrudEntityService<User, Notice, Long, NoticeDao, NoticeSearchParameter> implements NoticeService, FlowRedisMessageListener, InitializingBean {

	@Autowired
	private FlowRedisMessageSubscriber subscriber;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
    private FileMetaDataService fileService;

    @Autowired
    private FileMetaDataDao fileMetaDataDao;
    
    @Override
	public void afterPropertiesSet() throws Exception {
    	subscriber.addFlowRedisMessageListeners(this);
	}

    @Override
    public Notice findOne(User loginUser, Long entityId) {
        Notice notice = super.findOne(loginUser, entityId);
        List<FileMetaData> files = fileMetaDataDao.findAllByResourceTypeAndResourceKey(FlowAppConstants.FILE_RESOURCE_TYPE_NOTICE, entityId.toString());
        if (files != null && !files.isEmpty())
            notice.setFiles(files);
        return notice;
    }

    @Override
    public Notice findOne(User loginUser, Notice entity) {
        Notice notice = super.findOne(loginUser, entity);
        List<FileMetaData> files = fileMetaDataDao.findAllByResourceTypeAndResourceKey(FlowAppConstants.FILE_RESOURCE_TYPE_NOTICE, entity.getEntityId().toString());
        if (files != null && !files.isEmpty())
            notice.setFiles(files);
        return notice;
    }
    
    @Transactional
    @Override
	public Notice regist(User loginUser, Notice entity) {
		return super.regist(loginUser, entity);
	}

	@Transactional
    @Override
    public Notice update(User loginUser, Notice entity) {
        Notice persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
        if (persistEntity == null) {
            throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
        }
        return super.update(loginUser, entity);
    }

    @Transactional
    @Override
    public void delete(User loginUser, Long entityId) {
        List<FileMetaData> files = fileMetaDataDao.findAllByResourceTypeAndResourceKey(FlowAppConstants.FILE_RESOURCE_TYPE_NOTICE, entityId.toString());
        if (files != null && !files.isEmpty()) {
            List<String> entityIds = new ArrayList<>();
            for (FileMetaData file : files) {
                entityIds.add(file.getEntityId());
            }
            fileService.delete(loginUser, entityIds);
        }
        super.delete(loginUser, entityId);
    }

    @Transactional
    @Override
    public void delete(User loginUser, List<Long> entityIds) {
        for (Long entityId : entityIds) {
            delete(loginUser, entityId);
        }
    }

	@Override
	public void onMessageByRedis(String topic, FlowWebSocketMessage webSocketMessage) {
		if (FlowAppConstants.REDIS_TOPIC_REGIST_NOTICE.equalsIgnoreCase(topic) == false || Notice.class.getName().equalsIgnoreCase(webSocketMessage.getClassName()) == false)
			return;
		
		try {
            ObjectMapper objectMapper = new ObjectMapper();
            messagingTemplate.convertAndSend(topic, objectMapper.writeValueAsString(webSocketMessage));
        } catch (Exception e) {
            e.printStackTrace();
        }
		
	}
}
