<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance, computed, watch } from "vue";
import { useQuasar } from "quasar";
import AIconBtn from "components/AIconBtn.vue";
import { useAuthStore } from "stores/authStore";
import VoiceCommonCode from "boot/VoiceCommonCode";
import { showAlert, showConfirm } from "src/js/common/dialog.js";
import { useMainTabStore } from "src/stores/mainTab";
import { Menu } from "src/js/menu";
import CallInLayerPop from "components/call/CallInLayerPop.vue";
import CallOutLayerPop from "components/call/CallOutLayerPop.vue";
import CallTransferLayerPop from "components/call/CallTransferLayerPop.vue";
import { useSystemVariableStore } from "src/stores/systemVariableStore";
import authApi from "src/js/api/authApi";

defineExpose({ logoutAndDisconnectWhenUserLogOut });

const systemVariableStore = useSystemVariableStore();

const $q = useQuasar();
const mainTabStore = useMainTabStore();
const authStore = useAuthStore();

const emitter = getCurrentInstance().appContext.config.globalProperties.$emitter;
const counselHub = getCurrentInstance().appContext.config.globalProperties.$counselHub;
const channel = getCurrentInstance().appContext.config.globalProperties.$channel;

const channelType = CounselFlowHubVoiceType.IPRON_V5;
const autoLoggedIn = ref(false);
const leaveCodeAreaStyleDisplay = ref("none");
const isAgreementResultMessage = ref(false);
const eventStatus = ref(null);
const dialType = CounselFlowHubVoiceCode.DialType.INTERNAL;
const eventData = ref(null);

const ms = ref(0);
const state = ref(0);
const now = ref("");
const then = ref("");

const OP = {
  CALL: "CALL",
  RECV: "RECV",
  HANG_UP: "HANG_UP",
  HOLD_OFF: "HOLD_OFF",
  SWITCH: "SWITCH",
  WAIT: "WAIT",
  REST: "REST",
  EATING: "EATING",
};

const leaveSubCode = {
  WORK: VoiceCommonCode.LeaveSubStateCode.WORK,
  MEAL: VoiceCommonCode.LeaveSubStateCode.MEAL,
  REST: VoiceCommonCode.LeaveSubStateCode.REST,
  EDU: VoiceCommonCode.LeaveSubStateCode.EDU,
};

const toolbarStatus = ref({
  isWorkBtn: false,
  isMealBtn: false,
  isRestBtn: false,
  isEduBtn: false,
});

// const channelOption = {
//   appName: VoiceCommonCode.CtiServerInfo.APPNAME,
//   protocol: VoiceCommonCode.CtiServerInfo.PROTOCOL,
//   activeServer: VoiceCommonCode.CtiServerInfo.ACTIVESERVER,
//   activePort: VoiceCommonCode.CtiServerInfo.ACTIVEPORT,
//   standbyServer: VoiceCommonCode.CtiServerInfo.STANDBYSERVER,
//   standbyPort: VoiceCommonCode.CtiServerInfo.STANDBYPORT,
//   tenant: VoiceCommonCode.CtiServerInfo.TENANT,
//   stateAfterLogin: null,
//   stateAfterCall: CounselFlowHubVoiceCode.ChannelState.PROCESS, // ABSENCE or READY or PROCESS
// };

const channelOption = ref(
  computed(() => ({
    appName: systemVariableStore.ctiServerInfo.APPNAME,
    protocol: systemVariableStore.ctiServerInfo.PROTOCOL,
    activeServer: systemVariableStore.ctiServerInfo.ACTIVESERVER,
    activePort: systemVariableStore.ctiServerInfo.ACTIVEPORT,
    standbyServer: systemVariableStore.ctiServerInfo.STANDBYSERVER,
    standbyPort: systemVariableStore.ctiServerInfo.STANDBYPORT,
    tenant: systemVariableStore.ctiServerInfo.TENANT,
    stateAfterLogin: null,
    stateAfterCall: CounselFlowHubVoiceCode.ChannelState.PROCESS, // ABSENCE or READY or PROCESS
  }))
);

const ctiLoginInfo = ref({
  id: "",
  name: "",
  password: "",
  extension: "",
  reasonCode: "",
});

const toolbar = ref({
  isOffCallingBtn: true,
  isOffAcceptBtn: true,
  isOffHangUpBtn: true,
  isOffTransBtn: true,
  isOffLeaveBtn: true,
  isLeaveClicked: true,
  isOffHeldBtn: true,
  isHeldClicked: true,
  isOffReadyBtn: true,
  isReadyClicked: true,
  isOffCurseBtn: true,
  isOffSexualBtn: true,
  isOffCardBtn: true,
  isOffAgreeBtn: true,
  backgroundColor: VoiceCommonCode.StateBarColor.WHITE,
  status: VoiceCommonCode.StateCodeName.NOTLOGIN,
  callOnOffClass: { "voice-off": true, "voice-on": false },
  timer: "00:00:00",
});

