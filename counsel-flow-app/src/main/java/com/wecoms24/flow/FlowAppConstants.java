package com.wecoms24.flow;

public interface FlowAppConstants {
	public static final String FLOW_PACKAGE = "com.wecoms24.flow";
	public static final String REDIS_PACKAGE = FLOW_PACKAGE + ".redis";
	public static final String REDIS_ENABLE = REDIS_PACKAGE + ".enable";
	public static final String REDIS_PUB_SUB_ENABLE = REDIS_PACKAGE + ".broadcaster.enable";
	public static final String FILE_PACKAGE = FLOW_PACKAGE + ".core.file";
	public static final String CORE_TEMPLATE_PACKAGE = FLOW_PACKAGE + ".core.template";
	public static final String SECURITY_ANT_MACHERS_YAML_KEY = "${" + FLOW_PACKAGE + ".security.ant-machers:#{null}}";
	public static final String EMPTY_PATH = "/";
	public static final String LOGIN_PATH = "/login";
	public static final String ERROR_PATH = "/error";
	public static final String INDEX_HTML = "/index.html";
	public static final String WEBSOCKET_PATH = "/ws";
	public static final String WEBSOCKET_BROCKER_TOPIC = "/topic";
	public static final String WEBSOCKET_BROCKER_QUEUE = "/queue";
	public static final String WEBSOCKET_PREFIX_PATH = "/flow";
	
	public static final String HEADER_KEY_X_FORWARDED_FOR = "X-Forwarded-For";
	public static final String HEADER_KEY_PROXY_CLIENT_IP = "Proxy-Client-IP";
	public static final String HEADER_KEY_WL_PROXY_CLIENT_IP = "WL-Proxy-Client-IP";
	public static final String HEADER_KEY_HTTP_CLIENT_IP = "HTTP_CLIENT_IP";
	public static final String HEADER_KEY_HTTP_X_FORWARDED = "HTTP_X_FORWARDED_FOR";
	
	public static final String REG_EXP_ALPHABET_NUMBER = "^[a-zA-Z0-9_-]*$";
	public static final String REG_EXP_ALPHABET_NUMBER_ERROR_KEY = "com.wecoms24.flow.wrong-code";
	
	public static final String LOCALHOST_IPV4 = "127.0.0.1";
	public static final String LOCALHOST_IPV6 = "0:0:0:0:0:0:0:1";
	
	public static final String EXPIRED_EVENT_PATTERN = "__keyevent@*__:expired";
	public static final String EXPIRED_SPACE_PATTERN = "__keyspace@*__:expired";
	
	public static final String DATABASE_PREFIX = "flow";
	public static final String ENTITY_MANAGER_SUFFIX = "EntityManager";
	public static final String TRANSACTION_MANAGER_SUFFIX = "TransactionManager";
	public static final String DATASOURCE_SUFFIX = "DataSource";
	public static final String SQL_SESSION_FACTORY_SUFFIX = "SqlSessionFactory";
	public static final String SQL_SESSION_TEMPLATE_SUFFIX = "SqlSessionTemplate";
	
	public static final String SQL_ERROR_DUPLICATE_ENTRY= "Duplicate entry";
	public static final String SQL_UNIQUE_NM_SHORT_CUT_UNIQUE= "SHORT_CUT_UNIQUE";
	public static final String SQL_ONE_TO_ONE_SCRIPT= "returning SCRIPT_EID";
	
	public static final String MAIN_DB = "Main";
	public static final String MAIN_DB_PROPERTIES = "spring.datasource.main";
	public static final String MAIN_DB_ENTITY_MANAGER = DATABASE_PREFIX + MAIN_DB + ENTITY_MANAGER_SUFFIX;
	public static final String MAIN_DB_TRANSACTION_MANAGER = DATABASE_PREFIX + MAIN_DB + TRANSACTION_MANAGER_SUFFIX;
	public static final String MAIN_DB_DATASOURCE = DATABASE_PREFIX + MAIN_DB + DATASOURCE_SUFFIX;
	public static final String MAIN_DB_SESSION_FACTORY = DATABASE_PREFIX + MAIN_DB + SQL_SESSION_FACTORY_SUFFIX;
	public static final String MAIN_DB_SESSION_TEMPLATE = DATABASE_PREFIX + MAIN_DB + SQL_SESSION_TEMPLATE_SUFFIX;
	
