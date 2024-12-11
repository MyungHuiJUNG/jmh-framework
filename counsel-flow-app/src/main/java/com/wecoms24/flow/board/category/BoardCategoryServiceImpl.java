package com.wecoms24.flow.board.category;

import com.wecoms24.flow.board.Board;
import com.wecoms24.flow.board.BoardSearchParameter;
import com.wecoms24.flow.board.BoardService;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.user.User;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@Primary
@AllArgsConstructor
public class BoardCategoryServiceImpl extends AbstractBaseUserCrudEntityService<User, BoardCategory, Long, BoardCategoryDao, BoardCategorySearchParameter> implements BoardCategoryService {
    private final BoardService boardService;

    @Transactional
    @Override
    public BoardCategory regist(User loginUser, BoardCategory entity) {
        checkDuplicateCode(entity.getCode());
        checkDuplicateName(entity.getName());

        BoardCategory parent = validateAndGetParentEntity(entity);
        entity.setParent(parent);
        entity.updatePath();
        return super.regist(loginUser, entity);
    }

    @Transactional
    @Override
    public List<BoardCategory> regist(User loginUser, List<BoardCategory> entities) {
        checkDuplicateCodesInList(entities);
        for (BoardCategory entity : entities) {
            checkDuplicateName(entity.getName());
            checkDuplicateCode(entity.getEntityId(), entity.getCode());
            BoardCategory parent = validateAndGetParentEntity(entity);
            entity.setParent(parent);
            entity.updatePath();
        }
        return super.regist(loginUser, entities);
    }

    @Transactional
    @Override
    public BoardCategory update(User loginUser, BoardCategory entity) {
        checkDuplicateCode(entity.getEntityId(), entity.getCode());
        checkDuplicateName(entity.getEntityId(), entity.getName());
        BoardCategory persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
        if (persistEntity == null) {
            throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
        }

        BoardCategory parent = validateAndGetParentEntity(entity);
        persistEntity.setParent(parent);
        persistEntity.setCode(entity.getCode());
        persistEntity.setName(entity.getName());
        persistEntity.setOrderNumber(entity.getOrderNumber());
        updatePathRecursive(persistEntity);

        return super.update(loginUser, entity);
    }

    @Transactional
    @Override
    public List<BoardCategory> update(User loginUser, List<BoardCategory> entities) {
        checkDuplicateCodesInList(entities);
        for (BoardCategory entity : entities) {
            checkDuplicateCode(entity.getEntityId(), entity.getCode());
            checkDuplicateName(entity.getEntityId(), entity.getName());
            BoardCategory persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
            if (persistEntity == null) {
                throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
            }

            BoardCategory parent = validateAndGetParentEntity(entity);
            persistEntity.setParent(parent);
            persistEntity.setCode(entity.getCode());
            persistEntity.setName(entity.getName());
            persistEntity.setOrderNumber(entity.getOrderNumber());
            updatePathRecursive(persistEntity);
        }

        return super.update(loginUser, entities);
    }

    @Transactional
    @Override
    public void delete(User loginUser, Long entityId) {
        BoardCategory deleteTarget = entityDao.findOneByEntityId(entityId);
        deleteRecursive(loginUser, deleteTarget);
    }

    @Transactional
    @Override
    public void delete(User loginUser, List<Long> entityIds) {
        for (Long entityId : entityIds) {
            delete(loginUser, entityId);
        }
    }

    private void checkDuplicateCode(String code) {
        if (existsByCode(null, code)) {
            throw new FlowException(FlowErrorCode.DUPLICATE_CODE);
        }
    }

    private void checkDuplicateCode(Long entityId, String code) {
        if (code == null || code.isEmpty())
            return;

        if (existsByCode(entityId, code)) {
            throw new FlowException(FlowErrorCode.DUPLICATE_CODE);
        }
    }

    private void checkDuplicateName(Long entityId, String name) {
        BoardCategorySearchParameter searchParameter = new BoardCategorySearchParameter();
        searchParameter.setIsSearchLike(false);
        searchParameter.getEntity().setName(name);
        searchParameter.setIsTopCode(false);
        BoardCategory foundEntity = entityDao.findOne(searchParameter);
        if (foundEntity != null && !Objects.equals(foundEntity.getEntityId(), entityId) && Objects.equals(foundEntity.getName(), name)) {
            throw new FlowException(FlowErrorCode.DUPLICATE_NAME);
        }
    }

    private void checkDuplicateName(String name) {
        BoardCategorySearchParameter searchParameter = new BoardCategorySearchParameter();
        searchParameter.setIsSearchLike(false);
        searchParameter.getEntity().setName(name);
        searchParameter.setIsTopCode(false);
        BoardCategory foundEntity = entityDao.findOne(searchParameter);
        if (foundEntity != null && Objects.equals(foundEntity.getName(), name)) {
            throw new FlowException(FlowErrorCode.DUPLICATE_NAME);
        }
    }

    private boolean existsByCode(Long entityId, String code) {
        BoardCategorySearchParameter searchParameter = new BoardCategorySearchParameter();
        searchParameter.getEntity().setCode(code);
        searchParameter.setIsTopCode(false);
        BoardCategory foundEntity = entityDao.findOne(searchParameter);
        if (entityId != null) {
            return foundEntity != null && !Objects.equals(foundEntity.getEntityId(), entityId);
        }
        return foundEntity != null;
    }

    private void checkDuplicateCodesInList(List<BoardCategory> entities) {
        Set<String> seenCodes = new HashSet<>();
        for (BoardCategory entity : entities) {
            String code = entity.getCode();
            if (seenCodes.contains(code)) {
                throw new FlowException(FlowErrorCode.DUPLICATE_CODE);
            }
            seenCodes.add(code);
        }
    }

    private BoardCategory validateAndGetParentEntity(BoardCategory entity) {
        BoardCategory parent = null;
        if (entity.getParent() != null && entity.getParent().getEntityId() != null && entity.getParent().getEntityId() != 0) {
            parent = entityDao.findOneByEntityId(entity.getParent().getEntityId());
            if (parent == null) {
                throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
            }

            if (Objects.equals(entity.getEntityId(), entity.getParent().getEntityId())) {
                throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
            }
        }

        return parent;
    }

    private void updatePathRecursive(BoardCategory baseEntity) {
        baseEntity.updatePath();

        List<BoardCategory> children = baseEntity.getChildren();
        if (children != null) {
            for (BoardCategory child : children) {
                updatePathRecursive(child);
            }
        }
    }

    private void deleteRecursive(User loginUser, BoardCategory baseEntity) {
        super.delete(loginUser, baseEntity.getEntityId());

        BoardSearchParameter boardSearchParameter = new BoardSearchParameter();
        boardSearchParameter.getEntity().setCategoryId(baseEntity.getEntityId());

        List<Board> boards = boardService.find(loginUser, boardSearchParameter);
        for (Board board : boards) {
        	board.setCategory(null);
            board.setCategoryId(null);
        }

        boardService.update(loginUser, boards);

        List<BoardCategory> children = baseEntity.getChildren();
        if (children != null) {
            for (BoardCategory child : children) {
                deleteRecursive(loginUser, child);
            }
        }
    }
}
