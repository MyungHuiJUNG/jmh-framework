export default Object.freeze({
  IvrDnCode: {
    SEXUAL: "4013", // 성희롱
    CURSE: "4014", // 욕설
    AGREE: "4011", // 동의
    CARD: "16668820", //  (카드결제)
    MOBILE: "01030250009", //임시
    CENTER: "4015", //24시간 상담센터
    BIRTHDAY: "4012",
    SOCIAL: "4010", //주민번호
    PERSONAL_INFO: "4017",
    // 901035714040
  },
  LeaveSubStateCodeName: {
    REST: "휴식", // rest
    MEAL: "식사", // meal
    EDU: "교육", // edu
    WORK: "타업무", // work
  },

  LeaveSubStateCode: {
    REST: "0", // rest
    MEAL: "1", // meal
    EDU: "2", // edu
    WORK: "3", // work
  },

  StateCodeName: {
    NOTLOGIN: "OFF",
    READY: "대기",
    ABSENCE: "이석",
    PROCESS: "통화종료",
    RINGBACK: "다이얼중",
    OFFERING: "벨울림",
    BUSY: "BUSY",
    ACTIVE: "통화중",
    HELD: "보류중",
    MISS: "호놓침",
    LOGIN: "로그인",
  },

  StateBarColor: {
    WHITE: "#818181",
    PINK: "#b92d2d",
    BLUE: "#007cc4",
  },

  // 시스템 변수 설정값이 없을 경우에 들어가는 기본값임. 실제는 시스템 변수에 설정한 값으로 적용됌
  // systemVariableStore 참고
  CtiServerInfo: {
    APPNAME: "CounselFlowApp",
    PROTOCOL: "https",
    ACTIVESERVER: "100.100.107.147",
    ACTIVEPORT: "9203",
    STANDBYSERVER: "100.100.107.147",
    STANDBYPORT: "9203",
    TENANT: "기본테넌트",
  },

  GetCounselFlowHubErrorMessage(ex) {
    if (ex.original) {
      console.log("[Original Code] ", ex.original);
      let value =
        this.CounselFlowHubErrorCode[ex.code] +
        "(O-Code : " +
        ex.original.code +
        ", Method : " +
        ex.original.method +
        ")";
      return value;
    } else {
      console.log("[Ex Code] ", ex);
      if (ex.code === "9999") {
        let value = this.CounselFlowHubErrorCode[ex.code] + "(Code : " + ex.code + ")";
        return value;
      } else {
        return this.CounselFlowHubErrorCode[ex.code];
      }
    }
  },

  CounselFlowHubErrorCode: {
    1001: "로그인에 실패하였습니다.(Code:2001)",
    1002: "이미 로그인 되어있습니다.(VCode:1002)",
    1003: "이미 로그인을 시도중입니다.(VCode:1003)",
    1004: "잘못된 AGENT/TENANT 아이디입니다.(Code:2110)", //2103(잘못된 테넌트 아이디), 2105(잘못된 에이젼트아이디) 2106 그룹찾을 수 없음, 2107 queue 찾을수없음, 2110 커넥션 찾을 수 없음, 2111 콜 찾을 수 없음
    1005: "잘못된 비밀번호입니다.(Code:2502)",
    1006: "다른 사용자가 이 내선번호를 사용중입니다.(VCode:1006)",
    2001: "채널에 로그인 되어있지 않습니다.(VCode:2001)",
    2002: "채널상태가 유효하지 않습니다.(Code:2402)", //유효하지 않은 사용자 상태
    2003: "내선번호가 유효하지 않습니다.(Code:2101)",
    2004: "invalid destinated state(VCode:2004)",
    2005: "invalid destinated number(VCode:2005)",
    2006: "에이젼트 서비스가 유효하지 않습니다.(VCode:2006)",
    2007: "매개변수가 잘못되었습니다.(VCode:2007)",
    3001: "통화상태가 유효하지 않습니다.(Code:2405)", // 유효하지 않은 커멕션 및 UCID
    4001: "다른 명령을 실행중입니다.(VCode:4001)",
    5001: "실행을 위한 리소스가 존재하지 않습니다.(VCode:5001)",
    5002: "전환을 위한 콜 정보가 존재하지 않습니다.(VCode:5002)",
    9997: "서버연결 오류(VCode:9997)",
    9998: "타임아웃 오류(VCode:9998)",
    9999: "정의되지 않은 에러가 발생하였습니다.",
  },
});