const Status = {
  // 로그인 안 된 상태
  NOTLOGIN: {
    channelState: VoiceCommonCode.StateCodeName.NOTLOGIN,
    toolbar_backgroundColor: VoiceCommonCode.StateBarColor.WHITE,
    changeButtonStateOnOff: {
      ctiOnBtn: false, // 로그인 안된상태
      callingBtn: false,
      acceptBtn: false,
      hangupBtn: false,
      readyBtn: false,
      transBtn: false,
      heldBtn: false,
      leaveBtn: false,
      curseBtn: false,
      SexualBtn: false,
    },
    changeButtonStateClickAndUnClick: { readyBtn: false, heldBtn: false, leaveBtn: false },
    func: funcNotlogin,
  },

  // 대기
  READY: {
    channelState: VoiceCommonCode.StateCodeName.READY,
    toolbar_backgroundColor: VoiceCommonCode.StateBarColor.BLUE,
    changeButtonStateOnOff: {
      ctiOnBtn: true,
      callingBtn: true, // 걸기
      acceptBtn: false,
      hangupBtn: false,
      readyBtn: false,
      transBtn: false,
      heldBtn: false,
      leaveBtn: true, // 이석
      curseBtn: false,
      SexualBtn: false,
    },
    changeButtonStateClickAndUnClick: { readyBtn: false, heldBtn: false, leaveBtn: true }, // 이석
    func: funcReady,
  },

  // 이석
  ABSENCE: {
    channelState: VoiceCommonCode.StateCodeName.ABSENCE,
    changeButtonStateOnOff: {
      ctiOnBtn: true,
      callingBtn: true, // 걸기
      acceptBtn: false,
      hangupBtn: false,
      readyBtn: true, // 대기
      transBtn: false,
      heldBtn: false,
      leaveBtn: true, // 이석 (다른상태로 전환)
      curseBtn: false,
      SexualBtn: false,
    },
    changeButtonStateClickAndUnClick: { readyBtn: true, heldBtn: false, leaveBtn: true }, // 대기, 이석
    func: funcAbsence,
  },

  // 전화 왔을 때
  OFFERING: {
    channelState: VoiceCommonCode.StateCodeName.OFFERING,
    toolbar_backgroundColor: VoiceCommonCode.StateBarColor.BLUE,
    changeButtonStateOnOff: {
      ctiOnBtn: true,
      callingBtn: false,
      acceptBtn: true, // 받기
      hangupBtn: true, // 끊기
      readyBtn: false,
      transBtn: false,
      heldBtn: false,
      leaveBtn: false,
      curseBtn: false,
      SexualBtn: false,
    },
    changeButtonStateClickAndUnClick: { readyBtn: false, heldBtn: true, leaveBtn: false }, // 보류
    func: funcOffering,
  },

  // 통화중
  ACTIVE: {
    channelState: VoiceCommonCode.StateCodeName.ACTIVE,
    toolbar_backgroundColor: VoiceCommonCode.StateBarColor.BLUE,
    changeButtonStateOnOff: {
      ctiOnBtn: true,
      callingBtn: false,
      acceptBtn: false,
      hangupBtn: true, // 끊기
      readyBtn: false,
      transBtn: true, // 호전환
      heldBtn: true, // 보류
      leaveBtn: false,
      curseBtn: true, // 욕설
      SexualBtn: true, // 성희롱
    },
    changeButtonStateClickAndUnClick: { readyBtn: false, heldBtn: true, leaveBtn: false }, // 보류
    func: funcActive,
  },

  // 후처리
  PROCESS: {
    channelState: VoiceCommonCode.StateCodeName.PROCESS,
    toolbar_backgroundColor: VoiceCommonCode.StateBarColor.PINK,
    changeButtonStateOnOff: {
      ctiOnBtn: true,
      callingBtn: true, // 걸기
      acceptBtn: false,
      hangupBtn: false,
      readyBtn: true, // 대기
      transBtn: false,
      heldBtn: false,
      leaveBtn: true, // 이석
      curseBtn: false,
      SexualBtn: false,
    },
    changeButtonStateClickAndUnClick: { readyBtn: true, heldBtn: false, leaveBtn: true }, // 대기, 이석
    func: funcProcess,
  },

  // 보류
  HELD: {
    channelState: VoiceCommonCode.StateCodeName.HELD,
    toolbar_backgroundColor: VoiceCommonCode.StateBarColor.BLUE,
    changeButtonStateOnOff: {
      ctiOnBtn: true,
      callingBtn: false,
      acceptBtn: false,
      hangupBtn: false,
      readyBtn: false,
      transBtn: false,
      heldBtn: true, // 보류
      leaveBtn: false,
      curseBtn: false,
      SexualBtn: false,
    },
    changeButtonStateClickAndUnClick: { readyBtn: false, heldBtn: true, leaveBtn: false }, // 보류
    func: funcHeld,
  },

  // 전화 거는 중
  RINGBACK: {
    channelState: VoiceCommonCode.StateCodeName.RINGBACK,
    toolbar_backgroundColor: VoiceCommonCode.StateBarColor.BLUE,
    changeButtonStateOnOff: {
      ctiOnBtn: true,
      callingBtn: false,
      acceptBtn: false,
      hangupBtn: true, // 끊기
      readyBtn: false,
      transBtn: false,
      heldBtn: false,
      leaveBtn: false,
      curseBtn: false,
      SexualBtn: false,
    },
    changeButtonStateClickAndUnClick: { readyBtn: false, heldBtn: false, leaveBtn: false },
    func: funcRingback,
  },

  // 호놓침
  MISS: {
    channelState: VoiceCommonCode.StateCodeName.MISS,
    toolbar_backgroundColor: VoiceCommonCode.StateBarColor.PINK,
    changeButtonStateOnOff: {
      ctiOnBtn: true,
      callingBtn: true, // 걸기
      acceptBtn: false,
      hangupBtn: false,
      readyBtn: true, // 대기
      transBtn: false,
      heldBtn: false,
      leaveBtn: true, // 이석
      curseBtn: false,
      SexualBtn: false,
    },
    changeButtonStateClickAndUnClick: { readyBtn: true, heldBtn: false, leaveBtn: true }, // 대기, 이석
    func: funcMiss,
  },
  BUSY: {
    func: funcBusy,
  },
};

