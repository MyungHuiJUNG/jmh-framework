package com.wecoms24.flow.chemp.sms;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.template.dao.mybatis.AbstractBaseUserCrudEntityMybatisDao;
import com.wecoms24.flow.user.User;

@Repository
@Primary
public class ChempSmsDaoImpl extends AbstractBaseUserCrudEntityMybatisDao<User, ChempSms, Integer, ChempSmsSearchParameter> implements ChempSmsDao {

	public ChempSmsDaoImpl(@Qualifier(FlowAppConstants.CHEMP_DB_SESSION_TEMPLATE) SqlSession sqlSession) {
		super(ChempSms.class, ChempSmsSearchParameter.class, sqlSession);
	}
}
