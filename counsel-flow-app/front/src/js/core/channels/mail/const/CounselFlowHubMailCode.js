import "../../../const/CounselFlowHubCode"

window.CounselFlowHubMailCode = Object.freeze(Object.assign({}, CounselFlowHubCode, {
    ChannelState: {
        NOTLOGIN: "NOTLOGIN",		// 로그인이 아닌 상태
        READY: "READY",			    // 대기 중
        ABSENCE: "ABSENCE",		    // 이석
        PROCESS: "PROCESS",		    // 작업
        OFFERING: "OFFERING"        // 메일 수신 중
    },

    MailState: {
        WAIT_ACCEPT: "WAIT_ACCEPT",                     // 메일 수락 대기중
        CONNECTED: "CONNECTED",                         // 메일 연결
        PROCESS: "PROCESS",		                        		     // 작업
        TRANSFERRING: "TRANSFERRING",                   // 상담원 전환 요청중
        COMPLETE_TRANSFER: "COMPLETE_TRANSFER",         // 상담원 전환 성공
        FAILED_TRANSFER: "FAILED_TRANSFER",             // 상담원 전환 실패
        FINISH: "FINISH"                                // 채팅종료
    }
}));