const dialogInstance = ref(null);

function setChannelOption() {
  channel.options = channelOption.value;
}

watch(
  channelOption,
  (newVal) => {
    setChannelOption();
  },
  { immediate: true }
);

onMounted(() => {
  setChannelOption();
  window.addEventListener("beforeunload", logoutAndDisconnectWhenWindowUnload);
  emitter.on("dial", dial);
  emitter.on("ready", ready);
  emitter.on("absence", absence);
  emitter.on("conference", conference);
  emitter.on("executeAgreeArs", executeAgreeArs);
  emitter.on("makeConsultCall", consult);
  setCtiLoginInfo();
  try {
    counselHub.addEventCallback(processEvent);
    if (authStore.ctiAutoLogin) connectAndLogin();
  } catch (error) {}
});

onUnmounted(() => {
  console.log("[SoftPhone Unmounted]");
  try {
    counselHub.removeEventCallback(processEvent);
  } catch (error) {}
  emitter.off("dial", dial);
  emitter.off("ready", ready);
  emitter.off("absence", absence);
  emitter.off("conference", conference);
  emitter.off("executeAgreeArs", executeAgreeArs);
  emitter.off("makeConsultCall", consult);
});

function setCtiLoginInfo() {
  ctiLoginInfo.value.id = authStore.ctiLoginId ? authStore.ctiLoginId : "";
  ctiLoginInfo.value.password = authStore.ctiLoginPassword ? authStore.ctiLoginPassword : "";
  ctiLoginInfo.value.extension = authStore.ctiExtension ? authStore.ctiExtension : "";
  ctiLoginInfo.value.name = authStore.name;
}

function ctiOnOff() {
  if (channel.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.ACTIVE) {
    showAlert("통화중에는 OFF전환이 불가능합니다.");
    return;
  }

  if (!ctiLoginInfo.value?.id) {
    showAlert("CTI AgentID가 없습니다. 관리자에게 문의하세요.");
    return;
  }

  if (!ctiLoginInfo.value?.extension) {
    showAlert("내선번호가 없습니다.");
    return;
  }

  if (channel.connected) {
    showConfirm("로그아웃 하시겠습니까?").then((clickedValue) => {
      if (clickedValue) logoutAndDisconnect();
    });
  } else {
    showConfirm("로그인 하시겠습니까?").then((clickedValue) => {
      if (clickedValue) connectAndLogin();
    });
  }
}

function logoutAndDisconnectWhenUserLogOut() {
  if (!channel.connected) {
    return Promise.resolve(); // 연결이 없는 경우 빈 Promise 반환
  }

  let code = "";
  return counselHub
    .logout([channelType], code)
    .then(() => {
      console.log("[SoftPhone] #로그아웃 성공");
      return counselHub.disconnect(code); // 로그아웃 후 접속 해제
    })
    .then(() => {
      console.log("[SoftPhone] #접속해제 성공");
    })
    .catch((error) => {
      console.log("[SoftPhone] #오류 발생 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error)); // 오류 메시지 출력
    });
}

function logoutAndDisconnectWhenWindowUnload(event) {
  console.log(event);
  event.returnValue = "";

  if (channel.connected) {
    let code = "";
    counselHub
      .logout([channelType], code)
      .then(() => {
        console.log("[SoftPhone] #로그아웃 성공");
        return counselHub.disconnect(code);
      })
      .then(() => {
        console.log("[SoftPhone] #접속해제 성공");
      })
      .catch((error) => {
        console.log("[SoftPhone] #오류 발생 : ", error);
        showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error));
      });
  }
}

function agentState(agentId) {
  channel
    .requestChannelState(agentId)
    .then((data) => {
      console.log("[SoftPhone] #agentState 성공 : ", data);
      checkAgentInfo(data);
    })
    .catch((error) => {
      console.log("[SoftPhone] #agentState 실패 : ", error);
      counselHub.disconnect();
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error));
    });
}

