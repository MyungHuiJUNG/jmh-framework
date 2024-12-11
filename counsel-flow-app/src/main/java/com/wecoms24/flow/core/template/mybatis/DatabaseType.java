package com.wecoms24.flow.core.template.mybatis;

public enum DatabaseType {
	DEFAULT,
	MY_SQL,
	ORACLE,
	MS_SQL;

	public static DatabaseType from(String databaseTypeString) {
		DatabaseType databaseType = null;
		switch (databaseTypeString) {
		case "mysql":
		case "mariadb":
			databaseType = DatabaseType.MY_SQL;
			break;
		case "oracle":
			databaseType = DatabaseType.ORACLE;
			break;
		case "sqlserver":
			databaseType = DatabaseType.MS_SQL;
			break;
		default:
			databaseType = DatabaseType.DEFAULT;
			break;
		}
		return databaseType;
	}
}
