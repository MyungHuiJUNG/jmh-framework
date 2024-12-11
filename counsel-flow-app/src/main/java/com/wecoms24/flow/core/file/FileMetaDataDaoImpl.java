package com.wecoms24.flow.core.file;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.jpa.AbstractBaseUserCrudEntityJpaDao;
import com.wecoms24.flow.user.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Repository
@Primary
public class FileMetaDataDaoImpl extends AbstractBaseUserCrudEntityJpaDao<User, FileMetaData, String, FileMetaDataSearchParameter> implements FileMetaDataDao {

    public FileMetaDataDaoImpl(@Qualifier(FlowAppConstants.MAIN_DB_ENTITY_MANAGER) EntityManager entityManager) {
        super(FileMetaData.class, FileMetaDataSearchParameter.class, entityManager);
        setRealDeleteDefaultValue(true);
    }

    @Override
    public List<FileMetaData> findAllByResourceTypeAndResourceKey(String resourceType, String resourceKey) {
        String query = "SELECT t1 FROM FileMetaData t1"
                + " WHERE t1.resourceType = :resourceType"
                + " AND t1.resourceKey = :resourceKey";

        TypedQuery<FileMetaData> typeQuery = getEntityManager().createQuery(query, FileMetaData.class);
        typeQuery.setParameter("resourceType", resourceType);
        typeQuery.setParameter("resourceKey", resourceKey);
        List<FileMetaData> results = typeQuery.getResultList();
        if (results == null || results.isEmpty())
            return null;

        return results;
    }
}
