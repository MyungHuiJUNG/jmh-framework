
/********************************************************************
 *
 * ECC Websocket Client
 * 
 * Make by supark
 * 2019.03.06
 *
 ********************************************************************/
 
/********************************************************************
 *
 * Define Server Infomation
 *
 * Modify This Area Only
 *
 ********************************************************************/
var ECS_ECC_IP = "10.0.55.233:9071";
var ECS_ECC_FILE_UPLOAD_URL = "10.0.55.233:9201/image_upload";
// var ECS_ECC_WEBSOCKET_TYPE = "wss";
var ECS_ECC_WEBSOCKET_TYPE = "ws";



/********************************************************************
 * 
 * @Warning 
 * Must Not Modify This Area
 *
 ********************************************************************/
/********************************************************************
 * Define Message Default
 ********************************************************************/
var	_ECS_ECC_MSG_SOP							= "!@#$";
var	_ECS_ECC_MSG_TYPE_REQ						= "REQ";
var	_ECS_ECC_MSG_TYPE_EVENT						= "EVT";
var	_ECS_ECC_MSG_TYPE_RESP						= "RET";
var _ECS_ECC_MSG_TYPE_CONFIRM					= "CNF";

/********************************************************************
 * Define Message Size
 ********************************************************************/
var _ECC_MSG_SOP_SIZE							= 4;
var _ECC_MSG_LEN_SIZE							= 8;
var _ECC_MSG_SEQ_SIZE							= 5;
var _ECC_MSG_TYPE_SIZE							= 3;
var _ECC_MSG_RESERVED_SIZE						= 10;
var _ECC_MSG_ID_SIZE							= 4;
var _ECC_MSG_HEADER_SIZE						= _ECC_MSG_SOP_SIZE + _ECC_MSG_LEN_SIZE + _ECC_MSG_SEQ_SIZE + _ECC_MSG_TYPE_SIZE + _ECC_MSG_RESERVED_SIZE + _ECC_MSG_ID_SIZE;	//헤더 사이즈(34)
var	_ECC_MSG_ALIVE_CHECK_POS					= _ECC_MSG_SOP_SIZE + _ECC_MSG_LEN_SIZE + _ECC_MSG_SEQ_SIZE + _ECC_MSG_TYPE_SIZE + _ECC_MSG_RESERVED_SIZE;
var _ECC_MSG_MAX_SIZE							= 999999;	//거의 1MB... 이 이상 오면 에러로 처리...


/********************************************************************
 * Define Message ID
 ********************************************************************/
var ECS_ECC_REQ_LOGIN							= "8001";
var ECS_ECC_REQ_LOGOUT							= "8002";
var ECS_ECC_REQ_INVITE							= "8011";
var ECS_ECC_REQ_BYE								= "8012";
var ECS_ECC_REQ_INFO							= "8021";
var ECS_ECC_REQ_MESSAGE							= "8022";
var ECS_ECC_REQ_JOIN							= "8013";
var ECS_ECC_REQ_EXIT							= "8014";
var ECS_ECC_REQ_MESSAGE_LIST					= "8023";
var ECS_ECC_REQ_HOLD							= "8024";

var ECS_ECC_RESP_LOGIN							= "8201";
var ECS_ECC_RESP_LOGOUT							= "8202";
var ECS_ECC_RESP_INVITE							= "8211";
var ECS_ECC_RESP_BYE							= "8212";
var ECS_ECC_RESP_INFO							= "8221";
var ECS_ECC_RESP_MESSAGE						= "8222";
var ECS_ECC_RESP_JOIN							= "8213";
var ECS_ECC_RESP_EXIT							= "8214";
var ECS_ECC_RESP_MESSAGE_LIST 					= "8223";
var ECS_ECC_RESP_HOLD							= "8224";

var EVT_ECC_LOGIN		 						= "8401";
var EVT_ECC_LOGOUT								= "8402";
var EVT_ECC_CLOSE								= "8404";
var EVT_ECC_INVITE 								= "8411";
var EVT_ECC_BYE 								= "8412";
var EVT_ECC_INFO 								= "8421";
var EVT_ECC_MESSAGE 							= "8422";
var EVT_ECC_HOLD	 							= "8424";


