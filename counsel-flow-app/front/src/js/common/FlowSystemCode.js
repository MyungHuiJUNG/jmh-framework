export default Object.freeze({
  CODES: {
    CODE_TYPE: "CODE_TYPE",
    MENU_ACTION_TYPE: "MENU_ACTION_TYPE",
    USE_CD: "USE_CD",
    BOARD_TYPE_CD: "BOARD_TYPE_CD",
    TICKET_TYPE: "TICKET_TYPE",
    TICKET_PROCESS_STATUS: "TICKET_PROCESS_STATUS",
    CHANNEL_TYPE: "CHANNEL_TYPE",
    CHANNEL_CONTACT_TYPE: "CHANNEL_CONTACT_TYPE",
    NOTIFICATION_TYPE: "NOTIFICATION_TYPE",
    NOTIFICATION_SUB_TYPE: "NOTIFICATION_SUB_TYPE",
    COUNSEL_CATEGORY: "COUNSEL_CATEGORY",
    CUSTOMER_TYPE: "CUSTOMER_TYPE",
    COMMAND_TYPE: "COMMAND_TYPE",
    SHORT_CUT_KEY_TYPE: "SHORT_CUT_KEY_TYPE",
    ACCESS_TYPE_CODE: "ACCESS_TYPE_CODE",
    MESSAGE_TYPE: "MESSAGE_TYPE",
  },

  CODE_TYPE: {
    SYSTEM: "SYSTEM",
    SERVICE: "SERVICE",
  },

  MENU_ACTION_TYPE: {
    TAB: "TAB",
    POPUP: "POPUP",
    WINDOW: "WINDOW",
    NONE: "NONE",
  },

  USE_CD: {
    USE: "USE",
    UNUSE: "UNUSE",
  },

  BOARD_TYPE_CD: {
    NOTICE: "NOTICE_BOARD",
    FREE: "FREE_BOARD",
  },

  TICKET_TYPE: {
    COUNSEL_TICKET: "COUNSEL_TICKET",
    CAMPAIGN_TICKET: "CAMPAIGN_TICKET",
    CALLBACK_TICKET: "CALLBACK_TICKET",
  },

  TICKET_PROCESS_STATUS: {
    UNPROCESSED: "TICKET_UNPROCESSED",
    IN_PROCESS: "TICKET_IN_PROCESS",
    COMPLETED: "TICKET_COMPLETED",
  },

  CHANNEL_TYPE: {
    VOICE: "VOICE",
    CHAT: "CHAT",
    E_MAIL: "E_MAIL",
  },

  CHANNEL_CONTACT_TYPE: {
    INBOUND: "INBOUND",
    OUTBOUND: "OUTBOUND",
    MANUAL: "MANUAL",
  },

  NOTIFICATION_TYPE: {
    TICKET: "NOTIFI_TYPE_TICKET",
    NOTICE: "NOTIFI_TYPE_NOTICE",
    MESSAGE: "NOTIFI_TYPE_MESSAGE",
    REQUEST: "NOTIFI_TYPE_REQUEST",
  },

  NOTIFICATION_SUB_TYPE: {
    ASSIGN_CALLBACK: "NOTIFI_SUB_TYPE_ASSIGN_CALLBACK",
    TRANSMIT_TICKET: "NOTIFI_SUB_TYPE_TRANSMIT_TICKET",
    RESERVATION_TICKET: "NOTIFI_SUB_TYPE_RESERVATION_TICKET",
    NOTICE: "NOTIFI_SUB_TYPE_NOTICE",
    MESSAGE: "NOTIFI_SUB_TYPE_MESSAGE",
    INIT_PWD: "NOTIFI_SUB_TYPE_INIT_PWD",
  },

  COMMAND_TYPE: {
    COUNSEL_TYPE: "COMMAND_COUNSEL_TYPE",
    TEXT: "COMMAND_TEXT",
  },

  SHORT_CUT_KEY_TYPE: {
    SPECIFIC: "SHORT_CUT_SPECIFIC",
    DIGIT: "SHORT_CUT_DIGIT",
    KEY: "SHORT_CUT_KEY",
  },

  SHORT_CUT_SPECIFIC: {
    SHIFT: "SPECIFIC_SHIFT",
    ALT: "SPECIFIC_ALT",
    CTRL: "SPECIFIC_CTRL",
  },

  ACCESS_TYPE_CODE: {
    LOGIN: "ACCESS_LOGIN",
    LOGOUT: "ACCESS_LOGOUT",
  },

  MESSAGE_TYPE: {
    SEND_MESSAGE: "SEND_MESSAGE",
    RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
  },
});
