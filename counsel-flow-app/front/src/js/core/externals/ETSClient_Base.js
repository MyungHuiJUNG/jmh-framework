/**
 * Websocket 상태 정보 정의
 */
var SOCKET_CONNECTING = 0;
var SOCKET_OPEN = 1;
var SOCKET_CLOSING = 2;
var SOCKET_CLOSED = 3;

var ETS_RET_ERROR_IS_NOT_CONNECT = -1;
var ETS_RET_ERROR_SEND_FAIL = -2;
var ETS_RET_ERROR_IS_ALREADY_CONNECT = -3;
var ETS_RET_ERROR_NOT_EXIST_CALLID = -4;
var ETS_RET_ERROR_CONNECT_FAIL = -10;
var ETS_RET_ERROR_SERVER_INFO = -11;
var ETS_RET_SUCCESS = 0;


function getETSRetCodeToStr(code) {
    switch (code) {
        case ETS_RET_ERROR_IS_NOT_CONNECT:
            return "SERVER_IS_NOT_CONNECT";
        case ETS_RET_ERROR_SEND_FAIL:
            return "SEND_FAIL";
        case ETS_RET_ERROR_IS_ALREADY_CONNECT:
            return "SERVER_IS_ALREADY_CONNECT";
        case ETS_RET_ERROR_CONNECT_FAIL:
            return "SERVER_CONNECT_FAIL";
        case ETS_RET_ERROR_SERVER_INFO:
            return "ERR_SERVER_INFO_NOT_CORRECT";
        case ETS_RET_ERROR_NOT_EXIST_CALLID:
            return "ETS_RET_ERROR_NOT_EXIST_CALLID";
        case ETS_RET_SUCCESS:
            return "SUCCESS";
    }
}

String.format = function () {
    var theString = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }

    return theString;
};

/**
 * @return {ETSClientBase}
 */
function CreateETSMsgLib(type, useEMC, useJtapi, userTool) {
    var etsClientBase = new ETSClientBase(type);
    switch(type) {
        case "finesse":
            var etsFinesse = new ETSFinesse();
            for(var prop1 in etsFinesse) {
                etsClientBase[prop1] = etsFinesse[prop1];
            }
            etsClientBase.OnFinesseMsgEvt = etsFinesse.OnFinesseEvt;
            break;
        case "uip":
            var etsUIP = new ETS_UIP();
            for(var prop1 in etsUIP) {
                etsClientBase[prop1] = etsUIP[prop1];
            }
            etsClientBase.OnUIPMsgEvt = etsUIP.OnUIPEvent;
            break;
    }

    if(type === "emc" || useEMC === true) {
        var emcClient = new EmcClient();
        for(var prop2 in emcClient) {
            etsClientBase[prop2] = emcClient[prop2];
        }
        etsClientBase.OnEMCMsgEvt = emcClient.OnEmcEvent;
    }

    if(type === "jtapi" || useJtapi === true) {
        var jtapiClient = new JtapiClient();
        for(var prop2 in jtapiClient) {
            etsClientBase[prop2] = jtapiClient[prop2];
        }
        etsClientBase.OnJTAPIEvent = jtapiClient.OnJTAPIEvent;
    }

    if(type === "tools" || userTool === true) {
        var toolsClient = new ToolsClient();
        for(var prop2 in toolsClient) {
            etsClientBase[prop2] = toolsClient[prop2];
        }
        etsClientBase.OnToolsEvent = toolsClient.OnToolEvent;
    }
	
	if(type === "monitor") {
        var monitorClient = new MonitorClient();
        for(var prop2 in monitorClient) {
            etsClientBase[prop2] = monitorClient[prop2];
        }
        etsClientBase.OnMonitorEvent = monitorClient.OnMonitorEvent;
    }
	
    return etsClientBase;
}

function AddETSMsgLib(type, etsClientBase) {
    if(etsClientObj) {
        switch(type) {
            case "monitor":
                var monitorClient = new MonitorClient();
                etsClientBase.OnMonitorEvent = monitorClient.OnMonitorEvent;
            return AddETSMsgFunctions(etsClientBase, monitorClient);
            case "tools":
                var toolsClient = new ToolsClient();
                etsClientBase.OnToolsEvent = toolsClient.OnToolEvent;
            return AddETSMsgFunctions(etsClientBase, toolsClient);
        }
    }
}

function AddETSMsgFunctions(etsClientObj, msgObj) {
    for(var prop in msgObj) {
        etsClientObj[prop] = msgObj[prop];
    }
    return etsClientObj;
}

