import "../../../const/CounselFlowHubCode"

window.CounselFlowHubChatCode = Object.freeze(Object.assign({}, CounselFlowHubCode, {
    ChannelState: {
        NOTLOGIN: "NOTLOGIN",		            // 로그인이 아닌 상태
        READY: "READY",			                // 대기 중
        ABSENCE: "ABSENCE",		                // 이석
        PROCESS: "PROCESS",		                // 작업
        OFFERING: "OFFERING",		            // 채팅 오는 중
    },

    ChatState: { //RoomState
        WAIT_ACCEPT: "WAIT_ACCEPT",         // 채팅 수락 대기중
        CHATTING: "CHATTING",               // 채팅 중
        STANDBY: "STANDBY",                 // 채팅 대기전환 상태
        HOLD: "HOLD",                       // 채팅 유지(보류) 상태
        TRANSFERRING: "TRANSFERRING",       // 상담원 전환 요청중
        PROCESS: "PROCESS",		            // 작업
        FINISH: "FINISH",                   // 채팅종료
    }
}));