	public static final String CHEMP_PACKAGE = FLOW_PACKAGE + ".chemp";
	public static final String CHEMP_DB = "Chemp";
	public static final String CHEMP_DB_PROPERTIES = "spring.datasource.chemp";
	public static final String CHEMP_DB_ENTITY_MANAGER = DATABASE_PREFIX + CHEMP_DB + ENTITY_MANAGER_SUFFIX;
	public static final String CHEMP_DB_TRANSACTION_MANAGER = DATABASE_PREFIX + CHEMP_DB + TRANSACTION_MANAGER_SUFFIX;
	public static final String CHEMP_DB_DATASOURCE = DATABASE_PREFIX + CHEMP_DB + DATASOURCE_SUFFIX;
	public static final String CHEMP_DB_SESSION_FACTORY = DATABASE_PREFIX + CHEMP_DB + SQL_SESSION_FACTORY_SUFFIX;
	public static final String CHEMP_DB_SESSION_TEMPLATE = DATABASE_PREFIX + CHEMP_DB + SQL_SESSION_TEMPLATE_SUFFIX;
	
	public static final String FAVICON = "/favicon.ico";
	public static final String ASTERISK = "*";
	public static final String HYPHEN = "-";
	public static final String COMMA = ",";
	public static final String COLON = ":";
	public static final String ALL_ASTERISK = "/**";
	public static final String KOREAN_LOCALE = "ko";
	public static final String LANGUAGE = "lang";
	public static final String MESSAGES_CLASS_PATH = "classpath:messages/messages";
	public static final String STATIC_CLASS_PATH = "classpath:/static/";
	public static final String UTF_8_STRING_VALUE = "UTF-8";
	public static final String ALL_RESOURCE_CSS = "/css" + ALL_ASTERISK;
	public static final String ALL_RESOURCE_IMAGES = "/images" + ALL_ASTERISK;
	public static final String ALL_RESOURCE_JS = "/js" + ALL_ASTERISK;
	public static final String ALL_RESOURCE_ASSETS = "/assets" + ALL_ASTERISK;
	public static final String ALL_RESOURCE_ICONS = "/icons" + ALL_ASTERISK;
	
	public static final String LOCAL_ADDRESS = "localhost";
	public static final Integer REDIS_BASE_PORT = 6379;
	public static final String ALL_METHODS_REG_EXP = "GET|PUT|POST|UPDATE|TRACE|OPTION|HEAD|PATCH";
	public static final String DATE_FORMAT_HEADER_KEY = "date-format";
	public static final String RESPONSE_DATE_FORMAT_HEADER_KEY = "response-date-format";
	public static final String DATE_FORMAT_SPLIT_SYMBOL = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT_SPLIT_SYMBOL = "yyyy-MM-dd HH:mm:ss";
    public static final String DATETIME_FORMAT_WITHOUT_SYMBOL = "yyyyMMddHHmmss";
    public static final String AUTHORIZATION_HEADER_KEY = "Authorization";
    public static final String AUTH_USER_AUDITOR_CLASS_NAME = "authUserAuditorAware";
    public static final String JWT_TYPE = "Bearer";
    public static final String JWT_CLAIM_KEY = "auth";
    public static final String EMPTY_STRING = " ";
    public static final String TRUE_STRING_VALUE = "true";
    public static final String FALSE_STRING_VALUE = "false";
    public static final String Y_STRING_VALUE = "Y";
    public static final String N_STRING_VALUE = "N";
    public static final String USE_TYPE_CODE_USE = "USE";
    public static final String USE_TYPE_CODE_UNUSE = "UNUSE";
    public static final String GUEST_ROLE_GROUP = "GUEST";
    public static final String SUPER_ADMIN_ROLE_GROUP_NAME = "Super Admin";
    public static final String SUPER_ADMIN_ID = "admin";
    public static final String SUPER_ADMIN_NAME = "관리자";
    public static final String SUPER_ADMIN_PWD = "admin";
    public static final String INIT_PWD = "12345678";
    public static final String ENCODING_ALGORITM = "SHA-256";
    public static final String KEY_ACCESS_TOKEN = "accessToken";
    public static final String KEY_REFRESH_TOKEN = "refreshToken";
    public static final String SUFFIX_KEY_ACCESS_TOKEN = ":" + KEY_ACCESS_TOKEN;
    public static final String SUFFIX_KEY_REFRESH_TOKEN = ":" + KEY_REFRESH_TOKEN;
    public static final String PREFIX_KEY_BLACKLIST_TOKEN = "blacklist:";
    
