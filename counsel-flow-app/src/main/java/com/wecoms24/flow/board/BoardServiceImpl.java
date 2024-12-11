package com.wecoms24.flow.board;


import java.util.ArrayList;
import java.util.List;

import com.wecoms24.flow.core.file.FileMetaDataDao;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.file.FileMetaData;
import com.wecoms24.flow.core.file.FileMetaDataService;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

import lombok.AllArgsConstructor;


@Service
@Primary
@AllArgsConstructor
public class BoardServiceImpl extends AbstractBaseUserCrudEntityService<User, Board, Long, BoardDao, BoardSearchParameter> implements BoardService {
    private final FileMetaDataService fileService;
    private final FileMetaDataDao fileMetaDataDao;

    @Override
    public Board findOne(User loginUser, Long entityId) {
        Board board = super.findOne(loginUser, entityId);
        List<FileMetaData> files = fileMetaDataDao.findAllByResourceTypeAndResourceKey(FlowAppConstants.FILE_RESOURCE_TYPE_BOARD, entityId.toString());
        if (files != null && !files.isEmpty())
            board.setFiles(files);
        return board;
    }

    @Override
    public Board findOne(User loginUser, Board entity) {
        Board board = super.findOne(loginUser, entity);
        List<FileMetaData> files = fileMetaDataDao.findAllByResourceTypeAndResourceKey(FlowAppConstants.FILE_RESOURCE_TYPE_BOARD, entity.getEntityId().toString());
        if (files != null && !files.isEmpty())
            board.setFiles(files);
        return board;
    }

    @Transactional
    @Override
    public Board update(User loginUser, Board entity) {
        Board persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
        if (persistEntity == null) {
            throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
        }

        return super.update(loginUser, entity);
    }

    @Transactional
    @Override
    public void delete(User loginUser, Long entityId) {
        List<FileMetaData> files = fileMetaDataDao.findAllByResourceTypeAndResourceKey(FlowAppConstants.FILE_RESOURCE_TYPE_BOARD, entityId.toString());
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
}