/********************************************************************
 * Define IE Size
 ********************************************************************/
var _ECS_ECC_IE_SIZE_CODE						= 6;
var _ECS_ECC_IE_SIZE_LENGTH						= 8;
var _ECS_ECC_IE_SIZE_HEADER						= _ECS_ECC_IE_SIZE_CODE + _ECS_ECC_IE_SIZE_LENGTH;

/********************************************************************
 * Define IE Code
 ********************************************************************/
var _ECS_ECC_IE_RESULT 							= 67;
var _ECS_ECC_IE_CAUSE							= 68;
var _ECS_ECC_IE_CAUSE_STRING					= 69;
var _ECS_ECC_IE_JSON_ARRAY						= 21506
var _ECS_ECC_IE_TIMESTAMP	 					= 111;
var _ECS_ECC_IE_METHOD_KEY 						= 8001;
var _ECS_ECC_IE_METHOD_NAME 					= 8002;
var _ECS_ECC_IE_ROOM_KEY 						= 8101;
var _ECS_ECC_IE_ROOM_NAME 						= 8102;
var _ECS_ECC_IE_MEMBER_KEY 						= 8201;
var _ECS_ECC_IE_MEMBER_NAME 					= 8202;
var _ECS_ECC_IE_MEMBER_TYPE 					= 8203;
var _ECS_ECC_IE_SENDER_KEY 						= 8211;
var _ECS_ECC_IE_SENDER_NAME						= 8212;
var _ECS_ECC_IE_CHAT_MESSAGE 					= 8301;
var _ECS_ECC_IE_CHAT_MESSAGE_TYPE				= 8302;
var _ECS_ECC_IE_CHAT_EXTRA						= 8303;
var _ECS_ECC_IE_PAGE 							= 8311;
var _ECS_ECC_IE_PAGE_COUNT						= 8312;
var _ECS_ECC_IE_CODE_FLAG_MANAGER				= 8501;
var _ECS_ECC_IE_CODE_FLAG_CONTROL				= 8502;
var _ECS_ECC_IE_CODE_FLAG_ACTIVE				= 8503;
var _ECS_ECC_IE_CODE_FLAG_HOLD					= 8504;
/********************************************************************
 *
 * EMC Websocket Client
 * 
 * Make by supark
 * 2019.03.04
 *
 ********************************************************************/

/********************************************************************
 * Util Function
 ********************************************************************/
Number.prototype.zf = function(len){ return this.toString().zf(len); }
String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/gi, ""); }
String.prototype.zf = function(len){ return "0".string(len - this.length) + this; }
String.prototype.replaceAll = function(org, dest) { return this.split(org).join(dest); }
String.prototype.string = function(len) { var s = "", i = 0; while (i++ < len) { s += this; } return s; }
String.prototype.byte = function() {
	var str = this;
	var l = 0;
	for (var i=0; i<str.length; i++) l += (str.charCodeAt(i) > 128) ? 2 : 1;
	return l;
}
String.prototype.cutByte = function(len) {
	var str = this;
	var l = 0;
	for (var i=0; i<str.length; i++) {
		l += (str.charCodeAt(i) > 128) ? 2 : 1;
		if (l > len) return str.substring(0,i);
	}
	return str;
}
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
    var weekName = ["월", "화", "수", "목", "금", "토", "일"];
    var d = this;
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|SSS|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "SS": return d.getMilliseconds().zf(3);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

/********************************************************************
 * Library Function
 ********************************************************************/
function __ecs_chat_obj() {
    ecs_chat_obj = new Object();
    this.add = function (key, value) {
        ecs_chat_obj["" + key + ""] = value;
    }
    this.ecs_chat_obj = ecs_chat_obj
}
function __ecs_zero_padding(n, len) {
	n = n + "";
	return n.length >= len ? n : new Array(len - n.length + 1).join("0") + n;
} 
function __ecs_lastpendSpace(str, len) {
	str = str.toString();
	while(str.length < len) {
		str = str + " ";
	}
	return str;
}
function __ecs_document_string(a) {
	if (a == "") return {};
	return document.getElementById(a).value;
} 
function __ecs_text_length(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (escape(str.charAt(i)).length == 6) {
            // len++;
        }
        len++;
    }
    return len;
}
function obj() {
    obj = new Object();
    this.add = function(key,value) { obj[""+key+""]=value; }
    this.obj = obj
}
function __ecs_log(psGubun, pszClassName, pszFuncName, strLog) {
	var cur_Time = new Date().format("yyyy-MM-dd hh:mm:ss:SS");
	var logMessage ="[" + cur_Time + "]" + " " +
				"[" + __ecs_lastpendSpace(pszClassName,20) + "]" + " " +
				"[" + __ecs_lastpendSpace(pszFuncName,20) + "]" + " " +
				"[" + strLog + "]";
	console.log(logMessage)
	AddShowLog("txtShowEventLog", logMessage);
	//sendetsLog(psGubun,pszClassName,pszFuncName,logMessage);
}