    public static final String REST_API_PREFIX = "/rest/api/v1";
    public static final String REST_API_AUTH = REST_API_PREFIX + "/auth";
    public static final String REST_API_USER = REST_API_PREFIX + "/user/users";
    public static final String REST_API_SETTINGS_CODE = REST_API_PREFIX + "/settings/code/codes";
    public static final String REST_API_SETTINGS_MENU = REST_API_PREFIX + "/settings/menu/menus";
    public static final String REST_API_SETTINGS_ROLE_GROUP = REST_API_PREFIX + "/settings/role-group/role-groups";
    public static final String REST_API_SETTINGS_ROLE = REST_API_PREFIX + "/settings/role/roles";
    public static final String REST_API_SETTINGS_VARIABLE = REST_API_PREFIX + "/settings/system/variable/variables";
    public static final String REST_API_SETTINGS_AUTH = REST_API_PREFIX + "/settings/role-group/{roleGroupEntityId}";
    public static final String REST_API_COUNSEL_TYPE = REST_API_PREFIX + "/counsel/type/types";
    public static final String REST_API_ORGANIZATION = REST_API_PREFIX + "/organization/organizations";
    public static final String REST_API_FILE = REST_API_PREFIX + "/file/files";
    public static final String REST_API_FILE_DYNAMIC_URL = "${com.wecoms24.flow.core.file.url-root-path:" + REST_API_FILE + "}";
    public static final String REST_API_NOTICE = REST_API_PREFIX + "/notice/notices";
    public static final String REST_API_BOARD = REST_API_PREFIX + "/board/boards";
    public static final String REST_API_REPLY = REST_API_PREFIX + "/board/replies";
    public static final String REST_API_CATEGORY = REST_API_PREFIX + "/board/categories";
    public static final String REST_API_TASK_REQUEST = REST_API_PREFIX + "/task/request/requests";
    public static final String REST_API_TICKET = REST_API_PREFIX + "/ticket/tickets";
    public static final String REST_API_TICKET_CHANNEL = REST_API_PREFIX + "/ticket/channels";
    public static final String REST_API_TICKET_HISTORY = REST_API_PREFIX + "/ticket/histories";
    public static final String REST_API_CALLBACK_TICKET_HISTORY = REST_API_PREFIX + "/callback/ticket/tickets";
    public static final String REST_API_CUSTOMER_INFO = REST_API_PREFIX + "/customer-info/customer-infos";
    public static final String REST_API_NOTIFICATION = REST_API_PREFIX + "/notification/notifications";
    public static final String REST_API_MESSAGE = REST_API_PREFIX + "/message/messages";
    public static final String REST_API_PERSONAL_COMMAND = REST_API_PREFIX + "/users/{userEntityId}/command/commands";
    public static final String REST_API_PERSONAL_SHORTCUT_KEY = REST_API_PREFIX + "/commands/{commandEntityId}/short-cut-key/short-cut-keys";
    public static final String REST_API_ACCESS_LOG = REST_API_PREFIX + "/access-log/access-logs";
    public static final String REST_API_SCRIPT = REST_API_PREFIX + "/script/scripts";
    public static final String REST_API_SITE_LINK = REST_API_PREFIX + "/site-link/site-links";
    public static final String REST_API_CALLBACK_TATGET_GROUP = REST_API_PREFIX + "/callback/target-group/target-groups";
    public static final String REST_API_CHEMP_SMS = REST_API_PREFIX + "/chemp/sms";

    public static final String FILE_RESOURCE_TYPE_NOTICE = "notice";
    public static final String FILE_RESOURCE_TYPE_BOARD = "board";
    public static final String FILE_RESOURCE_TYPE_MENU_ICON = "MENU_ICON";
    public static final String FILE_RESOURCE_TYPE_MENU_QUICK_ICON = "MENU_QUICK_ICON";
    
    public static final String FILE_RESOURCE_TYPE_SITE_LINK_ICON = "SITE_LINK_ICON";
    