/********************************************************************************************
 * WebSocket Logic
 */

function ETSClientBase(type) {
    /** WebSocket Library 정보 */
    this.SOCK_LIB_VERSION = "1.0.2";
    this.SOCK_BUILD_DATE = "2020-01-23 20:53";
    this.CTI_TYPE = type;

    /** 상담원 관련 접속 정보 Variable */
    this._id = "";
    this._dn = "";

    /** Socket 관련 Variable */
    this._webSocket = null;

    this.sequence = 0;
    this.connectionURLS = [];
    this.connURL = "";
    this.SOCK_RETRY_CNT = 6;
    this.retryCnt = 0;
    this.OnFinesseMsgEvt = undefined;
    this.OnEMCMsgEvt = undefined;
    this.OnUIPMsgEvt = undefined;
    this.OnServerEvent = undefined;
    this.OnJTAPIEvent = undefined;
    this.OnToolsEvent = undefined;
	this.OnMonitorEvent = undefined;
}

ETSClientBase.prototype =  {

    setServerInfo : function(ipa, porta, ipb, portb, isSSL) {
        this.ipA = ipa;
        this.portA = porta;
        this.ipB = ipb;
        this.portB = portb;

        this.connectionURLS = [];

        if(isSSL === true) {
            this.connectionURLS.push("wss://" + this.ipA + ":" + this.portA + "/etsclient");
            this.connectionURLS.push("wss://" + this.ipB + ":" + this.portB + "/etsclient");
        } else {
            this.connectionURLS.push("ws://" + this.ipA + ":" + this.portA + "/etsclient");
            this.connectionURLS.push("ws://" + this.ipB + ":" + this.portB + "/etsclient");
        }

        this.connURL = this.connectionURLS[0];
    },

    SetOnServerEvent : function (OnEvt) {
        this.OnServerEvent = OnEvt;
    },

    connectToServer : function() {
        try {
            this.call_id_dicObj = {};

            if (this.connectionURLS === undefined || this.connectionURLS === null)
                return ETS_RET_ERROR_SERVER_INFO;

            if(this.connectionURLS.length <= 0)
                return ETS_RET_ERROR_SERVER_INFO;

            if(this._webSocket) {
                if(this._webSocket.readyState === SOCKET_OPEN)
                    return ETS_RET_ERROR_IS_ALREADY_CONNECT;

                this._webSocket.close();
                this._webSocket = null;
            }

            this.connURL = this.GetConnUrl();
            this._webSocket = new WebSocket(this.connURL);

            this._webSocket.onopen = this.OnWsOpenEvt.bind(this);
            this._webSocket.onclose = this.OnWsCloseEvt.bind(this);
            this._webSocket.onmessage = this.OnWsOnMessage.bind(this);
            this._webSocket.onerror = this.OnWsOnError.bind(this);

            var that = this;
            var timerid = setTimeout(function(){
                console.log(" ** SocketConnCheck connection timeout");
                if(that._webSocket.readyState === SOCKET_CONNECTING
                    || that._webSocket.readyState  === SOCKET_CLOSING) {

                    that._webSocket.close();
                }
            }, 3000);
            console.log("Login Success!! TimerID:" + timerid);
            return ETS_RET_SUCCESS;
        } catch (err) {
            console.log("Event Exceptino:" + err);
        }

        return ETS_RET_ERROR_CONNECT_FAIL;
    },

    ReconnectServer : function() {
        var that = this;
        setTimeout(function() {
            console.log(" ** Socket connection timeout!!");
            console.log("RetryCnt:" + that.retryCnt);
            that.GetConnUrl();

            if(that._webSocket.readyState === SOCKET_CONNECTING) {
                that._webSocket.close();
            }

            that.connectToServer();
            that.retryCnt = that.retryCnt + 1;
        }, 5000);
    },

    GetConnUrl : function() {
        var tmpURL = "";
        if(this.retryCnt % 2  === 0)
            tmpURL = this.connectionURLS[0];
        else
            tmpURL = this.connectionURLS[1];

        console.log("Change Url URL:" + this.connURL + " >> URL:" + tmpURL);
        this.connURL = tmpURL;
        return this.connURL;
    },

    OnWsOpenEvt: function (message) {
        this.retryCnt = 0;
    },

    OnWsCloseEvt : function(message) {
        var cmd = {};
        cmd.cmd = "server";
        cmd.ret = "" + message.code;
        cmd.desc = "disconnect server";

        var msg = {};
        msg.url = this.connURL;

        cmd.msg = msg;

        if(this.OnServerEvent) {
            this.OnServerEvent(JSON.stringify(cmd, null, "\t"));
        }

        if(this.EMC_setAgentState) {
            this.EMC_setAgentState("UNKNOWN");
        }

        switch(message.code) {
            case 1000:
                console.log("[1000] Close Normally!!");
                return;
            case 1005:
                console.log("[1005] Close Normally!!");
                return;
            default:
        }

        if(this.retryCnt < this.SOCK_RETRY_CNT) {
            console.log("ReconnectServer retryCnt:" + this.SOCK_RETRY_CNT);
            this.ReconnectServer();
        } else {
            console.log("retry Count is Over MAX_RETRY_CNT:" + this.SOCK_RETRY_CNT);
        }

    },

    OnWsOnMessage : function(message) {
        var dataObj = JSON.parse(message.data);
        var cmd = dataObj.cmd;

        if("STATUSCHK" !== cmd) {
            console.log(message.data);
        }

        // ETSServer HealthCheck!! (When it's idle!!!)
        if("STATUSCHK" === cmd) { // STATUSCHK가 올경우 STATUSOK를 보냄
            var sendOk = {};
            var d = new Date();
            sendOk.cmd = "STATUSOK";
            sendOk.msg_id = "" + d.getTime();

            this._webSocket.send(JSON.stringify(sendOk));
            return;
        }

        if(this.OnServerEvent && cmd === "server") {
            this.OnServerEvent(message.data);
        }

        else if(this.OnFinesseMsgEvt && dataObj.msg_type === "finesse") {
            this.OnFinesseMsgEvt(message.data);
        }

        else if(this.OnEMCMsgEvt && dataObj.msg_type === "emc") {
            this.OnEMCMsgEvt(message.data);
        }

        else if(this.OnUIPMsgEvt && dataObj.msg_type === "uip") {
            this.OnUIPMsgEvt(message.data);
        }

        else if(this.OnJTAPIEvent && dataObj.msg_type === "jtapi") {
            this.OnJTAPIEvent(message.data);
        }

        else if(this.OnToolsEvent && dataObj.msg_type === "tools") {
            this.OnToolsEvent(message.data);
        }
		
		else if(this.OnMonitorEvent && dataObj.msg_type === "monitor") {
			this.OnMonitorEvent(message.data);
		}

    },

    OnWsOnError : function (message) {
        var cmd = {};
        cmd.cmd = "server";
        cmd.ret = ETS_RET_ERROR_IS_NOT_CONNECT;
        cmd.desc = "client is not connect server!!";

        var msg = {};
        msg.url = this.connURL;
        msg.desc = message;
        cmd.msg = msg;

        if(this.OnServerEvent)
            this.OnServerEvent(JSON.stringify(cmd, null, "\t"));

        switch(message.code) {
            case 'ECONNREFUSED':
                if(this.retryCnt < this.SOCK_RETRY_CNT) {
                    this.ReconnectServer();
                }

                break;
        }
    },

    disconnect : function() {
        if(this._webSocket === null) {
            var cmd = {};
            cmd.cmd = "server";
            cmd.ret = ETS_RET_ERROR_IS_NOT_CONNECT;
            cmd.desc = "client is not connect server!!";

            var msg = {};
            msg.url = this.connURL;

            cmd.msg = msg;

            if(this.OnServerEvent !== null) {
                this.OnServerEvent(JSON.stringify(cmd, null, "\t"));
            }

            return;
        }

        this._webSocket.close();
        this.retryCnt = 0;
        return ETS_RET_SUCCESS;
    },

    sendMessage : function(cmd, msg) {

        if(this._webSocket === null || this._webSocket.readyState !== SOCKET_OPEN) {
            return ETS_RET_ERROR_IS_NOT_CONNECT;
        }

        if(!cmd) cmd = {};
        cmd.dn = this._dn;

        var d = new Date();
        cmd.msg_id = this.sequence + "-" + d.getTime();
        this.sequence++;

        if(!msg) msg = {};

        cmd.msg = msg;
        console.log("send msg:" + JSON.stringify(cmd, null, "\t"));

        if(this.OnLogEvent) {
            this.OnLogEvent(JSON.stringify(cmd, null, "\t"));
        }

        this._webSocket.send(JSON.stringify(cmd));
        return ETS_RET_SUCCESS;
    }
};

/**
*   WebSocket Logic
********************************************************************************************/