var __ecs_chat_querystring = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split("=", 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split("&"));


/********************************************************************
 * Data
 ********************************************************************/
var __m_ecc_sequence 		= 0;
var __m_ecc_agent_id 		= "";
var __m_ecc_room_key 		= "";
var __m_ecc_socket_state 	= false;
var __m_ecc_socket_url 		= ECS_ECC_WEBSOCKET_TYPE + "://" + ECS_ECC_IP;

var __m_ecc_message = new Object();
	__m_ecc_message.m_nMsgLength 			= 0;
	__m_ecc_message.m_strMsgLength 			= "";
	__m_ecc_message.m_strSop	 			= "";
	__m_ecc_message.m_strMsgId 				= "";
	__m_ecc_message.m_strMsgType			= "";
	__m_ecc_message.m_strSeq				= "";
	__m_ecc_message.m_strReserved			= "";	
	__m_ecc_message.m_strData				= "";	
	__m_ecc_message.m_mapParam 				= new Map();
	__m_ecc_message.GetParam = function(key) {
		var str = this.m_mapParam.get(key);
		if (str == undefined){ return ""; }
		return str;
	}
	__m_ecc_message.SetParam = function(key, value) {
		this.m_mapParam.set(key, value);
	}
	__m_ecc_message.ClearParam = function(key, value) {
		this.m_mapParam.clear();
	}


/********************************************************************
 *
 * ECC WebSocket Function Start
 *
 ********************************************************************/
function __ECC_Connect() {
    var support = "MozWebSocket" in window ? "MozWebSocket" : ("WebSocket" in window ? "WebSocket" : null);
    if (support == null) { return; }
	if (__m_ecc_socket_state == false) { 
		__m_ecc_socket_fd = new WebSocket(__m_ecc_socket_url);
	}
  
    __m_ecc_socket_fd.onopen = function () {
    	__m_ecc_socket_state = true;
		OnEccLinkState("Connected");
        
    };
	__m_ecc_socket_fd.onmessage = function (event) {
     	var message = event.data;
		var strAlive = message.substr(_ECC_MSG_ALIVE_CHECK_POS, 4);
		if(strAlive == "9999"){
			__m_ecc_socket_fd.send(message);
			return;
		}
		__ECC_ProcMessage(message);
  	};
  	__m_ecc_socket_fd.onclose = function (event) {
  		__m_ecc_socket_state = false;
		__ECC_ConnectErr(event.code);
		OnEccLinkState("Disconnected");
  	};
  	__m_ecc_socket_fd.onerror = function(event){
  		__m_ecc_socket_state = false;
  		__ECC_ConnectErr(event.code);
	};
	return true;
}
function __ECC_Disconnect() {
	__m_ecc_socket_state = false;
	__m_ecc_socket_fd.close();
	return true;
}
function __ECC_SendMessage(pszCmd, pszPacket) {
    var strTemp = "";
    var nLength = __ecs_text_length(pszPacket);
    if (nLength > _ECC_MSG_MAX_SIZE) {
        strTemp = "invalid packet Length:" + nLength;
        return;
    } else {
        if (pszCmd == "Alive") {
            //ECSChat_Log("1","ECSChat_SendRequestMessage","Send Alive...");
            __m_ecc_socket_fd.send(pszPacket);
            return;
        }
        else {
            strTemp = "Data:" + pszPacket + " , SendResult:" + nLength;
        }
        __m_ecc_socket_fd.send(pszPacket);
	//	__ecs_log("0", "ECC_SendMessage", "SEND_REQ", "SEQ=" + __m_ecc_sequence + "][" + pszCmd);
    }
}
function __ECC_ConnectErr(strCode){
	var reason = "Unknown reason";
	// See http://tools.ietf.org/html/rfc6455#section-7.4.1
	if (strCode == 1000)
		reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
	else if(strCode == 1001)
		reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
	else if(strCode == 1002)
		reason = "An endpoint is terminating the connection due to a protocol error";
	else if(strCode == 1003)
		reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
	else if(strCode == 1004)
		reason = "Reserved. The specific meaning might be defined in the future.";
	else if(strCode == 1005)
		reason = "No status code was actually present.";
	else if(strCode == 1006)
		reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";	 
	else if(strCode == 1007)
		reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
	else if(strCode == 1008)
		reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
	else if(strCode == 1009)
		reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
	else if(strCode == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
		reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didnt return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
	else if(strCode == 1011)
		reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
	else if(strCode == 1015)
		reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate cant be verified).";
	else
		reason = "Unknown reason";

	return reason;
}
/********************************************************************
 *
 * ECC WebSocket Function End
 *
 ********************************************************************/