function checkAgentInfo(agentInfo) {
  if (agentInfo.state !== CounselFlowHubVoiceCode.ChannelState.NOTLOGIN) {
    showConfirm("이미 로그인 되어 있습니다. 기존연결을 끊고 로그인 하시겠습니까?").then((clickedValue) => {
      if (clickedValue) {
        counselHub
          .login([channelType], ctiLoginInfo.value)
          .then(() => {
            console.log("[SoftPhone] #로그인 성공");
            reportQueueSubscribe();
          })
          .catch((error) => {
            console.log("[SoftPhone] #로그인 실패 : ", error);
            // ctiLoginInfo.value.extension = "";
            counselHub.disconnect();
            showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error));
          });
      } else {
        // ctiLoginInfo.value.extension = "";
        counselHub.disconnect();
      }
    });
  } else {
    counselHub
      .login([channelType], ctiLoginInfo.value)
      .then(() => {
        console.log("[SoftPhone] #로그인 성공");
        reportQueueSubscribe();
      })
      .catch((error) => {
        console.log("[SoftPhone] #로그인 실패 : ", error);
        // ctiLoginInfo.value.extension = "";
        counselHub.disconnect();
        showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error));
      });
  }
}

function reportQueueSubscribe() {
  try {
    const channelFetcher = channel.getFetcher();
    channelFetcher
      .getQueueList()
      .then((queueList) => {
        let allQueueCode = "";
        queueList.forEach((queue, index) => {
          if (index === 0) {
            allQueueCode += queue.dn;
          } else {
            allQueueCode += "-" + queue.dn;
          }
        });
        channelFetcher
          .reportQueueSubscribe(channelOption.value.tenant, allQueueCode)
          .then(() => {})
          .catch((error) => {
            console.warn(error);
          });
      })
      .catch((error) => {
        console.warn(error);
      });
  } catch (error) {}
}

function connectAndLogin() {
  counselHub
    .connect()
    .then(() => {
      console.log("[SoftPhone] #접속 성공");
      agentState(ctiLoginInfo.value.id);
    })
    .catch((error) => {
      console.log("[SoftPhone] #접속 실패 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error));
    });
}

function doAutoLogin() {
  counselHub
    .connect()
    .then(() => {
      console.log("[SoftPhone] #접속 성공");
      counselHub
        .login(null, ctiLoginInfo)
        .then(() => {
          console.log("[SoftPhone] #로그인 성공");
          autoLoggedIn.value = true;
        })
        .catch((error) => {
          console.log("[SoftPhone] #로그인 실패 : ", error);
          console.log("autoLogin");
          counselHub.disconnect();
          if (!autoLoggedIn.value) {
            setTimeout(doAutoLogin, 5000);
          }
        });
    })
    .catch((error) => {
      console.log("[SoftPhone] #오토로그인 접속 실패 : ", error);
      if (!autoLoggedIn.value) {
        setTimeout(doAutoLogin, 5000);
      }
    });
}

function logoutAndDisconnect(reasonCode) {
  let code = reasonCode ? reasonCode : "";
  counselHub
    .logout([channelType], code)
    .then(() => {
      console.log("[SoftPhone] #로그아웃 성공");
    })
    .catch((error) => {
      console.log("[SoftPhone] #로그아웃 실패 : ", error);
    })
    .finally(() => {
      counselHub
        .disconnect(code)
        .then(() => {
          console.log("[SoftPhone] #접속해제 성공");
        })
        .catch((error) => {
          console.log("[SoftPhone] #접속해제 실패 : ", error);
          showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error));
        });
    });
}

