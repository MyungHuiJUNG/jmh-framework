<script setup>
import { ref, onMounted, onUnmounted, watch, getCurrentInstance } from "vue";
import { useQuasar } from "quasar";
import ATab from "components/common/ATab.vue";
import ATabs from "components/common/ATabs.vue";
import TicketLogPanel from "components/panels/TicketLogPanel.vue";
import NewTicket from "components/ticket/NewTicket.vue";
import ticketApi from "src/js/api/ticketApi";
import ticketChannelApi from "src/js/api/ticketChannelApi";
import { useCodeStore } from "src/stores/codeStore";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { useAuthStore } from "src/stores/authStore";
import UserInfoPanel from "components/panels/UserInfoPanel.vue";
import ChampInfoPanel from "src/components/panels/ChempInfoPanel.vue";
import customerInfoApi from "src/js/api/customerInfoApi";
import ReportInfoPanel from "src/components/panels/ReportInfoPanel.vue";
import CunstomerSelectionPopup from "src/components/customerInfo/CunstomerSelectionPopup.vue";
import { showAlert } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const emitter = getCurrentInstance().appContext.config.globalProperties.$emitter;

const $q = useQuasar();
const userInfoTab = ref("userInfo");
const champInfoTab = ref("champInfo");
const extraInfoTab = ref("reportInfo");
const logTab = ref("ticketLog");
const popupList = ref([]);
const codeStore = useCodeStore();
const counselTypeStore = useCounselTypeStore();
const authStore = useAuthStore();
const customerInfo = ref(null);

const COUNSEL_TICKET = FlowSystemCode.TICKET_TYPE.COUNSEL_TICKET; // 상담 티켓
const TICKET_UNPROCESSED = FlowSystemCode.TICKET_PROCESS_STATUS.UNPROCESSED; // 미처리

const VOICE = FlowSystemCode.CHANNEL_TYPE.VOICE; // 보이스
const INBOUND = FlowSystemCode.CHANNEL_CONTACT_TYPE.INBOUND; // 인바운드
const OUTBOUND = FlowSystemCode.CHANNEL_CONTACT_TYPE.OUTBOUND; // 아웃바운드

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
});

const newTicket = ref({});
const grid = ref(null);
const ticketEntityId = ref();
const ticketChannelEntityId = ref();

const ticketDetail = ref(null);

onMounted(() => {
  // 팝업창에서 호출해서 데이터를 받아갈 수 있도록
  // window 전역 함수로 등록
  window.getTicketData = () => {
    return ticketDetail.value;
  };

  // 티켓 로직 관련 이벤트 처리
  emitter.on("callInStarted", handleCallIn); // 통화 시작
  emitter.on("callOutStarted", handleCallOut); // 통화 시작
  emitter.on("callEnded", updateChannelEndTime); // 통화 종료
  emitter.on("processEnded", updateChannelProcessTime); // 후처리 종료
});

onUnmounted(() => {
  emitter.off("callInStarted", handleCallIn);
  emitter.off("callOutStarted", handleCallOut);
  emitter.off("callEnded", updateChannelEndTime);
  emitter.off("processEnded", updateChannelProcessTime);
});

watch(
  () => newTicket.value,
  (newVal) => {
    if (newVal) {
      getTicketList(newVal.tel);
    }
  }
);