/********************************************************************
 *
 * ECC Message Function Start
 *
 ********************************************************************/
function __ECC_MakeMessageHeader(strMsgType, strCmd, nIELength) {
	/* Increase Sequence */	
    __m_ecc_sequence++;
    var strHeader = "";
    var strReserved = __ecs_zero_padding(0, 10);
    var nHeaderLength = _ECC_MSG_HEADER_SIZE + nIELength;
	
	strHeader = _ECS_ECC_MSG_SOP +
			__ecs_zero_padding(nHeaderLength, 8) +
			__ecs_zero_padding(__m_ecc_sequence, 5) +
			strMsgType +
			strReserved +
			strCmd;
    return strHeader;
}
function __ECC_MakeMessageIE(nCode, strValue) {
    if (strValue.toString().length < 1) { return ""; }
    var strValueLen = __ecs_text_length(strValue);
    nIELength = strValueLen + _ECS_ECC_IE_SIZE_HEADER;
    return __ecs_zero_padding(nCode, _ECS_ECC_IE_SIZE_CODE) + __ecs_zero_padding(nIELength, _ECS_ECC_IE_SIZE_LENGTH) + strValue;
}
function __ECC_MakeMessageIEList(arrCode, arrValue) {
    var arrIE = [];
	if(arrCode.length == arrValue.length) {
		for(var i=0 ; i<arrCode.length ; i++) {
			arrIE[i] = __ECC_MakeMessageIE(arrCode[i], arrValue[i]);
		}
	}
	return arrIE.join("");
}

