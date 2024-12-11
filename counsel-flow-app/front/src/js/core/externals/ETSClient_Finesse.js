var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/********************************************************************************************
 * Finesse Logic
 */
var FINESSE_CMD_LOGIN = "LOGIN";
var FINESSE_CMD_LOGOUT = "LOGOUT";
var FINESSE_CMD_READY = "READY";
var FINESSE_CMD_NOT_READY = "NOT_READY";
var FINESSE_CMD_MAKE_CALL = "MAKE_CALL";
var FINESSE_CMD_ANSWER_CALL = "ANSWER";
var FINESSE_CMD_RELEASE_CALL = "DROP";
var FINESSE_CMD_CONSULT_CALL = "CONSULT_CALL";
var FINESSE_CMD_TRANSFER = "TRANSFER";
var FINESSE_CMD_CONFERENCE = "CONFERENCE";
var FINESSE_CMD_SS_TRANSFER = "TRANSFER_SST";
var FINESSE_CMD_SS_CONFERENCE = "CONFERENCE_SST";
var FINESSE_CMD_HOLD = "HOLD";
var FINESSE_CMD_UNHOLD = "RETRIEVE";
var FINESSE_CMD_UPDATE_CALL_DATA = "UPDATE_CALL_DATA";
var FINESSE_CMD_GET_CALL_DATA = "GET_CALL_DATA";
var FINESSE_CMD_GET_ALL_USERS = "GET_ALL_USERS";
var FINESSE_CMD_GET_TEAM_MEMEBER = "GET_TEAM_MEMEBER";
var FINESSE_CMD_GET_REASON_CODES = "GET_REASON_CODES";
var FINESSE_CMD_GET_USER_QUEUE = "GET_USER_QUEUE";
var FINESSE_CMD_GET_QUEUE = "GET_QUEUE";
var FINESSE_CMD_GET_ALL_QUEUE = "GET_ALL_QUEUE";
var FINESSE_CMD_GET_DB_INFO = "GET_DB_INFO";
var FINESSE_CMD_GET_ERS_DB_INFO = "GET_ERS_DB_INFO";
var FINESSE_EVT_INITIATED = "INITIATED";
var FINESSE_EVT_ALERTING = "ALERTING";
var FINESSE_EVT_ACTIVE = "ACTIVE";
var FINESSE_EVT_FAILED = "FAILED";
var FINESSE_EVT_DROPPED = "DROPPED";
var FINESSE_EVT_ACCEPTED = "ACCEPTED";
var FINESSE_EVT_OFFERED = "OFFERED";
var FINESSE_EVT_PAUSED = "PAUSED";
var FINESSE_EVT_WRAPPING_UP = "WRAPPING_UP";
var FINESSE_EVT_INTERRUPTED = "INTERRUPTED";
var FINESSE_EVT_CLOSED = "CLOSED";
var FINESSE_EVT_UNKNOWN = "UNKNOWN";
var FINESSE_CALL_TYPE_INITIATED = "INITIATED";
var FINESSE_CALL_TYPE_ALERTING = "ALERTING";
var FINESSE_CALL_TYPE_ACTIVE = "ACTIVE";
var FINESSE_CALL_TYPE_FAILED = "FAILED";
var FINESSE_CALL_TYPE_DROPPED = "DROPPED";
var FINESSE_CALL_TYPE_ACCEPTED = "ACCEPTED";
var FINESSE_CALL_TYPE_OFFERED = "OFFERED";
var FINESSE_CALL_TYPE_PAUSED = "PAUSED";
var FINESSE_CALL_TYPE_WRAPPING_UP = "WRAPPING_UP";
var FINESSE_CALL_TYPE_INTERRUPTED = "INTERRUPTED";
var FINESSE_CALL_TYPE_CLOSED = "CLOSED";
var FINESSE_CALL_TYPE_UNKNOWN = "UNKNOWN";
/**
 * @return {string}
 */
