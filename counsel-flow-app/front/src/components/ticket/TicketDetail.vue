<script setup>
import { ref, watch, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { useCodeStore } from "src/stores/codeStore";
import { debounce } from "lodash";
import { showAlert } from "src/js/common/dialog";
import ABtn from "components/common/ABtn.vue";
import ASelect from "components/common/ASelect.vue";
import AInput from "components/common/AInput.vue";
import UserPopup from "src/components/common/UserPopup.vue";
import ATitleBar from "components/common/ATitleBar.vue";
import ATextarea from "components/common/ATextarea.vue";
import TicketHistory from "components/ticket/TicketHistory.vue";
import ticketApi from "src/js/api/ticketApi";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import { useCommandStore } from "src/stores/commandStore";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import scriptApi from "src/js/api/scriptApi";

const $q = useQuasar();
const counselTypeStore = useCounselTypeStore();
const permissionRoleStore = usePermissionRoleStore();
const codeStore = useCodeStore();
const commandStore = useCommandStore();

const props = defineProps(["ticketDetail"]);
const emit = defineEmits(["close", "update"]);
/**
 * props로 grid에서 클릭한 데이터를 받아온다.
 * grid에 표시되지 않고있는 데이터도, 애초에 들어있는 정보라면 그대로 다 넘어온다.
 * 아래 빈 항목들은 해당하는 데이터를 표시하면 된다.
 * 수정하는 정보 : 처리상태, 상담구분, 상담유형, 상담내용, 재통화예약, 담당자
 * => 저장 시 변화된 정보 api 요청 보내서 update 해야함
 */

const title = "티켓 상세";
const ticket = ref(props.ticketDetail);
const canSaveTicket = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.TICKET_ROLE.SAVE));

// 코드상수
const COUNSEL_CATEGORY = FlowSystemCode.CODES.COUNSEL_CATEGORY;
const TICKET_PROCESS_STATUS = FlowSystemCode.CODES.TICKET_PROCESS_STATUS;

// 보내는 데이터
const typeCode = ref(codeStore.codes.get(ticket.value.typeCode)); // 티켓유형
const statusCode = ref(codeStore.codes.get(ticket.value.statusCode)); // 처리상태
const counselCategoryCode = ref(
  codeStore.codes.get(ticket.value.counselCategoryCode) || {
    name: "선택",
    value: null,
  }
); // 상담구분
const counselTypeCodeLarge = ref(
  counselTypeStore.counselTypes.get(ticket.value.counselTypeCodeLarge) || {
    name: "선택",
    value: null,
  }
); // 상담유형1
const counselTypeCodeMedium = ref(
  counselTypeStore.counselTypes.get(ticket.value.counselTypeCodeMedium) || {
    name: "선택",
    value: null,
  }
); // 상담유형2
const counselTypeCodeSmall = ref(
  counselTypeStore.counselTypes.get(ticket.value.counselTypeCodeSmall) || {
    name: "선택",
    value: null,
  }
); // 상담유형3
const contents = ref(ticket.value.contents); // 상담내용
const callbackReservationDate = ref(ticket.value.callbackReservationDate); // 재통화예약
const customerName = ref(ticket.value.customerName); // 고객명
const tel = ref(ticket.value.tel); // 전화번호
const managerEid = ref(ticket.value.manager?.entityId || null); // 담당자 entityId

const managerUserId = ref(ticket.value.managerUserId); // 담당자Id
const managerUserName = ref(ticket.value.managerUserName); // 담당자이름

const productType = ref(ticket.value.productType);
const inquiry = ref(ticket.value.inquiry);
// const companyName = ref(ticket.value.customerInfo?.name);

const reservationDate = ref();
const reservationTime = ref();

const managerInput = computed(() => {
  if (managerUserName.value && managerUserId.value) {
    return `${managerUserName.value} [${managerUserId.value}]`;
  } else {
    return null;
  }
});

const INBOUND = FlowSystemCode.CHANNEL_CONTACT_TYPE.INBOUND;
const OUTBOUND = FlowSystemCode.CHANNEL_CONTACT_TYPE.OUTBOUND;
const inChannel = computed(() => {
  if (ticket.value.channels?.length && ticket.value.channels[0].contactCode === INBOUND) {
    return codeStore.codes.get(ticket.value.channels[0].typeCode)?.name;
  } else {
    return null;
  }
});
const outChannel = computed(() => {
  if (ticket.value.channels?.length && ticket.value.channels[0].contactCode === OUTBOUND) {
    return codeStore.codes.get(ticket.value.channels[0].typeCode)?.name;
  } else {
    return null;
  }
});