function __ECC_ParseMessageHeader(strPacket) {
	var nInx = 0;
	if(strPacket.toString().length < _ECC_MSG_HEADER_SIZE) {
		return -9999;
	}
	/* Parse Message Header */
	__m_ecc_message.m_strSop 		= strPacket.substr(nInx, _ECC_MSG_SOP_SIZE); 					nInx += _ECC_MSG_SOP_SIZE;
	__m_ecc_message.m_strMsgLength	= strPacket.substr(nInx, _ECC_MSG_LEN_SIZE); 					nInx += _ECC_MSG_LEN_SIZE;
	__m_ecc_message.m_strSeq 		= parseInt(strPacket.substr(nInx, _ECC_MSG_SEQ_SIZE), 10); 		nInx += _ECC_MSG_SEQ_SIZE;
	__m_ecc_message.m_strMsgType 	= strPacket.substr(nInx, _ECC_MSG_TYPE_SIZE); 					nInx += _ECC_MSG_TYPE_SIZE;
	__m_ecc_message.m_strReserved 	= strPacket.substr(nInx, _ECC_MSG_RESERVED_SIZE); 				nInx += _ECC_MSG_RESERVED_SIZE;
	__m_ecc_message.m_strMsgId 		= strPacket.substr(nInx, _ECC_MSG_ID_SIZE); 					nInx += _ECC_MSG_ID_SIZE;
	
	/* Check SOP */
	if(_ECS_ECC_MSG_SOP != __m_ecc_message.m_strSop) { 
		return -9998; 
	}

	/* Check Message Length */
	__m_ecc_message.m_nMsgLength = parseInt(__m_ecc_message.m_strMsgLength,10);
	if(__m_ecc_message.m_nMsgLength < _ECC_MSG_HEADER_SIZE || __m_ecc_message.m_nMsgLength > _ECC_MSG_MAX_SIZE) {
		return -9997;
	}
	if(__m_ecc_message.m_nMsgLength != strPacket.length) {
		return -9996;
	}
	return nInx;
}
function __ECC_ParseMessage(strPacket) {
	var nInx = __ECC_ParseMessageHeader(strPacket);
	if(nInx < 0) { return nInx; }
	
	__m_ecc_message.ClearParam();
	while(nInx < __m_ecc_message.m_nMsgLength) {
		var nCode = "";
		var nLength = "";
		var strValue = "";
		
		nCode = parseInt(strPacket.substr(nInx, _ECS_ECC_IE_SIZE_CODE), 10);	nInx += _ECS_ECC_IE_SIZE_CODE;
		nLength = parseInt(strPacket.substr(nInx, _ECS_ECC_IE_SIZE_LENGTH), 10);	nInx += _ECS_ECC_IE_SIZE_LENGTH;
		if(nLength > _ECS_ECC_IE_SIZE_HEADER) {
			strValue = strPacket.substr(nInx, nLength - _ECS_ECC_IE_SIZE_HEADER);
			nInx += nLength - _ECS_ECC_IE_SIZE_HEADER
			__m_ecc_message.SetParam(nCode, strValue);
		}
	}
	return true;
}
/********************************************************************
 *
 * ECC Message Function End
 *
 ********************************************************************/


/********************************************************************
 *
 * EMC Process Function Start
 *
 ********************************************************************/
function __ECC_ProcMessage(strMsg) {   
	var nRet = __ECC_ParseMessage(strMsg);
	if(nRet <= false) { return false; }
	
	var pstrMsgID = __m_ecc_message.m_strMsgId;
	if(pstrMsgID == "" || pstrMsgID.toString().length <= 0) {
		logMsg = "MSG ID Error!!!! MSG[" + strMsg + "]";
		return false;
	}
	switch (__m_ecc_message.m_strMsgType) {
		case _ECS_ECC_MSG_TYPE_RESP:
			nRet = __ECC_OnResponse();
			break;
		default:	
			switch (pstrMsgID)
			{
				case EVT_ECC_MESSAGE:
					nRet = __ECC_OnMessageRecv();
					break;
				case EVT_ECC_CLOSE:
					nRet = __ECC_OnCloseRecv();
					break;
				case EVT_ECC_HOLD:
					nRet = __ECC_OnHoldRecv();
					break;
				default:
					logMsg = "INVALID MSGID!!!! MSGID[" + pstrMsgID + "] " + "MSG[" + strMsg + "]";
					__ecs_log("0", "ProcMessage", "ERR", logMsg);
					break;
			}
	}			
	return true;
}
function __ECC_OnResponse() {	
	var pstrMsgID = __m_ecc_message.m_strMsgId;
	if(pstrMsgID == "" || pstrMsgID.toString().length <= 0) {
		logMsg = "MSG ID Error!!!! MSG[" + strMsg + "]";
		return false;
	}
	var strReturn = "";
	strReturn = __m_ecc_message.GetParam(_ECS_ECC_IE_RESULT);

	switch (pstrMsgID)
	{
		case ECS_ECC_RESP_LOGIN:
			if(strReturn=="1")
			//	OnEccLogined();
			break;
		case ECS_ECC_RESP_JOIN:
			if(strReturn=="1")
			//	OnEccJoined(__m_ecc_agent_id,__m_ecc_room_key);
			break;
		case ECS_ECC_RESP_EXIT:
			if(strReturn=="1")
			//	OnEccExited(__m_ecc_agent_id,__m_ecc_room_key);
			break;
		case ECS_ECC_RESP_MESSAGE_LIST :
			if(strReturn=="1")
			//	OnEccGetMessageList();
			break;
		case ECS_ECC_RESP_HOLD :
			if(strReturn=="1")
			//	OnEccGetMessageList();
			break;
		case ECS_ECC_RESP_MESSAGE: 
			if(strReturn=="1")
				__ECC_OnMessageSend();
			break;
		default:
			break;
	}
	
	
	/* Send Event On Page */
	
	OnEccReturn(
			__m_ecc_message.m_strMsgType, 
			__m_ecc_message.m_strSeq, 
			__m_ecc_message.m_strMsgId, 
			__m_ecc_message.GetParam(_ECS_ECC_IE_RESULT),
			__m_ecc_message.GetParam(_ECS_ECC_IE_CAUSE_STRING),
			__m_ecc_message.GetParam(_ECS_ECC_IE_JSON_ARRAY)
			);
	/* Send Log */
    __ecs_log("0", "ECC OnEccReturn", "RESP_RECV",
     "SEQ:" + __m_ecc_message.m_strSeq 
     + "][RESULT:" + __m_ecc_message.GetParam(_ECS_ECC_IE_RESULT) 
     + "][CAUSE_STRING:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CAUSE_STRING) 
     + "][JSON_ARRAY:" + __m_ecc_message.GetParam(_ECS_ECC_IE_JSON_ARRAY));
}