//TODO
function dial(dial) {
  channel
    .dial({ type: dialType, calledId: dial }) // type - 현재는 내선, dial검증
    .then(() => {
      console.log("[SoftPhone] #걸기 성공 : ", dial);
    })
    .catch((error) => {
      console.log("[SoftPhone] #걸기 실패 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
    });
}

//TODO
function callbackDial(number, callbackEntityId, callbackTypeCode) {
  // callbackEntityId, callbackTypeCode 어딘가에 세팅
  channel
    .dial({ type: dialType, calledId: number }) // type - 현재는 내선, dial검증
    .then(() => {
      console.log("[SoftPhone] #콜백걸기 성공 : ", number);
    })
    .catch((error) => {
      console.log("[SoftPhone] #콜백걸기 실패 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
    });
}

function transfer(dial) {
  let dialInfo = {};
  if (dial) dialInfo.calledId = dial;

  if (!dialInfo?.calledId?.length) {
    showAlert("호전환 번호를 입력하세요.");
    return;
  }
  dialInfo.type = dialType;

  channel
    .transfer(dialInfo)
    .then(() => {
      console.log("[SoftPhone] #호전환 성공");
    })
    .catch((error) => {
      console.log("[SoftPhone] #호전환 실패 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
    });
}

function conference(dial) {
  channel
    .conference({ type: dialType, calledId: dial })
    .then(() => {
      console.log("[SoftPhone] #3자통화 성공");
    })
    .catch((error) => {
      console.log("[SoftPhone] #3자통화 실패 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
    });
}

function consult(dial) {
  let dialInfo = {};
  if (dial) dialInfo.calledId = dial;
  if (!dialInfo?.calledId?.length) {
    showAlert("전화번호를 입력하세요.");
    return;
  }
  dialInfo.type = dialType;
  channel
    .consult(dialInfo)
    .then(() => {
      console.log("[SoftPhone] #협의전화 성공");
    })
    .catch((error) => {
      console.log("[SoftPhone] #협의전화 실패 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
    });
}

function openTransferPopup() {
  dialogInstance.value = $q
    .dialog({
      component: CallTransferLayerPop,
      // componentProps: {
      //   channel: channel,
      // },
    })
    .onOk((payload) => {
      if (payload.callType === CounselFlowHubVoiceCode.CallType.TRANSFER) transfer(payload.dial);
      else if (payload.callType === CounselFlowHubVoiceCode.CallType.CONFERENCE) conference(payload.dial);
      else if (payload.callType === "retrieve")
        if (eventData.value.channelInfo.callInfo.callType === CounselFlowHubVoiceCode.CallType.CONSULT) hangup();
    })
    .onCancel(() => {
      dialogInstance.value = null;
    });
}

function openDialPopup() {
  $q.dialog({
    component: CallOutLayerPop,
  }).onOk((tel) => {
    dial(tel);
    openHome();
  });
}

function reproduceTokenIfNeeded() {
  const accessExpirationTime = localStorage.getItem("accessExpirationTime");

  if (accessExpirationTime) {
    // 'yyyy-MM-dd HH:mm:ss' 형식을 파싱하여 Date 객체로 변환
    const [datePart, timePart] = accessExpirationTime.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    const expirationDate = new Date(year, month - 1, day, hours, minutes, seconds);
    const timeRemaining = expirationDate.getTime() - Date.now();
    const oneHourInMillis = 3600000; // 1시간 = 3600000ms

    // 만료까지 남은 시간이 1시간 미만일 경우에만 호출
    if (timeRemaining < oneHourInMillis) {
      reproduceToken();
    }
  }
}

function reproduceToken() {
  authApi
    .reproduceToken()
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("accessExpirationTime", response.data.accessExpirationTime);
        localStorage.setItem("accessTokenExpiresIn", response.data.accessTokenExpiresIn);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("refreshExpirationTime", response.data.refreshExpirationTime);
        localStorage.setItem("refreshTokenExpiresIn", response.data.refreshTokenExpiresIn);
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function showInboundCallPopup(event) {
  dialogInstance.value = $q
    .dialog({
      component: CallInLayerPop,
      componentProps: {
        signalInfo: event,
      },
    })
    .onOk(() => {
      // reproduceTokenIfNeeded();
      // 자동연장기능 주석처리
      acceptCall();
      openHome();
    })
    .onCancel(() => {
      rejectCall();
      dialogInstance.value = null;
    });
}

function closeDialog() {
  if (dialogInstance.value) dialogInstance.value.hide();
}

function openHome() {
  mainTabStore.addTab({
    name: Menu.CALL_CONSULT.name,
    label: Menu.CALL_CONSULT.label,
  });
}

//TODO
function checkAgreeYn() {}

function ready() {
  if (toolbar.value.isOffReadyBtn) return;

  if (channel.channelInfo.state === "READY") return;

  counselHub
    .ready()
    .then(() => {
      console.log("[SoftPhone] #대기 성공");
    })
    .catch((error) => {
      console.log("[SoftPhone] #대기 실패 : ", error);
    });
}

function absence(value) {
  let code = value;
  if (!code) code = "4";

  counselHub
    .absence([channelType], code)
    .then(() => {
      console.log("[SoftPhone] #이석 성공");
    })
    .catch((error) => {
      console.log("[SoftPhone] #이석 실패 : ", error);
    });
}

function acceptCall() {
  if (toolbar.value.isOffAcceptBtn) return;
  channel
    .acceptCall()
    .then((response) => {
      console.log("[SoftPhone] #전화받기 성공", response);
    })
    .catch((error) => {
      console.log("[SoftPhone] #전화받기 실패 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
    });
}

function rejectCall() {
  console.log("rejectCall");
  channel
    .rejectCall()
    .then(() => {
      console.log("[SoftPhone] #통화거절 성공");
    })
    .catch((error) => {
      console.log("[SoftPhone] #통화거절 실패 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
    });
}

function hangup() {
  if (toolbar.value.isOffHangUpBtn) return;
  return new Promise((resolve, reject) => {
    channel
      .hangup()
      .then(() => {
        console.log("[SoftPhone] #통화종료 성공");
        resolve();
      })
      .catch((error) => {
        console.log("[SoftPhone] #통화종료 실패 : ", error);
        showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
        reject(error);
      });
  });
}

//TODO
function holdAndRetrieve() {
  if (toolbar.value.isOffHeldBtn) return;

  if (channel.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.ACTIVE) {
    channel
      .hold()
      .then(() => {
        console.log("[SoftPhone] #보류 성공");
      })
      .catch((error) => {
        try {
          retrieve();
          // 보류 실패시 보류해제상태일 수 있어서 보류해제 시도(협의전화)
        } catch {
          console.log("[SoftPhone] #보류 실패 : ", error);
          showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
        }
      });
  } else if (channel.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.HELD) {
    retrieve();
  }
}

function retrieve() {
  channel
    .retrieve()
    .then(() => {
      console.log("[SoftPhone] #보류해제 성공 성공");
    })
    .catch((error) => {
      console.log("[SoftPhone] #보류해제 실패 : ", error);
      showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error), "소프트폰 오류");
    });
}

function getChannelStat(type) {
  for (let eachStatus in Status) {
    if (eachStatus === type) {
      return Status[eachStatus];
    }
  }
}

function setStatus(type, event) {
  let channelStat = getChannelStat(type);
  channelStat.func(channelStat, event);
}

function funcCommon(thisArg) {
  toolbar.value.status = thisArg.channelState;
  toolbar.value.backgroundColor = thisArg.toolbar_backgroundColor;
  changeButtonStateOnOff(thisArg.changeButtonStateOnOff);
  changeButtonStateClickAndUnClick(thisArg.changeButtonStateClickAndUnClick);
}

function funcNotlogin(thisArg) {
  funcCommon(thisArg);
  timerStop();
  if (channel.channelInfo.subState === -1000) {
    autoLoggedIn.value = false;
    doAutoLogin();
  }
}

function funcReady(thisArg) {
  funcCommon(thisArg);
  leaveCodeAreaStyleDisplay.value = "none";
  clearSubState();
  timerRestart();
  isAgreementResultMessage.value = false;
}

function funcAbsence(thisArg, event) {
  if (event?.channelInfo?.callInfo?.extraData?.isDiverted) {
    absence("4");
    return;
  }

  changeSubStateName(channel.channelInfo.subState);
  changeButtonStateOnOff(thisArg.changeButtonStateOnOff);
  changeButtonStateClickAndUnClick(thisArg.changeButtonStateClickAndUnClick);
  timerRestart();
}

// TODO
function funcOffering(thisArg, event) {
  showInboundCallPopup(event);
  funcCommon(thisArg);
  timerRestart();

  // let ctiQueueTime = 0;
  // let userInitTime = 0;
  // if (event.channelInfo.callInfo.extraData.UEI35 !== undefined) {
  //   if (isExists(event.channelInfo.callInfo.extraData.UEI35[0])) {
  //     ctiQueueTime = event.channelInfo.callInfo.extraData.UEI35[0];

  //     if (isExists(event.expiredDate)) {
  //       const d = event.expiredDate;
  //       // userInitTime = SclUtil.leadingZeros(d.getHours(), 2) + SclUtil.leadingZeros(d.getMinutes(), 2) + SclUtil.leadingZeros(d.getSeconds(), 2);
  //     }

  //     const queueWaitTile = userInitTime - ctiQueueTime;
  //     // ParfaitContext.getMainComponent().getMainContentComponent().getTabItemComponentById(this.COMPONENT_ID).setCounselWaitTime(queueWaitTile);
  //   }
  // }
}

// TODO
function funcActive(thisArg, event) {
  // checkAgreeYn()
  console.log("UEI log", event.channelInfo.callInfo.extraData);
  console.log("channel", channel);

  if (event.channelInfo?.callInfo?.extraData) {
    console.log("[SoftPhone] 통화중 소프트폰 UCID : ", event.channelInfo.callInfo.extraData.ucid);
    console.log("[SoftPhone] #상담통화시작");
  }

  if (event.channelInfo?.callInfo?.callType === CounselFlowHubVoiceCode.CallType.CONFERENCE)
    thisArg.changeButtonStateOnOff.transBtn = false; // Conference Call 일 때 호전환 버튼 비활성화
  else thisArg.changeButtonStateOnOff.transBtn = true;

  funcCommon(thisArg);

  if (eventStatus.value?.callInfo?.extraData) {
    timerRestart();
  }
}

// TODO
function funcProcess(thisArg, event) {
  console.log("[SoftPhone] #상담통화종료");
  funcCommon(thisArg);
  timerRestart();
  isAgreementResultMessage.value = false;
}

function funcHeld(thisArg) {
  funcCommon(thisArg);
}

function funcRingback(thisArg, event) {
  funcCommon(thisArg);
  timerRestart();
}

function funcMiss(thisArg) {
  funcCommon(thisArg);
  timerRestart();
}

function funcBusy() {
  console.log("funcBusy");
}

function processEvent(event) {
  console.log("========================Event Started=========================");
  console.log("[processEvent] : ", JSON.parse(JSON.stringify(event)));
  const prevData = eventData.value;
  const prevState = prevData?.channelInfo.state;
  const prevCallType = prevData?.channelInfo?.callInfo?.callType;

  eventData.value = JSON.parse(JSON.stringify(event));
  const currentState = eventData.value?.channelInfo.state;
  const currentCallType = eventData.value?.channelInfo?.callInfo?.callType;

  console.log(`[state]: ${prevState} => ${currentState}`);
  console.log(`[callType]: ${prevCallType} => ${currentCallType}`);
  console.log("========================Event Ended===========================");

  if (
    !isEmpty(event.queueReportInfo) &&
    !isEmpty(event.queueReportInfo.method) &&
    event.queueReportInfo.method === 3006
  )
    return;

  eventStatus.value = event.channelInfo;
  if (event.channelInfo.state === CounselFlowHubVoiceCode.ChannelState.ABSENCE && channel.channelInfo.subState === -999)
    return;

  if (
    prevState === CounselFlowHubVoiceCode.ChannelState.OFFERING &&
    currentState === CounselFlowHubVoiceCode.ChannelState.ACTIVE
  )
    emitter.emit("callInStarted", event); // 통화 인입

  if (
    prevState === CounselFlowHubVoiceCode.ChannelState.RINGBACK &&
    currentState === CounselFlowHubVoiceCode.ChannelState.ACTIVE
  )
    emitter.emit("callOutStarted", event); // 통화 인출

  if (
    prevState === CounselFlowHubVoiceCode.ChannelState.ACTIVE &&
    currentState === CounselFlowHubVoiceCode.ChannelState.PROCESS
  ) {
    emitter.emit("callEnded", event); // 통화 종료
    closeDialog();
  }

  if (prevState === CounselFlowHubVoiceCode.ChannelState.PROCESS && prevState !== currentState)
    emitter.emit("processEnded", event); // 후처리 종료

  if (
    prevState === CounselFlowHubVoiceCode.ChannelState.OFFERING &&
    currentState === CounselFlowHubVoiceCode.ChannelState.PROCESS
  ) {
    // console.log("[SoftPhone] #호놓침 "); //TODO 거절 or 호놓침 둘 다 해당되서 어떻게 구분해야하지? => 거절시에 이벤트를 내보내서 구분가능
    closeDialog();
  }

  if (
    prevState === CounselFlowHubVoiceCode.ChannelState.ACTIVE &&
    currentState === CounselFlowHubVoiceCode.ChannelState.ACTIVE &&
    (currentCallType === CounselFlowHubVoiceCode.CallType.TRANSFER ||
      currentCallType === CounselFlowHubVoiceCode.CallType.CONFERENCE)
  )
    emitter.emit("callInStarted", event); // 호전환, 3자통화 시작

  if (
    currentState === CounselFlowHubVoiceCode.ChannelState.RINGBACK &&
    currentCallType === CounselFlowHubVoiceCode.CallType.CONSULT
  )
    emitter.emit("consultCallRequested"); // 협의 전화 시도

  if (
    prevState === CounselFlowHubVoiceCode.ChannelState.RINGBACK &&
    currentState === CounselFlowHubVoiceCode.ChannelState.ACTIVE &&
    currentCallType === CounselFlowHubVoiceCode.CallType.CONSULT
  )
    emitter.emit("consultCallResponse", true); // 협의 전화 연결

  if (prevCallType === CounselFlowHubVoiceCode.CallType.CONSULT && currentCallType !== prevCallType)
    emitter.emit("consultCallResponse", false); // 협의 전화 거절 or 미수신 or 종료

  setStatus(event.channelInfo.state, event);
}

function changeLeave() {
  if (toolbar.value.isOffLeaveBtn) return;

  if (leaveCodeAreaStyleDisplay.value === "inline") leaveCodeAreaStyleDisplay.value = "none";
  else leaveCodeAreaStyleDisplay.value = "inline";
}

// 이석 상태 변경
function changeStatus(type) {
  clearSubState();
  absence(type);
}

function changeButtonStateOnOff(array) {
  toolbar.value.isOffCallingBtn = !array.callingBtn;
  toolbar.value.isOffAcceptBtn = !array.acceptBtn;
  toolbar.value.isOffHangUpBtn = !array.hangupBtn;
  toolbar.value.isOffReadyBtn = !array.readyBtn;
  toolbar.value.isOffTransBtn = !array.transBtn;
  toolbar.value.isOffHeldBtn = !array.heldBtn;
  toolbar.value.isOffLeaveBtn = !array.leaveBtn;
  toolbar.value.isOffCurseBtn = !array.curseBtn;
  toolbar.value.isOffSexualBtn = !array.SexualBtn;
  toolbar.value.callOnOffClass["voice-on"] = array.ctiOnBtn;
  toolbar.value.callOnOffClass["voice-off"] = !array.ctiOnBtn;
  toolbar.value.isOffCardBtn = !array.SexualBtn;
  toolbar.value.isOffAgreeBtn = !array.SexualBtn;
}

function changeButtonStateClickAndUnClick(array) {
  toolbar.value.isReadyClicked = !array.readyBtn;
  toolbar.value.isHeldClicked = !array.heldBtn;
  toolbar.value.isLeaveClicked = !array.leaveBtn;
}

function changeSubStateName(subStateCode) {
  if (subStateCode === 0) {
    toolbar.value.status = VoiceCommonCode.LeaveSubStateCodeName.REST;
    toolbar.value.backgroundColor = VoiceCommonCode.StateBarColor.PINK;
  } else if (subStateCode === 1) {
    toolbar.value.status = VoiceCommonCode.LeaveSubStateCodeName.MEAL;
    toolbar.value.backgroundColor = VoiceCommonCode.StateBarColor.PINK;
  } else if (subStateCode === 2) {
    toolbar.value.status = VoiceCommonCode.LeaveSubStateCodeName.EDU;
    toolbar.value.backgroundColor = VoiceCommonCode.StateBarColor.PINK;
  } else if (subStateCode === 3) {
    toolbar.value.status = VoiceCommonCode.LeaveSubStateCodeName.WORK;
    toolbar.value.backgroundColor = VoiceCommonCode.StateBarColor.PINK;
  } else if (subStateCode === 4) {
    toolbar.value.status = VoiceCommonCode.StateCodeName.MISS;
    toolbar.value.backgroundColor = VoiceCommonCode.StateBarColor.PINK;
  } else if (subStateCode === -999) {
    toolbar.value.status = VoiceCommonCode.StateCodeName.LOGIN;
    toolbar.value.backgroundColor = VoiceCommonCode.StateBarColor.BLUE;
  } else {
    toolbar.value.status = VoiceCommonCode.StateCodeName.ABSENCE;
    toolbar.value.backgroundColor = VoiceCommonCode.StateBarColor.PINK;
  }
}

function clearSubState() {
  toolbarStatus.value.isWorkBtn = false;
  toolbarStatus.value.isMealBtn = false;
  toolbarStatus.value.isRestBtn = false;
  toolbarStatus.value.isEduBtn = false;
}

//TODO
function isView(isShow) {
  if (isShow) {
    this.leaveCodeAreaStyleDisplay = "inline";
  } else {
    this.leaveCodeAreaStyleDisplay = "none";
  }
}

//TODO
function transferCurse() {}

//TODO
function transferSexual() {}

//TODO
function transferCharge() {}

//TODO
function conferenceAgree() {}

//TODO
function getCustomerInfo() {}

//TODO
function executeAgreeArs(data) {}

//TODO
function workCounsel() {}

function timerStop() {
  swReset();
}

function timerRestart() {
  swReset();
  swStart();
  display();
}

function swStart() {
  if (state.value === 1) {
    state.value = 0;
    now.value = new Date();
    ms.value = now.value.getTime() - then.value.getTime();
  } else {
    state.value = 1;
    then.value = new Date();
    then.value.setTime(then.value.getTime() - ms.value);
  }
}

function swReset() {
  state.value = 0;
  ms.value = 0;
  toolbar.value.timer = convertSecondsToTime(parseInt(ms.value / 1000));
}

function display() {
  setTimeout(() => {
    display();
  }, 1000);

  if (state.value === 1) {
    now.value = new Date();
    ms.value = now.value.getTime() - then.value.getTime();
    toolbar.value.timer = convertSecondsToTime(parseInt(ms.value / 1000));
  }
}

function convertSecondsToTime(seconds) {
  let pad = function (x) {
    return x < 10 ? "0" + x : x;
  };
  return pad(parseInt(seconds / (60 * 60))) + ":" + pad(parseInt((seconds / 60) % 60)) + ":" + pad(seconds % 60);
}

function isEmpty(str) {
  return !str || str === "null" || str === "undefined";
}

function isExists(str) {
  return !isEmpty(str);
}
</script>

<template>
  <div class="row no-wrap q-gutter-x-xs">
    <div
      class="text-white q-px-sm rounded-borders shadow-1 q-mr-md"
      :class="toolbar.status === 'OFF' ? 'bg-grey-6' : 'bg-primary'"
    >
      <div class="fit column items-center justify-center text-weight-bold" @click="ctiOnOff" style="cursor: pointer">
        <span>{{ toolbar.status }}</span>
        <span>{{ toolbar.timer }}</span>
      </div>
    </div>
    <a-icon-btn label="걸기" icon="phone_forwarded" :disable="toolbar.isOffCallingBtn" @click="openDialPopup" />
    <a-icon-btn label="끊기" icon="call_end" :disable="toolbar.isOffHangUpBtn" @click="hangup" />
    <a-icon-btn label="대기" icon="hourglass_empty" :disable="toolbar.isOffReadyBtn" @click="ready" />
    <a-icon-btn
      :label="toolbar.status === VoiceCommonCode.StateCodeName.HELD ? '보류해제' : '보류'"
      icon="watch_later"
      :disable="toolbar.isOffHeldBtn"
      @click="holdAndRetrieve"
    />
    <a-icon-btn label="호전환" icon="timeline" :disable="toolbar.isOffTransBtn" @click="openTransferPopup" />
    <a-icon-btn
      label="휴식"
      icon="local_cafe"
      :disable="toolbar.isOffLeaveBtn"
      @click="changeStatus(leaveSubCode.REST)"
    />
    <a-icon-btn
      label="식사"
      icon="restaurant"
      :disable="toolbar.isOffLeaveBtn"
      @click="changeStatus(leaveSubCode.MEAL)"
    />
    <a-icon-btn label="교육" icon="school" :disable="toolbar.isOffLeaveBtn" @click="changeStatus(leaveSubCode.EDU)" />
    <a-icon-btn label="타업무" icon="work" :disable="toolbar.isOffLeaveBtn" @click="changeStatus(leaveSubCode.WORK)" />
  </div>
</template>

<style lang="scss" scoped></style>