function GetTimeStringEx() {
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var month = currentTime.getMonth();
    var days = "" + currentTime.getDay();
    var hours = "" + currentTime.getHours();
    var minutes = "" + currentTime.getMinutes();
    var seconds = "" + currentTime.getSeconds();
    var ms = "" + currentTime.getMilliseconds();
    if (days.length == 1)
        days = "0" + days;
    if (hours.length == 1)
        hours = "0" + hours;
    if (minutes.length == 1)
        minutes = "0" + minutes;
    if (seconds.length == 1)
        seconds = "0" + seconds;
    if (ms.length == 2)
        ms = "0" + ms;
    if (ms.length == 1)
        ms = "00" + ms;
    return "" + year + month + days + hours + minutes + seconds + ms;
}
function ETSFinesse() {
    this.MSG_LIB_VERSION = "1.0.3";
    this.MSG_BUILD_DATE = "2020-01-23 20:54";
    this.OnAgentEvent = undefined; // 상담원 이벤트 콜백
    this.OnCallEvent = undefined; // Call 이벤트 콜백
    this.OnErrorEvent = undefined; // Error 이벤트 콜백 (상담원/콜 관련)
    this.OnResultEvent = undefined; // Result 결과 값 이벤트 콜백
    this.OnLogEvent = undefined; // LogEvent
    this._id = "";
    this._dn = "";
    this._pw = "";
    this._isLogin = false;
}
ETSFinesse.prototype = {
    // TODO reconnect 관련 이벤트를 받아서 재연결 되었으면 로그인을 다시 한다.
    SetOnAgentEvent: function (OnEvt) {
        this.OnAgentEvent = OnEvt;
    },
    SetOnCallEvent: function (OnEvt) {
        this.OnCallEvent = OnEvt;
    },
    SetOnErrorEvent: function (OnEvt) {
        this.OnErrorEvent = OnEvt;
    },
    SetOnResultEvent: function (OnEvt) {
        this.OnResultEvent = OnEvt;
    },
    SetOnLogEvent: function (OnEvt) {
        this.OnLogEvent = OnEvt;
    },
    isCallEnd: function (state) {
        return state === "DROP" || state === "DROPPED" || state === "WRAP_UP";
    },
    OnFinesseEvt: function (message) {
        var dataMsg = JSON.parse(message);
        switch (dataMsg.cmd.toLowerCase()) {
            case "user": // AgentEvent
                this.OnAgentEvent(JSON.stringify(dataMsg, null, '\t'));
                break;
            case "dialog": // CallEvent
                this.OnCallEvent(JSON.stringify(dataMsg, null, '\t'));
                break;
            case "api_error": // ErrorEvent
                this.OnErrorEvent(JSON.stringify(dataMsg, null, '\t'));
                break;
            default: // 그외 OnResultEvent
                this.OnResultEvent(JSON.stringify(dataMsg, null, '\t'));
                if (dataMsg.cmd === FINESSE_CMD_LOGIN) {
                    this._isLogin = (dataMsg.ret === "0");
                }
                break;
        }
    },
    login: function (id, pw, dn) {
        var msg = {};
        this._id = msg.id = id;
        this._dn = msg.dn = dn;
        this._pw = msg.pw = pw;
        return this.Finesse_sendMessage(FINESSE_CMD_LOGIN, msg);
    },
    logout: function () {
        return this.Finesse_sendMessage(FINESSE_CMD_LOGOUT, null);
    },
    ready: function () {
        return this.Finesse_sendMessage(FINESSE_CMD_READY, null);
    },
    notReady: function (reasonCode) {
        var msg = {};
        if (reasonCode)
            msg.reason_code = reasonCode;
        return this.Finesse_sendMessage(FINESSE_CMD_NOT_READY, msg);
    },
    makeCall: function (number, callDic) {
        var msg = {};
        msg.number = number;
        if (!callDic) {
            callDic = {};
        }
        msg.callVariable1 = GetTimeStringEx() + Math.floor(Math.random() * (999 - 100 + 1) + 100);
        for (var key in callDic) {
            if (callDic.hasOwnProperty(key)) {
                msg[key] = callDic[key];
            }
        }
        return this.Finesse_sendMessage(FINESSE_CMD_MAKE_CALL, msg);
    },
    answerCall: function (call_id) {
        var msg = this.createCID(call_id);
        return this.Finesse_sendMessage(FINESSE_CMD_ANSWER_CALL, msg);
    },
    rejectCall: function (call_id) {
        var msg = this.createCID(call_id);
        return this.Finesse_sendMessage("REJECT", msg);
    },
    createCID: function (call_id) {
        var msg = {};
        if (call_id && call_id.length > 0) {
            msg.call_id = call_id;
        }
        return msg;
    },
    closeCall: function (call_id) {
        var msg = this.createCID(call_id);
        return this.Finesse_sendMessage("CLOSE", msg);
    },
    releaseCall: function (call_id) {
        var msg = this.createCID(call_id);
        return this.Finesse_sendMessage(FINESSE_CMD_RELEASE_CALL, msg);
    },
    consultCall: function (number, call_id) {
        var msg = this.createCID(call_id);
        msg.number = number;
        return this.Finesse_sendMessage(FINESSE_CMD_CONSULT_CALL, msg);
    },
    transferComplete: function (call_id) {
        var msg = this.createCID(call_id);
        return this.Finesse_sendMessage(FINESSE_CMD_TRANSFER, msg);
    },
    conferenceComplete: function (call_id) {
        var msg = this.createCID(call_id);
        return this.Finesse_sendMessage(FINESSE_CMD_CONFERENCE, msg);
    },
    ssTransfer: function (number, call_id) {
        var msg = this.createCID(call_id);
        msg.number = number;
        return this.Finesse_sendMessage(FINESSE_CMD_SS_TRANSFER, msg);
    },
    hold: function (call_id) {
        var msg = this.createCID(call_id);
        return this.Finesse_sendMessage(FINESSE_CMD_HOLD, msg);
    },
    unHold: function (call_id) {
        var msg = this.createCID(call_id);
        return this.Finesse_sendMessage(FINESSE_CMD_UNHOLD, msg);
    },
    setCallData: function (callDic, call_id) {
        var msg = this.createCID(call_id);
        var msgEx = __assign(__assign({}, callDic), msg);
        return this.Finesse_sendMessage(FINESSE_CMD_UPDATE_CALL_DATA, msgEx);
    },
    getCallData: function (call_id) {
        var msg = this.createCID(call_id);
        return this.Finesse_sendMessage(FINESSE_CMD_GET_CALL_DATA, msg);
    },
    getUserList: function () {
        return this.Finesse_sendMessage(FINESSE_CMD_GET_ALL_USERS, null);
    },
    getTeamMembers: function (team_id) {
        var msg = {};
        msg.team_id = team_id;
        return this.Finesse_sendMessage(FINESSE_CMD_GET_TEAM_MEMEBER, msg);
    },
    getReasonCode: function () {
        return this.Finesse_sendMessage(FINESSE_CMD_GET_REASON_CODES, null);
    },
    getUserQueue: function () {
        return this.Finesse_sendMessage(FINESSE_CMD_GET_USER_QUEUE, null);
    },
    getQueueInfo: function (queueID) {
        var msg = {};
        msg.queue_id = queueID;
        return this.Finesse_sendMessage(FINESSE_CMD_GET_QUEUE, msg);
    },
    getDBInfo: function (query_id, param1, param2, param3, param4, param5) {
        var msg = {};
        msg.query_id = query_id;
        msg.param1 = param1;
        msg.param2 = param2;
        msg.param3 = param3;
        msg.param4 = param4;
        msg.param5 = param5;
        return this.Finesse_sendMessage(FINESSE_CMD_GET_DB_INFO, msg);
    },
    getERSDBInfo: function (query_id, param1, param2, param3, param4, param5) {
        var msg = {};
        msg.query_id = query_id;
        msg.param1 = param1;
        msg.param2 = param2;
        msg.param3 = param3;
        msg.param4 = param4;
        msg.param5 = param5;
        return this.Finesse_sendMessage(FINESSE_CMD_GET_ERS_DB_INFO, msg);
    },
    getAllQueueInfo: function () {
        return this.Finesse_sendMessage(FINESSE_CMD_GET_ALL_QUEUE, null);
    },
    Finesse_sendMessage: function (command, msg) {
        var cmd = {};
        cmd.cmd = command;
        cmd.msg_type = "finesse";
        return this.sendMessage(cmd, msg);
    }
};
/**
 * Finesse End
 ******************************************************************************/
