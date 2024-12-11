/********************************************************************************************
 * EMC Logic
 */
var EMC_EVT_AGENT_STATE = "AGENT_STATE";
var EMC_EVT_QUEUING = "QUEUING";
var EMC_EVT_RESERVED = "RESERVED";
var EMC_EVT_ALERTING = "ALERTING";
var EMC_EVT_CONNECTED = "CONNECTED";
var EMC_EVT_ACW = "ACW";
var EMC_EVT_RELEASE = "RELEASE";
var EMC_EVT_ETS_ACCPET = "ETS_ACCPET";
var EMC_EVT_CONTACT_STATE = "CONTACT_STATE";
var EMC_EVT_CONTACT_INFO = "CONTACT_INFO";
var EMC_EVT_ETS_RELEASE = "ETS_RELEASE";
var EMC_EVT_SET_STATUS = "SET_STATUS";

var EMC_CMD_LOGOUT = "LOGOUT";
var EMC_RET_SUCCESS = "0";

function EmcClient() {
    this.EMC_LIB_VERSION = "1.0.5";
    this.EMC_BUILD_DATE = "2020-07-07 14:33";

    this.OnEMCAgentEvent = undefined;   // 상담원 이벤트 콜백
    this.OnEMCCallEvent = undefined;    // Call 이벤트 콜백
    this.OnEMCErrorEvent = undefined;   // Error 이벤트 콜백 (상담원/콜 관련)
    this.OnEMCResultEvent = undefined;  // Result 결과 값 이벤트 콜백
    this.OnEMCLogEvent = undefined;     // LogEvent

    this.emc_agentState = "UNKNOWN";
}

EmcClient.prototype = {

    EMC_SetOnAgentEvent: function (OnEvt) {
        this.OnEMCAgentEvent = OnEvt;
    },

    EMC_SetOnCallEvent: function (OnEvt) {
        this.OnEMCCallEvent = OnEvt;
    },

    EMC_SetOnErrorEvent: function (OnEvt) {
        this.OnEMCErrorEvent = OnEvt;
    },

    EMC_SetOnResultEvent: function (OnEvt) {
        this.OnEMCResultEvent = OnEvt;
    },

    EMC_SetOnLogEvent: function (OnEvt) {
        this.OnEMCLogEvent = OnEvt;
    },

    OnEmcEvent: function (message) {
        var dataObj = JSON.parse(message);
        var cmd = dataObj.cmd;

        switch (cmd) {
            case EMC_EVT_AGENT_STATE:
                if(dataObj) {
                    if(dataObj.ret === EMC_RET_SUCCESS) {
                        if(dataObj.msg.state) {
                            this.emc_agentState = dataObj.msg.state;
                        }
                    }
                }
                this.OnEMCAgentEvent(JSON.stringify(dataObj, null, '\t'));
                break;

            case EMC_EVT_QUEUING:
            case EMC_EVT_RESERVED:
            case EMC_EVT_ALERTING:
            case EMC_EVT_CONNECTED:
            case EMC_EVT_ACW:
            case EMC_EVT_RELEASE:
            case EMC_EVT_ETS_ACCPET:
            case EMC_EVT_CONTACT_STATE:
            case EMC_EVT_CONTACT_INFO:
            case EMC_EVT_ETS_RELEASE:
                this.OnEMCCallEvent(JSON.stringify(dataObj, null, '\t'));
                break;

            default:
                if(EMC_CMD_LOGOUT === dataObj.cmd && dataObj.ret === EMC_RET_SUCCESS) {
                    if(dataObj.msg.state) {
                        this.emc_agentState = dataObj.msg.state;
                    }
                }
                this.OnEMCResultEvent(JSON.stringify(dataObj, null, '\t'));
                break;
        }
    },

    EMC_createMsgAndSetCID: function (contact_id) {
        var msg = {};
        if (contact_id && 0 < contact_id.length)
            msg.contact_id = contact_id;

        return msg;
    },

    EMC_login: function (id) {
        var msg = {};
        msg.id = id;

        return this.EMC_sendMessage("LOGIN", msg);
    },

    EMC_logout: function () {
        return this.EMC_sendMessage("LOGOUT", null);
    },

    EMC_ready: function (contact_type, max_contact_cnt) {
        var msg = {};
        msg.contact_type = contact_type;
        msg.max_contact_cnt = max_contact_cnt;

        return this.EMC_sendMessage("READY", msg);
    },

    EMC_notReady: function (contact_type, reasonCode) {
        var msg = {};
        if (reasonCode) {
            msg.reason_code = reasonCode;
        }

        msg.contact_type = contact_type;
        return this.EMC_sendMessage("NOT_READY", msg);
    },

    EMC_accept: function (contact_id, contact_type) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        msg.conatct_type = contact_type;
        return this.EMC_sendMessage("ACCEPT", msg);
    },

    EMC_release: function (contact_id) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        return this.EMC_sendMessage("DROP", msg);
    },

    EMC_adminRelease: function (contact_id, agent_id) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        msg.agent_id = agent_id;
        return this.EMC_sendMessage("USER_DROP", msg);
    },

    EMC_acw: function (contact_id) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        return this.EMC_sendMessage("ACW", msg);
    },

    EMC_getContactList: function () {
        return this.EMC_sendMessage("GET_CONTACT_LIST", null);
    },

    EMC_transfer : function(skill, contact_id) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        msg.skill = skill;
        return this.EMC_sendMessage("TRANSFER", msg);
    },

    EMC_transfer : function(skill, contact_id, custom_data) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        msg.skill = skill;
        msg.custom_data = custom_data;
        return this.EMC_sendMessage("TRANSFER", msg);
    },

    EMC_transferToAgent : function(agent_id, contact_id, custom_data) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        msg.agent_id = agent_id;
        msg.custom_data = custom_data;
        return this.EMC_sendMessage("TRANSFER", msg);
    },

    EMC_transferComplete : function(contact_id) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        return this.EMC_sendMessage("TRANSFER_COMPLETE", msg);
    },

    EMC_transferCancel : function(conatct_id) {
        var msg = this.EMC_createMsgAndSetCID(conatct_id);
        return this.EMC_sendMessage("TRANSFER_CANCEL", msg);
    },

    EMC_active : function(contact_id) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        msg.flag_active = "ON";
        return this.EMC_sendMessage("MODIFY_CONTACT", msg);
    },

    EMC_inactive : function(contact_id) {
        var msg = this.EMC_createMsgAndSetCID(contact_id);
        msg.flag_active = "OFF";
        return this.EMC_sendMessage("MODIFY_CONTACT", msg);
    },

    EMC_getAgentState : function() {
        return this.emc_agentState;
    },

    EMC_setAgentState : function(state) {
        this.emc_agentState = state;
    },

    EMC_sendVoiceEvent : function(msg) {
        return this.EMC_sendMessage("VOICE_EVENT", msg);
    },

    EMC_sendMessage : function(command, msg) {
        var cmd = {};
        cmd.cmd = command;
        cmd.msg_type = "emc";
        return this. sendMessage(cmd, msg);
    }

};

/**
 * EMC End
 ******************************************************************************/