// 처리상태 선택옵션
const statusOptions = ref(computed(() => codeStore.codes.get(TICKET_PROCESS_STATUS)?.children));
// 상담구분 선택옵션
const counselCategoryoptions = ref(computed(() => codeStore.codes.get(COUNSEL_CATEGORY)?.children));

const counselTypeCodeLargeOptions = ref(
  computed(() => {
    return counselTypeStore.counselTypeArray.map((item) => ({
      name: item.name,
      value: item,
    }));
  })
);
const counselTypeCodeMediumOptions = ref([
  {
    name: "선택",
    value: null,
  },
]);
const counselTypeCodeSmallOptions = ref([
  {
    name: "선택",
    value: null,
  },
]);

const isInitialLoad = ref(true); // 초기값 설정 Flag

watch(
  () => props.ticketDetail,
  (newTicketDetail) => {
    ticket.value = newTicketDetail;
    setReservationDateTime();
  },
  { deep: true }
);

watch(ticket, (newVal) => {
  if (newVal) {
    isInitialLoad.value = true;
    setNewData();
    nextTick(() => (isInitialLoad.value = false));
  }
});

watch(
  counselTypeCodeLargeOptions,
  (newOptions) => {
    if (newOptions.length > 0 && !counselTypeCodeLarge.value) {
      counselTypeCodeLarge.value = {
        name: "선택",
        value: null,
      };
    }
  },
  { immediate: true }
);