function __ECC_OnMessageRecv() {	
	/* Send Event On Page */
	OnEccMessage(
			__m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_TYPE),
			//"recv",
			__m_ecc_message.GetParam(_ECS_ECC_IE_SENDER_KEY),
			__m_ecc_message.GetParam(_ECS_ECC_IE_ROOM_KEY), 
			__m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_KEY), 
            __m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_MESSAGE)
            .replace(/\\n/g, "\n")
            .replace(/\\'/g, "\'")
            .replace(/\\"/g, '\"')
            .replace(/\\&/g, "\&")
            .replace(/\\r/g, "\r")
            .replace(/\\t/g, "\t")
			.replace(/\\f/g, "\f") , 
			__m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_EXTRA),
			__m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_MESSAGE_TYPE),
			__m_ecc_message.GetParam(_ECS_ECC_IE_TIMESTAMP)

			
			
			);
    __ecs_log("0", "ECC OnEccMessage", "RESP_RECV", 
            "MEMBER_TYPE:" + __m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_TYPE)  
            + "][SENDER_KEY:" + __m_ecc_message.GetParam(_ECS_ECC_IE_SENDER_KEY) 
            + "][ROOM_KEY:" + __m_ecc_message.GetParam(_ECS_ECC_IE_ROOM_KEY) 
            + "][MEMBER_KEY:" + __m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_KEY) 
			+ "][CHAT_MESSAGE:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_MESSAGE)
			+ "][CHAT_EXTRA:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_EXTRA)
			+ "][CHAT_MESSAGE_TYPE:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_MESSAGE_TYPE)
            .replace(/\\n/g, "\n")
 //           .replace(/\\'/g, "\'")
            .replace(/\\"/g, '\"')
 //           .replace(/\\&/g, "\&")
 //           .replace(/\\r/g, "\r")
 //           .replace(/\\t/g, "\t")
 //           .replace(/\\f/g, "\f") 
            + "][TIMESTAMP:" + __m_ecc_message.GetParam(_ECS_ECC_IE_TIMESTAMP));
}

