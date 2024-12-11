import "../../../const/CounselFlowHubCode"

window.CounselFlowHubVoiceCode = Object.freeze(Object.assign({}, CounselFlowHubCode, {
    ChannelState: {
        NOTLOGIN: "NOTLOGIN",		// 로그인이 아닌 상태
        READY: "READY",			    // 대기 중
        ABSENCE: "ABSENCE",		    // 이석
        PROCESS: "PROCESS",		    // 작업
        RINGBACK: "RINGBACK",		// 전화 거는 중 kebhana01
        OFFERING: "OFFERING",		// 전화 오는 중
        BUSY: "BUSY",               // 수화기를 든 상태
        ACTIVE: "ACTIVE",			// 통화 중
        HELD: "HELD"			    // 통화 보류
    },

    CallType: {
        NORMAL: "NORMAL",
        CONSULT: "CONSULT",
        TRANSFER: "TRANSFER",
        CONFERENCE: "CONFERENCE",
        IVR: "IVR",
        AOD: "AOD"
    },

    DialType: {
        EXTERNAL: "EXTERNAL",
        INTERNAL: "INTERNAL"
    },

    ReasonType: {
        ABSENCE: "ABSENCE",
        REJECTCALL: "REJECTCALL",
        LOGOUT: "LOGOUT"
    },

    Direction: {
        INBOUND: "IB",
        OUTBOUND: "OB"
    }
}));

