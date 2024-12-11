
/********************************************************************************************
 * JTAPI Logic
 */

// var JTAPI_CMD_LOGIN = "LOGIN";
// var JTAPI_CMD_LOGOUT = "LOGOUT";
// var JTAPI_CMD_MAKE_CALL = "MAKE_CALL";
// var JTAPI_CMD_CONSULT = "CONSULT";
// var JTAPI_CMD_TRANSFER = "TRANSFER";
// var JTAPI_CMD_CONFERENCE = "CONFERENCE";
// var JTAPI_CMD_HANGUP = "HANGUP";
// var JTAPI_CMD_HOLD = "HOLD";
// var JTAPI_CMD_RETRIEVE = "RETRIEVE";
// var JTAPI_CMD_ANSWER = "ANSWER";
// var JTAPI_CMD_REJECT = "REJECT";
// var JTAPI_CMD_GENERATE_DTMF = "GENERATE_DTMF";
var JTAPI_CMD_SEND_DATA = "SEND_DATA";
var JTAPI_CMD_DISCONNECT_IVR = "DISCONNECT_IVR";

//language=XML
var JTAPI_SEND_DATA_MUTE = "<CiscoIPPhoneExecute>\n    <ExecuteItem Priority=\"0\" URL=\"Key:Mute\"/>\n</CiscoIPPhoneExecute>";

function JtapiClient() {
    this.MSG_LIB_VERSION = "0.1.0";
    this.MSG_BUILD_DATE = "2019-04-19 18:12";
    // this._id = "";
    this._dn = "";

    this.OnJtapiDeviceEvent = undefined;    // device 이벤트 콜백
    this.OnJtapiCallEvent = undefined;   // Call 이벤트
    this.OnJtapiResultEvent = undefined;  // Result 결과 값 이벤트 콜백
    this.OnJtapiLogEvent = undefined;     // LogEvent
}

JtapiClient.prototype = {

    JTAPI_SetOnDeviceEvent : function (OnEvt) {
        this.OnJtapiDeviceEvent = OnEvt;
    },

    JTAPI_SetOnCallEvent : function (OnEvt) {
        this.OnJtapiCallEvent = OnEvt;
    },

    JTAPI_SetOnResultEvent : function (OnEvt) {
        this.OnJtapiResultEvent = OnEvt;
    },

    JTAPI_SetOnLogEvent : function (OnEvt) {
        this.OnJtapiLogEvent = OnEvt;
    },

    OnJTAPIEvent : function(message) {
        var dataObj = JSON.parse(message);
        var cmd = dataObj.cmd;

        switch (cmd.toLowerCase()) {

            case "call": // CallEvent
                if(this.OnJtapiCallEvent)
                    this.OnJtapiCallEvent(JSON.stringify(dataObj, null, '\t'));

                break;
            case "device": // DeviceEvent
                if(this.OnJtapiDeviceEvent)
                    this.OnJtapiDeviceEvent(JSON.stringify(dataObj, null, '\t'));

                break;
            default: // 그외 OnResultEvent
                if(this.OnJtapiResultEvent)
                    this.OnJtapiResultEvent(JSON.stringify(dataObj, null, '\t'));

                break;
        }
    },

  /** TODO:추후 지원 예정.... 아마도?? ㅋㅋㅋ
    JTAPI_login : function(id, pw, dn) {

        var msg = {};
        this._dn = msg.dn = dn;

        return this.JTAPI_sendMessage(JTAPI_CMD_LOGIN, msg);
    },

    JTAPI_logout : function() {
        return this.JTAPI_sendMessage(JTAPI_CMD_LOGOUT, null);
    },

    JTAPI_makeCall : function(dial_type, service_id, number) {
        var msg = {};

        msg.dial_type = dial_type;
        msg.service_id = service_id;
        msg.number = number;

        return this.JTAPI_sendMessage(JTAPI_CMD_MAKE_CALL, msg);
    },

    JTAPI_answerCall : function() {
        return this.JTAPI_sendMessage(JTAPI_CMD_ANSWER, null);
    },

    JTAPI_consultCall : function(dial_type, number) {
        var msg = {};
        msg.dial_type = dial_type;
        msg.number = number;
        return this.JTAPI_sendMessage(JTAPI_CMD_CONSULT, msg);
    },

    JTAPI_transferComplete : function() {
        return this.JTAPI_sendMessage(JTAPI_CMD_TRANSFER, null);
    },

    JTAPI_conferenceComplete : function(call_id) {
        return this.JTAPI_sendMessage(JTAPI_CMD_CONFERENCE, null);
    },

    JTAPI_blindTransfer : function(dial_type, number) {
        var msg = {};
        msg.dial_type = dial_type;
        msg.number = number;

        return this.JTAPI_sendMessage(JTAPI_CMD_BLIND_TRANSFER, msg);
    },

    JTAPI_rejectCall : function(code, desc) {
        var msg = {};
        msg.reject_code = code;
        msg.reject_desc = desc;
        return this.JTAPI_sendMessage(JTAPI_CMD_REJECT, msg);
    },

    JTAPI_releaseCall : function(call_type) {
        var msg = {};
        msg.call_type = call_type;
        return this.JTAPI_sendMessage(JTAPI_CMD_HANGUP, msg);
    },

    JTAPI_hold : function(call_type) {
        var msg = {};
        msg.call_type = call_type;
        return this.JTAPI_sendMessage(JTAPI_CMD_HOLD, msg);
    },

    JTAPI_unHold : function(call_type) {
        var msg = {};
        msg.call_type = call_type;
        return this.JTAPI_sendMessage(JTAPI_CMD_RETRIEVE, msg);
    },

    JTAPI_generateDTMF : function(dtmf) {
        var msg = {};
        msg.dtmf = dtmf;
        return this.JTAPI_sendMessage(JTAPI_CMD_GENERATE_DTMF, msg);
    },
   */

    JTAPI_sendData : function(dn, cmdText) {
        var msg = {};
        msg.dn = dn;
        msg.send_data = cmdText;
        return this.JTAPI_sendMessage(JTAPI_CMD_SEND_DATA, msg);
    },


    JTAPI_disconnectIVR : function(dn, ivrNumber) {
        var msg = {};
        msg.dn = dn;
        msg.ivr_number = ivrNumber;
        return this.JTAPI_sendMessage(JTAPI_CMD_DISCONNECT_IVR, msg);
    },

    JTAPI_sendMessage : function(command, msg) {
        var cmd = {};
        cmd.cmd = command;
        cmd.msg_type = "jtapi";
        return this.sendMessage(cmd, msg);
    }

};

/**
 * JTAPI End
 ******************************************************************************/