function __ECC_OnCloseRecv() {	
	/* Send Event On Page */
	OnEccClose(
			__m_ecc_message.GetParam(_ECS_ECC_IE_ROOM_KEY)
			);
	__ecs_log("0", "ECC OnClose", "CLOSE_RECV", __m_ecc_message.GetParam(_ECS_ECC_IE_ROOM_KEY));
}
function __ECC_OnHoldRecv() {	
	/* Send Event On Page */
	OnEccHold(
			__m_ecc_message.GetParam(_ECS_ECC_IE_ROOM_KEY),
			__m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_KEY),
			__m_ecc_message.GetParam(_ECS_ECC_IE_CODE_FLAG_MANAGER),
			__m_ecc_message.GetParam(_ECS_ECC_IE_CODE_FLAG_ACTIVE),
			__m_ecc_message.GetParam(_ECS_ECC_IE_CODE_FLAG_HOLD),
			);
	__ecs_log("0", "ECC OnHold", "HOLD_RECV", 
			"ROOM_KEY:" + __m_ecc_message.GetParam(_ECS_ECC_IE_ROOM_KEY)  
			+ "][MEMBER_KEY:" + __m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_KEY) 
			+ "][FLAG_MANAGER:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CODE_FLAG_MANAGER) 
			+ "][FLAG_ACTIVE:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CODE_FLAG_ACTIVE) 
            + "][FLAG_HOLD:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CODE_FLAG_HOLD));

}
function __ECC_OnMessageSend() {	
	/* Send Event On Page */
	OnEccMessage(
			__m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_TYPE),
			//"AGENT",
			__m_ecc_message.GetParam(_ECS_ECC_IE_SENDER_KEY),
			__m_ecc_message.GetParam(_ECS_ECC_IE_ROOM_KEY), 
			__m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_KEY), 
			__m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_MESSAGE), 
			__m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_EXTRA),
			__m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_MESSAGE_TYPE), 
			__m_ecc_message.GetParam(_ECS_ECC_IE_TIMESTAMP)
            );
    __ecs_log("0", "ECC OnEccMessage", "RESP_SEND", 
            "MEMBER_TYPE:" + __m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_TYPE)  
            + "][SENDER_KEY:" + __m_ecc_message.GetParam(_ECS_ECC_IE_SENDER_KEY) 
            + "][ROOM_KEY:" + __m_ecc_message.GetParam(_ECS_ECC_IE_ROOM_KEY) 
            + "][MEMBER_KEY:" + __m_ecc_message.GetParam(_ECS_ECC_IE_MEMBER_KEY) 
			+ "][CHAT_MESSAGE:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_MESSAGE) 
			+ "][CHAT_EXTRA:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_EXTRA)
			+ "][CHAT_MESSAGE_TYPE:" + __m_ecc_message.GetParam(_ECS_ECC_IE_CHAT_MESSAGE_TYPE) 
            + "][TIMESTAMP:" + __m_ecc_message.GetParam(_ECS_ECC_IE_TIMESTAMP));
}




/********************************************************************
 *
 * EMC Process Function End
 *
 ********************************************************************/

/********************************************************************
 *
 * Custom UI Function Start
 *
 ********************************************************************/