function getTicketList(tel) {
  grid.value.getTickets(tel);
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function handleCallIn(data) {
  const ticket = {};
  const callInfo = data.channelInfo.callInfo;

  if (!callInfo) return;

  const callType = callInfo.callType;
  if (!callType) return;

  if (
    callType === CounselFlowHubVoiceCode.CallType.CONSULT ||
    callType === CounselFlowHubVoiceCode.CallType.CONFERENCE
  ) {
    getCustomerInfo(callInfo.xferCallerId);
    getTicketList(callInfo.xferCallerId);
    return; // 협의전화, 3자통화는 티켓발행 안함
  }

  // 일반 통화
  if (callType === CounselFlowHubVoiceCode.CallType.NORMAL) {
    ticket.tel = callInfo.callerId; // 인바운드
  }
  // 호전환
  else if (callType === CounselFlowHubVoiceCode.CallType.TRANSFER) {
    ticket.tel = callInfo.xferCallerId;
  }
  // if (data.expiredDate) ticket.startDate = formatDate(data.expiredDate);
  ticket.typeCode = COUNSEL_TICKET; // 티켓 유형 : 상담 티켓
  ticket.statusCode = TICKET_UNPROCESSED; // 처리상태 : 미처리
  ticket["manager.entityId"] = authStore.entityId; // 관리자ID : 최초는 상담자 본인
  ticket.isManualCreated = "N"; // 수기등록아님

  await getCustomerInfo(ticket.tel).then((customerInfo) => {
    // 고객정보
    if (customerInfo) {
      ticket.customerInfo = customerInfo.entityId; // 고객정보 eid
      ticket.customerName = customerInfo.name; // 고객명
    }
    ticketApi
      .saveTicket(ticket)
      .then((response) => {
        if (response.status === 200) {
          ticketEntityId.value = response.data.entityId;

          console.log("[최초 티켓 발행 성공] : ", ticketEntityId.value); // 후 채널발행
          const ticketChannel = {};
          const channelInfo = data.channelInfo;

          ticketChannel.ticketEntityId = ticketEntityId.value;
          ticketChannel.typeCode = VOICE; // 통화채널
          if (channelInfo.callInfo.extraData.ucid) ticketChannel.extraData = channelInfo.callInfo.extraData.ucid;
          ticketChannel.contactCode = INBOUND;

          ticketChannel.startDate = formatDate(data.expiredDate);
          ticketChannel.key = callInfo.callId; // 임의

          ticketChannelApi
            .saveTicketChannel(ticketChannel)
            .then((response) => {
              if (response.status === 200) {
                ticketChannelEntityId.value = response.data.entityId;

                console.log("[티켓 채널 발행] : ", ticketChannelEntityId.value);
                ticketApi
                  .getTicketByEntityId(ticketEntityId.value)
                  .then((response) => {
                    if (response.status === 200) {
                      console.log("[티켓 상세정보 조회] : ", ticketEntityId.value);
                      newTicket.value = response.data;
                    }
                  })
                  .catch((error) => {
                    handleApiError(error);
                  });
              }
            })
            .catch((error) => {
              handleApiError(error);
            });
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  });
}

async function handleCallOut(data) {
  const ticket = {};
  const callInfo = data.channelInfo.callInfo;

  if (!callInfo) return;

  const callType = callInfo.callType;
  if (!callType) return;

  if (
    callType === CounselFlowHubVoiceCode.CallType.CONSULT ||
    callType === CounselFlowHubVoiceCode.CallType.CONFERENCE ||
    callType === CounselFlowHubVoiceCode.CallType.TRANSFER
  )
    return; // 협의전화, 3자통화, 호전환은 인출시 티켓발행 안함

  // 일반 통화
  ticket.tel = callInfo.calledId; // 아웃바운드
  // if (data.expiredDate) ticket.startDate = formatDate(data.expiredDate);
  ticket.typeCode = COUNSEL_TICKET; // 티켓 유형 : 상담 티켓
  ticket.statusCode = TICKET_UNPROCESSED; // 처리상태 : 미처리
  ticket["manager.entityId"] = authStore.entityId; // 관리자ID : 최초는 상담자 본인
  ticket.isManualCreated = "N"; // 수기등록아님

  await getCustomerInfo(ticket.tel).then(
    // 고객 정보 가져오기
    (customerInfo) => {
      if (customerInfo) {
        ticket.customerInfo = customerInfo.entityId; // 고객정보 eid
        ticket.customerName = customerInfo.name; // 고객명(회사명)
      }
      ticketApi
        .saveTicket(ticket)
        .then((response) => {
          if (response.status === 200) {
            ticketEntityId.value = response.data.entityId;

            console.log("[최초 티켓 발행 성공] : ", ticketEntityId.value); // 후 채널발행
            const ticketChannel = {};
            const channelInfo = data.channelInfo;

            ticketChannel.ticketEntityId = ticketEntityId.value;
            ticketChannel.typeCode = VOICE; // 통화채널
            if (channelInfo.callInfo.extraData.ucid) ticketChannel.extraData = channelInfo.callInfo.extraData.ucid;
            ticketChannel.contactCode = OUTBOUND;

            ticketChannel.startDate = formatDate(data.expiredDate);
            ticketChannel.key = callInfo.callId; // 임의

            ticketChannelApi
              .saveTicketChannel(ticketChannel)
              .then((response) => {
                if (response.status === 200) {
                  ticketChannelEntityId.value = response.data.entityId;

                  console.log("[티켓 채널 발행] : ", ticketChannelEntityId.value);
                  ticketApi
                    .getTicketByEntityId(ticketEntityId.value)
                    .then((response) => {
                      if (response.status === 200) {
                        console.log("[티켓 상세정보 조회] : ", ticketEntityId.value);
                        newTicket.value = response.data;
                      }
                    })
                    .catch((error) => {
                      handleApiError(error);
                    });
                }
              })
              .catch((error) => {
                handleApiError(error);
              });
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  );
}

function updateChannelEndTime(data) {
  if (!ticketChannelEntityId.value) return;
  const ticketChannel = {};
  ticketChannel.endDate = formatDate(data.expiredDate);
  ticketChannelApi
    .updateTicketChannel(ticketChannelEntityId.value, ticketChannel)
    .then((response) => {
      if (response.status === 200) {
        console.log("[티켓 채널 종료시간 추가] : ", ticketChannelEntityId.value);
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function updateChannelProcessTime(data) {
  if (!ticketChannelEntityId.value) return;
  const ticketChannel = {};
  ticketChannel.processDate = formatDate(data.expiredDate);
  ticketChannelApi
    .updateTicketChannel(ticketChannelEntityId.value, ticketChannel)
    .then((response) => {
      if (response.status === 200) {
        console.log("[티켓 채널 후처리시간 추가] : ", ticketChannelEntityId.value);
        ticketChannelEntityId.value = null; // 티켓 채널 Eid 초기화 => 통화 거절시에도 PROCESS상태고, 상태 변화시 호출된다.
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

async function openWindowPopup(row) {
  const ticket = {
    typeCode: codeStore.codes.get(row.typeCode)?.name || null,
    entityId: row.entityId || null,
    statusCode: codeStore.codes.get(row.statusCode)?.name || null,
    inChannel: null,
    outChannel: null,
    counselCategoryCode: codeStore.codes.get(row.counselCategoryCode)?.name || null,
    inboundPath: row.inboundPath || null,
    counselTypeCodeLarge: counselTypeStore.counselTypes.get(row.counselTypeCodeLarge)?.name || null,
    counselTypeCodeMedium: counselTypeStore.counselTypes.get(row.counselTypeCodeMedium)?.name || null,
    counselTypeCodeSmall: counselTypeStore.counselTypes.get(row.counselTypeCodeSmall)?.name || null,
    contents: row.contents || null,
    reservationDate: null,
    reservationTime: null,
    createdByUserName: row.createdByUserName || null,
    managerUserName: row.managerUserName || null,
    createdDate: row.createdDate || null,
    lastModifiedDate: row.lastModifiedDate || null,
    customerName: row.customerName || null,
    tel: row.tel || null,
    productType: row.productType || null,
    inquiry: row.inquiry || null,
    // companyName: row.customerInfo?.name || null,
  };

  if (row.channels?.length && row.channels[0].contactCode === INBOUND) {
    ticket.inChannel = codeStore.codes.get(row.channels[0].typeCode)?.name;
  }
  if (row.channels?.length && row.channels[0].contactCode === OUTBOUND) {
    ticket.outChannel = codeStore.codes.get(row.channels[0].typeCode)?.name;
  }

  function setReservationDateTime() {
    if (row.callbackReservationDate) {
      // 날짜와 시간을 공백으로 분리
      const [date, time] = row.callbackReservationDate.split(" ");

      // 시간 부분에서 HH:mm만 추출 (초 부분 제거)
      const timeOnly = time ? time.substring(0, 5) : "";

      // 값 할당
      ticket.reservationDate = date;
      ticket.reservationTime = timeOnly;
    }
  }
  setReservationDateTime();

  ticketDetail.value = ticket;
  const popupName = row.entityId;
  // 팝업창의 위치를 조정하기 위한 변수
  const leftPosition = 100 * popupList.value.length;
  const topPosition = 100 * popupList.value.length;

  // 모든 기존 팝업창을 다시 앞쪽으로 가져옴
  popupList.value.forEach((popup) => {
    if (!popup.closed) {
      popup.focus(); // 기존 팝업창을 다시 앞쪽으로 가져옴
    }
  });

  // 새로운 팝업창을 엶
  const popup = window.open(
    "/view/ticketDetail",
    popupName,
    `width=400,height=730,left=${leftPosition},top=${topPosition}`
  );

  // 팝업이 제대로 열렸는지 확인
  if (popup) {
    popupList.value.push(popup);

    // 팝업이 닫힐 때 리스트에서 제거
    popup.addEventListener("unload", () => {
      // 0.1초 지연 후 팝업이 실제로 닫혔는지 확인
      setTimeout(() => {
        if (popup.closed) {
          popupList.value = popupList.value.filter((p) => p !== popup);
        }
      }, 100);
    });

    // 새로 연 팝업창에 포커스를 줌
    popup.focus();
  } else {
    console.error("팝업이 차단되었거나 열리지 않았습니다.");
  }
}

function getCustomerInfo(tel) {
  return new Promise((resolve, reject) => {
    const param = { searchTel: tel };
    customerInfoApi
      .getCustomerInfos(param)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length === 0) {
            showAlert("고객정보가 없습니다.");
            customerInfo.value = null;
            resolve(null); // 고객 정보가 없을 경우 null 반환
          } else if (response.data.length === 1) {
            customerInfo.value = response.data[0];
            resolve(response.data[0]); // 고객 정보가 하나인 경우 해당 정보를 반환
          } else {
            // TODO: 둘 이상의 고객 정보가 있을 경우 처리
            $q.dialog({
              component: CunstomerSelectionPopup,
              componentProps: {
                customerInfos: response.data,
              },
            })
              .onOk((data) => {
                customerInfo.value = data;
                resolve(data);
              })
              .onCancel(() => {
                resolve(null);
              });
          }
        }
      })
      .catch((error) => {
        handleApiError(error);
        reject(error); // 오류가 발생할 경우 reject로 에러를 반환
      });
  });
}
</script>

<template>
  <div class="row no-wrap fit" style="min-height: 880px">
    <div class="col full-height column no-wrap">
      <div class="row col-auto q-mb-xs a-border q-pa-xs full-width no-wrap" style="height: 225px">
        <div class="col-4 q-mr-xs q-pt-xs a-border full-height column">
          <a-tabs v-model="userInfoTab" class="col-auto">
            <a-tab name="userInfo" label="기본정보" />
          </a-tabs>

          <q-tab-panels v-model="userInfoTab" keep-alive class="col">
            <q-tab-panel name="userInfo" class="q-pa-xs">
              <UserInfoPanel :customer-info="customerInfo" />
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <div class="col q-pt-xs a-border full-height column">
          <a-tabs v-model="champInfoTab" class="col-auto">
            <a-tab name="champInfo" label="챔프기업정보" />
          </a-tabs>

          <q-tab-panels v-model="champInfoTab" keep-alive class="col">
            <q-tab-panel name="champInfo" class="q-pa-xs">
              <ChampInfoPanel />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>

      <div class="col-auto column full-width no-wrap a-border q-mb-xs q-pt-xs" style="height: 400px">
        <a-tabs v-model="extraInfoTab" class="col-auto full-width">
          <a-tab name="reportInfo" label="신고대상 생활화학제품" />
          <a-tab name="managingInfo" label="사후관리 목록정보" />
        </a-tabs>

        <q-tab-panels v-model="extraInfoTab" keep-alive class="col">
          <q-tab-panel name="reportInfo" class="q-pa-xs">
            <ReportInfoPanel />
          </q-tab-panel>
          <q-tab-panel name="managingInfo" class="q-pa-xs"></q-tab-panel>
        </q-tab-panels>
      </div>

      <div class="q-pt-xs col column no-wrap a-border full-width">
        <a-tabs v-model="logTab" class="col-auto full-width">
          <a-tab name="ticketLog" label="티켓이력" />
        </a-tabs>

        <q-tab-panels v-model="logTab" keep-alive class="col">
          <q-tab-panel name="ticketLog" class="q-pa-xs">
            <TicketLogPanel @row-click="openWindowPopup" ref="grid" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <NewTicket class="col-auto full-height" :new-ticket="newTicket" @update="getTicketList" />
  </div>
</template>

<style lang="scss" scoped>
.bound-border {
  border-top: none;
  text-align: center;
  font-size: large;
  font-weight: bold;
}
</style>
