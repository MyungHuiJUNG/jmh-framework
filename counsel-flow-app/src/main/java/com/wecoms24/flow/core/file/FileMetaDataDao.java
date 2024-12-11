package com.wecoms24.flow.core.file;

import java.util.List;

import com.wecoms24.flow.core.template.dao.jpa.BaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

public interface FileMetaDataDao extends BaseUserCrudEntityJpaDao<User, FileMetaData, String, FileMetaDataSearchParameter> {
    List<FileMetaData> findAllByResourceTypeAndResourceKey(String resourceType, String resourceKey);

}