    public static final String MENU_REMOVE_ICON_TYPE_ALL = "REMOVE_ICON_ALL";
    public static final String MENU_REMOVE_ICON_TYPE_BASE_ICON = "REMOVE_ICON_BASE";
    public static final String MENU_REMOVE_ICON_TYPE_QUICK_ICON = "REMOVE_ICON_QUICK";

    public static final String NAME_TO_COPY_SUFFIX = "_복사";
    
    public static final String EXCEL_EXTENSION = ".xlsx";
    public static final String EXCEL_FONT_NAME_ARIAL = "Arial";
    
    public static final String TICKET_PROCESS_STATUS_SYSTEM_CODE = "TICKET_PROCESS_STATUS";
    public static final String TICKET_TYPE_SYSTEM_CODE = "TICKET_TYPE";
    public static final String TICKET_COUNSEL_CATEGORY_SYSTEM_CODE = "COUNSEL_CATEGORY";

    public static final String TICKET_TYPE_COUNSEL = "COUNSEL_TICKET";
    public static final String TICKET_TYPE_CAMPAIGN = "CAMPAIGN_TICKET";
    public static final String TICKET_TYPE_CALLBACK = "CALLBACK_TICKET";
    
    public static final String TICKET_STATUS_UNPROCESSED = "TICKET_UNPROCESSED";
    public static final String TICKET_STATUS_IN_PROCESS = "TICKET_IN_PROCESS";
    public static final String TICKET_STATUS_COMPLETED = "TICKET_COMPLETED";
    
    public static final String TICKET_EXCEL_FILA_NAME_PREFIX = "Tickets_";
    public static final String TICKET_EXCEL_SHEET_NAME = "티켓목록";
    
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_EID = "티켓번호";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_PROCESS_CD = "처리상태";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_TYPE_CD = "티켓유형";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_CATEGORY_CD = "상담구분";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_CREATED_DT = "발행일시";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_COUNSEL_TYPE_L = "상담유형(대)";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_COUNSEL_TYPE_M = "상담유형(중)";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_COUNSEL_TYPE_S = "상담유형(소)";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_TEL = "전화번호";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_MANAGER = "담당자";
    public static final String TICKET_EXCEL_DOWNLOAD_COLUMN_CREATOR = "보고자";
    
    public static final String REDIS_TOPIC_REGIST_NOTICE = "/topic/regist-notice";
    public static final String REDIS_TOPIC_TRANSMIT_TICKET = "/topic/transmit-ticket";
    public static final String REDIS_TOPIC_TICKET_BOARD = "/topic/ticket-board";
    public static final String REDIS_TOPIC_TICKET_RESERVATION = "/topic/ticket-reservation";
    public static final String REDIS_TOPIC_SEND_MESSAGE = "/topic/send-message";
    public static final String REDIS_TOPIC_CALLBACK_TICKET = "/topic/callback-ticket";
    public static final String REDIS_TOPIC_REQUEST_INIT_PWD = "/topic/request/init-password";
    
    public static final String NOTIFICATION_TYPE_TICKET = "NOTIFI_TYPE_TICKET";
    public static final String NOTIFICATION_TYPE_NOTICE = "NOTIFI_TYPE_NOTICE";
    public static final String NOTIFICATION_TYPE_MESSAGE = "NOTIFI_TYPE_MESSAGE";
    public static final String NOTIFICATION_TYPE_REQUEST = "NOTIFI_TYPE_REQUEST";
    public static final String NOTIFICATION_SUB_TYPE_ASSIGN_CALLBACK = "NOTIFI_SUB_TYPE_ASSIGN_CALLBACK";
    public static final String NOTIFICATION_SUB_TYPE_TRANSMIT_TICKET = "NOTIFI_SUB_TYPE_TRANSMIT_TICKET";
    public static final String NOTIFICATION_SUB_TYPE_RESERVATION_TICKET = "NOTIFI_SUB_TYPE_RESERVATION_TICKET";
    public static final String NOTIFICATION_SUB_TYPE_NOTICE = "NOTIFI_SUB_TYPE_NOTICE";
    public static final String NOTIFICATION_SUB_TYPE_INIT_PWD = "NOTIFI_SUB_TYPE_INIT_PWD";
    public static final String NOTIFICATION_SUB_TYPE_MESSAGE = "NOTIFI_SUB_TYPE_MESSAGE";
}