function JS_ECC_ConnectToServer(agentID) {
    __m_ecc_agent_id = agentID;
    if (__m_ecc_socket_state == false) {
        __ECC_Connect();
    }
}
function JS_ECC_DisConnectToServer() {
    __m_ecc_agent_id = "";
    __ECC_Disconnect();
}
function JS_ECC_Login() {	
    
    if(__m_ecc_socket_state == false) { return -1; }
   
	var arrCode = [_ECS_ECC_IE_MEMBER_KEY];
	var arrValue = [__m_ecc_agent_id];
	var strIE = __ECC_MakeMessageIEList(arrCode, arrValue);
    var strPacket = __ECC_MakeMessageHeader(_ECS_ECC_MSG_TYPE_REQ, ECS_ECC_REQ_LOGIN, strIE.length) + strIE;
    __ECC_SendMessage("ECS_ECC_REQ_LOGIN", strPacket);
	return __m_ecc_sequence;
}
function JS_ECC_Hold(roomkey, ismanager, isactive,ishold) {	
	if(__m_ecc_socket_state == false) { return -1; }

	__m_ecc_room_key = roomkey;
	var arrCode = [
					_ECS_ECC_IE_MEMBER_KEY,
					_ECS_ECC_IE_ROOM_KEY,
					_ECS_ECC_IE_CODE_FLAG_MANAGER,
					_ECS_ECC_IE_CODE_FLAG_ACTIVE,
					_ECS_ECC_IE_CODE_FLAG_HOLD
				  ];
	var arrValue = [
					__m_ecc_agent_id,
					__m_ecc_room_key,
					ismanager,
					isactive,
					ishold
				   ];
	var strIE = __ECC_MakeMessageIEList(arrCode, arrValue);
    var strPacket = __ECC_MakeMessageHeader(_ECS_ECC_MSG_TYPE_REQ, ECS_ECC_REQ_HOLD, strIE.length) + strIE;
    __ECC_SendMessage("ECS_ECC_REQ_HOLD", strPacket);
	return __m_ecc_sequence;
}
function JS_ECC_Join(roomkey,ismanager, iscontrol) {	
	if(__m_ecc_socket_state == false) { return -1; }

	__m_ecc_room_key = roomkey;
	var arrCode = [
					_ECS_ECC_IE_MEMBER_KEY,
					_ECS_ECC_IE_ROOM_KEY,
					_ECS_ECC_IE_CODE_FLAG_MANAGER,
					_ECS_ECC_IE_CODE_FLAG_CONTROL
				  ];
	var arrValue = [
					__m_ecc_agent_id,
					__m_ecc_room_key,
					ismanager,
					iscontrol
				   ];
	var strIE = __ECC_MakeMessageIEList(arrCode, arrValue);
    var strPacket = __ECC_MakeMessageHeader(_ECS_ECC_MSG_TYPE_REQ, ECS_ECC_REQ_JOIN, strIE.length) + strIE;
    __ECC_SendMessage("ECS_ECC_REQ_JOIN", strPacket);
	return __m_ecc_sequence;
}
function JS_ECC_Exit(roomkey) {	
	__m_ecc_room_key = roomkey;
	if(__m_ecc_socket_state == false) { return -1; }
	var arrCode = [
					_ECS_ECC_IE_MEMBER_KEY,
					_ECS_ECC_IE_ROOM_KEY
				  ];
	var arrValue = [
					__m_ecc_agent_id,
					__m_ecc_room_key
				   ];
	var strIE = __ECC_MakeMessageIEList(arrCode, arrValue);
    var strPacket = __ECC_MakeMessageHeader(_ECS_ECC_MSG_TYPE_REQ, ECS_ECC_REQ_EXIT, strIE.length) + strIE;
    __ECC_SendMessage("ECS_ECC_REQ_EXIT", strPacket);
	return __m_ecc_sequence;
}
function JS_ECC_SendMessage(message,roomkey,msgtype,extra) {
	if(message.length <= 0) { return false; }	
	__m_ecc_room_key = roomkey
	if(__m_ecc_socket_state == false) { return -1; }
	var arrCode = [
					_ECS_ECC_IE_MEMBER_KEY,
					_ECS_ECC_IE_ROOM_KEY,
					_ECS_ECC_IE_CHAT_MESSAGE,
					_ECS_ECC_IE_CHAT_MESSAGE_TYPE,			
					_ECS_ECC_IE_CHAT_EXTRA	
				  ];
	if(msgtype == "image")
	{
		arrValue = [
			__m_ecc_agent_id,
			__m_ecc_room_key,
			message,
			msgtype,
			extra
		
			];
	}
	else
	{
		arrValue = [
			__m_ecc_agent_id,
			__m_ecc_room_key,
			message
			.replace(/\n/g, "\\n").replace(/\"/g, '\\"'),
			msgtype,
			extra,
			];
	}
	var strIE = __ECC_MakeMessageIEList(arrCode, arrValue);
    var strPacket = __ECC_MakeMessageHeader(_ECS_ECC_MSG_TYPE_REQ, ECS_ECC_REQ_MESSAGE, strIE.length) + strIE;
    __ECC_SendMessage("ECS_ECC_REQ_MESSAGE", strPacket);
	return __m_ecc_sequence;
}

function JS_ECC_GetMessageList(roomkey,page,pagecount) {
    
	__m_ecc_room_key = roomkey
	if(__m_ecc_socket_state == false) { return -1; }
	var arrCode = [
					_ECS_ECC_IE_ROOM_KEY,
					_ECS_ECC_IE_PAGE ,
					_ECS_ECC_IE_PAGE_COUNT	
				  ];
	var arrValue = [
					__m_ecc_room_key,
					page,
					pagecount
                   ];
      
	var strIE = __ECC_MakeMessageIEList(arrCode, arrValue);
    var strPacket = __ECC_MakeMessageHeader(_ECS_ECC_MSG_TYPE_REQ, ECS_ECC_REQ_MESSAGE_LIST	, strIE.length) + strIE;
    __ECC_SendMessage("ECS_ECC_REQ_MESSAGE_LIST	", strPacket);
	return __m_ecc_sequence;
}
/********************************************************************
 *
 * Custom UI Function End
 *
 ********************************************************************/