watch(
  counselTypeCodeLarge,
  (newVal) => {
    if (newVal) {
      counselTypeCodeMediumOptions.value = counselTypeStore
        .getChildrenCounselTypesByTopParentCodeValue(newVal.code)
        .map((item) => ({
          name: item.name,
          value: item,
        }));

      if (!isInitialLoad.value) {
        counselTypeCodeMedium.value = {
          name: "선택",
          value: null,
        };
        counselTypeCodeSmall.value = {
          name: "선택",
          value: null,
        };
      }
    }
  },
  { immediate: true }
);
watch(
  counselTypeCodeMedium,
  (newVal) => {
    if (newVal) {
      counselTypeCodeSmallOptions.value = counselTypeStore
        .getChildrenCounselTypesByTopParentCodeValue(newVal.code)
        .map((item) => ({
          name: item.name,
          value: item,
        }));
      if (!isInitialLoad.value) {
        counselTypeCodeSmall.value = {
          name: "선택",
          value: null,
        };
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  isInitialLoad.value = false;
  setReservationDateTime();
  formatCounselType();
});

onBeforeUnmount(() => {
  debounceSearch.cancel();
});

function setNewData() {
  typeCode.value = codeStore.codes.get(ticket.value.typeCode); // 티켓유형
  statusCode.value = codeStore.codes.get(ticket.value.statusCode); // 처리상태
  counselCategoryCode.value = codeStore.codes.get(ticket.value.counselCategoryCode) || {
    name: "선택",
    value: null,
  }; // 상담구분
  counselTypeCodeLarge.value = counselTypeStore.counselTypes.get(ticket.value.counselTypeCodeLarge) || {
    name: "선택",
    value: null,
  }; // 상담유형 대
  counselTypeCodeMedium.value = counselTypeStore.counselTypes.get(ticket.value.counselTypeCodeMedium) || {
    name: "선택",
    value: null,
  }; // 상담유형 중
  counselTypeCodeSmall.value = counselTypeStore.counselTypes.get(ticket.value.counselTypeCodeSmall) || {
    name: "선택",
    value: null,
  }; // 상담유형 소
  contents.value = ticket.value.contents; // 상담내용
  callbackReservationDate.value = ticket.value.callbackReservationDate; // 재통화예약
  customerName.value = ticket.value.customerName;
  tel.value = ticket.value.tel;
  managerEid.value = ticket.value.manager?.entityId || null;
  managerUserId.value = ticket.value.managerUserId;
  managerUserName.value = ticket.value.managerUserName;
  setReservationDateTime(); // 재통화예약 -> input에 바인딩
  productType.value = ticket.value.productType; // 제품분류
  inquiry.value = ticket.value.inquiry; // 문의
  // companyName.value = ticket.value.customerInfo?.name; // 회사명
}

function setReservationDateTime() {
  if (callbackReservationDate.value) {
    // 날짜와 시간을 공백으로 분리
    const [date, time] = callbackReservationDate.value.split(" ");

    // 시간 부분에서 HH:mm만 추출 (초 부분 제거)
    const timeOnly = time ? time.substring(0, 5) : "";

    // 값 할당
    reservationDate.value = date;
    reservationTime.value = timeOnly;
  } else {
    reservationDate.value = null;
    reservationTime.value = null;
  }
}

function getCallbackReservationDate() {
  if (reservationDate.value && reservationTime.value) {
    callbackReservationDate.value = `${reservationDate.value} ${reservationTime.value}:00`;
  } else {
    callbackReservationDate.value = null;
  }
}

function isNumeric(str) {
  const regex = /^\d+$/;
  return regex.test(str);
}

function update() {
  if (!statusCode.value) {
    showAlert("처리상태를 선택해주세요.");
    return;
  }

  if (counselCategoryCode.value?.value === null || !counselCategoryCode.value) {
    showAlert("상담구분을 선택해주세요.");
    return;
  }

  if (counselTypeCodeLarge.value?.value === null || !counselTypeCodeLarge.value) {
    showAlert("상담유형을 선택해주세요.");
    return;
  }

  if (!inquiry.value) {
    showAlert("문의를 입력해주세요.");
    return;
  }

  if (!contents.value) {
    showAlert("상담내용을 입력해주세요.");
    return;
  }

  if (reservationDate.value && !reservationTime.value) {
    showAlert("재통화예약 시간을 선택해주세요.");
    return;
  }

  if (!managerEid.value) {
    showAlert("담당자를 지정해주세요.");
    return;
  }

  // if (tel.value && !isNumeric(tel.value)) {
  //   showAlert("전화번호는 숫자만 입력해주세요.");
  //   return;
  // }

  getCallbackReservationDate();
  let ticketEntity;
  ticketEntity = {
    typeCode: typeCode.value.code, // 티켓유형
    statusCode: statusCode.value.code, // 처리상태
    counselCategoryCode: counselCategoryCode.value.code, // 상담구분
    counselTypeCodeLarge: counselTypeCodeLarge.value?.code || "", // 상담유형 대중소는 하나로 통합으로 수정예정
    counselTypeCodeMedium: counselTypeCodeMedium.value?.code || "",
    counselTypeCodeSmall: counselTypeCodeSmall.value?.code || "",
    contents: contents.value, // 상담내용
    customerName: customerName.value, // 고객명
    tel: tel.value, // 전화번호
    "manager.entityId": managerEid.value, // 담당자 eid
    productType: productType.value, // 제품분류
    inquiry: inquiry.value, // 문의
  };

  // ticket의 startDate, endDate는 항상 값이 있으면 보내기
  if (ticket.value?.startDate) ticketEntity.startDate = ticket.value.startDate;
  if (ticket.value?.endDate) ticketEntity.endDate = ticket.value.endDate;

  if (callbackReservationDate.value) {
    ticketEntity.callbackReservationDate = callbackReservationDate.value; // 재통화예약
  }
  ticketApi
    .updateTicket(ticket.value.entityId, ticketEntity)
    .then((response) => {
      if (response.status === 200) {
        showAlert("저장이 완료되었습니다").then(() => {
          ticketApi
            .getTicketByEntityId(ticket.value.entityId)
            .then((response) => {
              if (response.status === 200) {
                ticket.value = response.data; // 수정 후 반영
              }
            })
            .catch((error) => {
              handleApiError(error);
            });

          emit("update");
        });
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function openUserSearchPopup() {
  $q.dialog({
    component: UserPopup,
    componentProps: {
      enableRowDblClick: true,
    },
  }).onOk((payload) => {
    managerEid.value = payload.payload[0].entityId;
    managerUserName.value = payload.payload[0].name;
    managerUserId.value = payload.payload[0].id;
  });
}

function openTicketHistory() {
  $q.dialog({
    component: TicketHistory,
    componentProps: {
      ticketEntityId: ticket.value.entityId,
    },
  });
}

// 상담유형 검색
const searchKeyword = ref();
const searchResult = ref();
const showSearchMenu = ref(false);
const formattedCounselType = ref([]);
const allCounselTypes = ref(computed(() => counselTypeStore.counselTypeArray));

watch(allCounselTypes, (newVal) => {
  formatCounselType();
});

function formatCounselType() {
  formattedCounselType.value = [];
  let name1;
  let name2;
  let name3;

  allCounselTypes.value.forEach((depth1) => {
    name1 = depth1.name;
    formattedCounselType.value.push({ name: `${name1}`, value: depth1 });
    if (depth1.children?.length) {
      depth1.children.forEach((depth2) => {
        name2 = depth2.name;
        formattedCounselType.value.push({ name: `${name1} > ${name2}`, value: depth2 });
        if (depth2.children?.length) {
          depth2.children.forEach((depth3) => {
            name3 = depth3.name;
            formattedCounselType.value.push({ name: `${name1} > ${name2} > ${name3}`, value: depth3 });
          });
        }
      });
    }
  });
}

function searchCounselType() {
  if (searchKeyword.value?.trim()) {
    let filteredData = formattedCounselType.value.filter((item) => item.name.includes(searchKeyword.value));
    searchResult.value = filteredData;
  } else {
    searchResult.value = []; // 검색어가 비어있을 경우 빈 배열 할당
  }
  if (searchResult.value?.length) {
    showSearchMenu.value = true;
  } else {
    showSearchMenu.value = false;
  }
}

const debounceSearch = debounce(() => {
  searchCounselType();
}, 500);

function handleSearchClick(data) {
  const pathArray = data.path.split(".");
  if (pathArray.length) {
    const counselType = counselTypeStore.counselTypes.get(pathArray[0]);
    counselTypeCodeLarge.value = counselType;
  }

  nextTick(() => {
    if (pathArray.length > 1) {
      counselTypeCodeMedium.value = counselTypeStore.counselTypes.get(pathArray[1]);
    }
    nextTick(() => {
      if (pathArray.length > 2) {
        counselTypeCodeSmall.value = counselTypeStore.counselTypes.get(pathArray[2]);
      }
    });
  });
  showSearchMenu.value = false;
}

/////////////// 단축키 입력시 템플릿 적용하기 //////////////////

const container = ref(null);
const isFocused = ref(false);

function handleKeyPress(event) {
  if (!isFocused.value) return; // 포커스가 없으면 이벤트 처리하지 않음

  // commandMap의 모든 키 조합을 확인
  for (let [combinationKey, commandList] of commandStore.commandMap.entries()) {
    // combinationKey가 "SPECIFIC-CTRL-DIGIT-1"와 같은 형식일 때, Ctrl + 숫자 키 조합
    const keyParts = combinationKey.split("-");

    // 동적으로 키 조합 조건을 확인
    let specific = null;
    let digit = null;

    // 키 조합에 따른 조건을 매핑
    if (keyParts[0] === FlowSystemCode.SHORT_CUT_KEY_TYPE.SPECIFIC) {
      if (keyParts[1] === FlowSystemCode.SHORT_CUT_SPECIFIC.CTRL) {
        specific = event.ctrlKey; // Ctrl 키 확인
      } else if (keyParts[1] === FlowSystemCode.SHORT_CUT_SPECIFIC.ALT) {
        specific = event.altKey; // Alt 키 확인
      } else if (keyParts[1] === FlowSystemCode.SHORT_CUT_SPECIFIC.SHIFT) {
        specific = event.shiftKey; // Shift 키 확인
      }
    }

    if (keyParts[2] === FlowSystemCode.SHORT_CUT_KEY_TYPE.DIGIT) {
      // keyParts[3]에는 실제 숫자 값 (예: '1', '2', '3' 등)
      digit = keyParts[3];
    }

    // 위에서 설정한 specific과 digit이 모두 일치하는지 확인
    if (specific !== null && digit !== null && specific && event.code === `Digit${digit}`) {
      event.preventDefault();

      // 해당 키에 대응하는 commandList에서 'COUNSEL_TYPE'과 'TEXT'를 찾아 처리
      const counselCommand = commandList.find(
        (entry) => entry.commandType === FlowSystemCode.COMMAND_TYPE.COUNSEL_TYPE
      );
      const textCommand = commandList.find((entry) => entry.commandType === FlowSystemCode.COMMAND_TYPE.TEXT);

      // 선택된 상담유형과 상담내용 업데이트
      if (counselCommand?.command) {
        isInitialLoad.value = true;
        const counselTypePathArray = counselCommand.command?.split(".") || [];

        if (counselTypePathArray.length === 1) {
          counselTypeCodeLarge.value = counselTypeStore.counselTypes.get(counselTypePathArray[0]);
          counselTypeCodeMedium.value = {
            name: "선택",
            value: null,
          };
          counselTypeCodeSmall.value = {
            name: "선택",
            value: null,
          };
        }
        if (counselTypePathArray.length === 2) {
          counselTypeCodeLarge.value = counselTypeStore.counselTypes.get(counselTypePathArray[0]);
          counselTypeCodeMedium.value = counselTypeStore.counselTypes.get(counselTypePathArray[1]);
          counselTypeCodeSmall.value = {
            name: "선택",
            value: null,
          };
        }
        if (counselTypePathArray.length === 3) {
          counselTypeCodeLarge.value = counselTypeStore.counselTypes.get(counselTypePathArray[0]);
          counselTypeCodeMedium.value = counselTypeStore.counselTypes.get(counselTypePathArray[1]);
          counselTypeCodeSmall.value = counselTypeStore.counselTypes.get(counselTypePathArray[2]);
        }
      }
      if (textCommand?.command) {
        contents.value = textCommand.command;
      }

      nextTick(() => (isInitialLoad.value = false));
      break; // 매칭된 키가 있으면 더 이상 확인하지 않음
    }
  }
}
// 포커스 상태 관리
function handleFocusIn() {
  isFocused.value = true;
}

function handleFocusOut() {
  isFocused.value = false;
}
onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyPress);
});

///////////////// 상담유형 스크립트 윈도우 팝업//////////////////
const counselTypeEid = ref(null);
const counselTypeScript = ref();
const popupList = ref([]);
const counselTypeNameWithPath = ref(null);

function openScriptPopup() {
  if (counselTypeCodeLarge.value?.entityId) counselTypeEid.value = counselTypeCodeLarge.value.entityId;
  if (counselTypeCodeMedium.value?.entityId) counselTypeEid.value = counselTypeCodeMedium.value.entityId;
  if (counselTypeCodeSmall.value?.entityId) counselTypeEid.value = counselTypeCodeSmall.value.entityId;
  if (!counselTypeEid.value) {
    showAlert("상담유형을 선택해주세요.");
    return;
  }
  const param = {};
  param["entity.counselType.entityId"] = counselTypeEid.value;
  scriptApi
    .getScript(param)
    .then((response) => {
      if (response.status === 200) {
        if (!response.data.length) {
          showAlert("등록된 스크립트가 없습니다.");
          return;
        }
        counselTypeScript.value = response.data[0];
        setCounselTypeNameWithPath(counselTypeScript.value.counselType?.path);
        counselTypeScript.value.counselTypeNameWithPath = counselTypeNameWithPath.value;
        setPopup(counselTypeEid.value);
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function setPopup(entityId) {
  const popupName = counselTypeScript.value.entityId;
  const leftPosition = 100 * popupList.value.length;
  const topPosition = 100 * popupList.value.length;
  popupList.value.forEach((popup) => {
    if (!popup.closed) {
      popup.focus(); // 기존 팝업창을 다시 앞쪽으로 가져옴
    }
  });

  const popupKey = `script-${entityId}`;
  localStorage.setItem(popupKey, JSON.stringify(counselTypeScript.value));

  const popup = window.open(
    `/view/counselTypeScript?popupKey=${popupKey}`,
    popupName,
    `width=1200,height=600,left=${leftPosition},top=${topPosition}`
  );

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
    showAlert("팝업이 차단되었거나 열리지 않았습니다.");
  }
}

function setCounselTypeNameWithPath(path) {
  if (!path) {
    counselTypeNameWithPath.value = null;
    return;
  }
  let pathArray = path.split(".");
  let nameWithPath = "";
  if (pathArray.length > 0) nameWithPath = counselTypeStore.counselTypes.get(pathArray[0])?.name;
  if (pathArray.length > 1) nameWithPath += ` > ${counselTypeStore.counselTypes.get(pathArray[1])?.name}`;
  if (pathArray.length > 2) nameWithPath += ` > ${counselTypeStore.counselTypes.get(pathArray[2])?.name}`;
  counselTypeNameWithPath.value = nameWithPath;
}
</script>

<template>
  <div class="detail q-ml-xs column" ref="container" tabindex="0" @focusin="handleFocusIn" @focusout="handleFocusOut">
    <a-title-bar :title="title" class="col-auto full-width" :close="true" @close="$emit('close')" />

    <div class="col q-pa-xs b-border column table-container full-width">
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs full-height">
          티켓유형
        </div>
        <div class="col top-border-right justify-center column q-px-xs full-height">
          {{ typeCode?.name }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          티켓번호
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">{{ ticket.entityId }}</div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>처리상태</div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          <a-select :options="statusOptions" option-label="name" v-model="statusCode" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">IN채널</div>
        <div class="col body-border-right justify-center column q-px-xs full-height">{{ inChannel }}</div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          OUT채널
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">{{ outChannel }}</div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          제품분류
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          <a-input v-model="productType" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>상담구분</div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          <a-select :options="counselCategoryoptions" v-model="counselCategoryCode" option-label="name" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          인입경로
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">{{ ticket.inboundPath }}</div>
      </div>
      <div class="col-auto row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>상담유형</div>
          <q-btn
            icon="help"
            round
            unelevated
            style="width: 24px; height: 24px; padding: 0px"
            dense
            size="12px"
            @click="openScriptPopup"
            ><q-tooltip anchor="center right" self="center start">스크립트</q-tooltip></q-btn
          >
        </div>
        <div class="col body-border-right justify-center column q-pa-xs full-height">
          <div class="fit">
            <a-input
              class="col q-mb-xs"
              v-model="searchKeyword"
              @update:model-value="debounceSearch"
              placeholder="상담유형을 검색해주세요."
            >
              <q-menu
                v-model="showSearchMenu"
                auto-close
                transition-show="scale"
                transition-hide="scale"
                fit
                no-focus
                no-parent-event
                @hide="showSearchMenu = false"
              >
                <q-list>
                  <q-item
                    v-for="(result, i) in searchResult"
                    :key="i"
                    clickable
                    @click="handleSearchClick(result.value)"
                    >{{ result.name }}
                  </q-item>
                </q-list>
              </q-menu>
            </a-input>
            <div class="col row">
              <a-select
                :options="counselTypeCodeLargeOptions"
                v-model="counselTypeCodeLarge"
                option-label="name"
                class="col"
              />
              <a-select
                :options="counselTypeCodeMediumOptions"
                v-model="counselTypeCodeMedium"
                option-label="name"
                class="col"
              />
              <a-select
                :options="counselTypeCodeSmallOptions"
                v-model="counselTypeCodeSmall"
                option-label="name"
                class="col"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>문의</div>
        </div>
        <div class="col body-border-right justify-center column q-pa-xs full-height">
          <a-textarea height="100%" class="col" v-model="inquiry" />
        </div>
      </div>
      <div class="col row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>상담내용</div>
        </div>
        <div class="col body-border-right justify-center column q-pa-xs full-height">
          <a-textarea height="100%" class="col" v-model="contents" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          재통화예약
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          <div class="row no-wrap">
            <a-input type="date" class="col" v-model="reservationDate" />
            <a-input type="time" class="col" v-model="reservationTime" />
          </div>
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">보고자</div>
        <div
          class="col body-border-right justify-center column q-px-xs full-height"
          v-if="ticket.createdByUserName && ticket.createdByUserId"
        >
          {{ ticket.createdByUserName }} [{{ ticket.createdByUserId }}]
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height" v-else></div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>담당자</div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          <a-input @click="openUserSearchPopup" v-model="managerInput" :readonly="true" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          생성일시
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.createdDate }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          변경일시
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.lastModifiedDate }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          작업이력
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          <div class="row justify-between">
            <span></span>
            <a-btn label="보기" @click="openTicketHistory" />
          </div>
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">고객명</div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          <a-input v-model="customerName" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs full-height">
          전화번호
        </div>
        <div class="col body-border-right justify-center column q-px-xs full-height">
          {{ ticket.tel }}
        </div>
      </div>
      <div class="text-right q-mt-xs col-auto full-width bg-grey-5 q-pa-xs" v-if="canSaveTicket">
        <a-btn label="저장" @click="update" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-border-left {
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}

.body-border-right {
  border: 1px solid $grey-5;
  border-top: none;
}

.top-border-left {
  border: 1px solid $grey-5;
  border-right: none;
}

.top-border-right {
  border: 1px solid $grey-5;
}

.t-column {
  width: 90px;
  background-color: $grey-2;
}

.fixed-height {
  height: $line-height + 2;
}

.detail {
  width: 400px;
}

.b-border {
  border-right: 1px solid $grey-5;
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}
</style>
