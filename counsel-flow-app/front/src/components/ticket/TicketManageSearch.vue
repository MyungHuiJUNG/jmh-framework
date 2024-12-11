<script setup>
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { useCodeStore } from "src/stores/codeStore";
import { showAlert } from "src/js/common/dialog";
import ASelect from "components/common/ASelect.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import ACheckbox from "components/common/ACheckbox.vue";
import UserPopup from "components/common/UserPopup.vue";
import ticketApi from "src/js/api/ticketApi";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const $q = useQuasar();
const props = defineProps(["hasDatas"]);
const emit = defineEmits(["search"]);

const counselTypeStore = useCounselTypeStore();
const codeStore = useCodeStore();

// 조회가능 최대기간
const MAX_ALLOWED_SEARCH_DAYS = 31;
const DATE_ALERT_MESSAGE = "기간은 최대 31일까지만 설정할 수 있습니다.";
const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());

const fromDate = ref(DEFAULT_FROM_DATE); // 'YYYY-MM-DD'
const toDate = ref(DEFAULT_TO_DATE); // 'YYYY-MM-DD'
const reporterEId = ref();
const reporterName = ref();

const ticketEID = ref();
const tel = ref();

const managerEid = ref();
const managerName = ref();

// 코드상수
const TICKET_TYPE = FlowSystemCode.CODES.TICKET_TYPE;
const COUNSEL_CATEGORY = FlowSystemCode.CODES.COUNSEL_CATEGORY;
const TICKET_PROCESS_STATUS = FlowSystemCode.CODES.TICKET_PROCESS_STATUS;
const COUNSEL_TICKET = FlowSystemCode.TICKET_TYPE.COUNSEL_TICKET;

const counselTypeCodeLarge = ref(); // 상담유형1
const counselTypeCodeMedium = ref(); // 상담유형2
const counselTypeCodeSmall = ref(); // 상담유형3

const typeCode = ref(codeStore.codes.get(COUNSEL_TICKET));
const statusCode = ref(null);
const counselCategoryCode = ref(null);

const counselTypeCodeLargeOptions = ref(
  computed(() => {
    return [
      { name: "전체", value: null },
      ...counselTypeStore.counselTypeArray.map((item) => ({
        name: item.name,
        value: item,
      })),
    ];
  })
);
const counselTypeCodeMediumOptions = ref([{ name: "전체", value: null }]);
const counselTypeCodeSmallOptions = ref([{ name: "전체", value: null }]);

const useCreatedDate = ref(true);
const useCounselCategoryCode = ref(false);
const useReporter = ref(false);
const useTicketEId = ref(false);
const useTel = ref(false);
const useManager = ref(false);
const useTicketType = ref(true);
const useCounselType = ref(false);
const useStatus = ref(false);

// 티켓유형 선택옵션
const ticketTypeOptions = ref(
  computed(() => {
    return [{ name: "전체", value: null }, ...codeStore.codes.get(TICKET_TYPE).children];
  })
);

// 처리상태 선택옵션
const statusOptions = ref(
  computed(() => {
    return [{ name: "전체", value: null }, ...codeStore.codes.get(TICKET_PROCESS_STATUS).children];
  })
);
// 상담구분 선택옵션
const counselCategoryoptions = ref(
  computed(() => {
    return [{ name: "전체", value: null }, ...codeStore.codes.get(COUNSEL_CATEGORY).children];
  })
);

const searchedParam = ref({
  fromCreatedDate: reformatFromDate(DEFAULT_FROM_DATE),
  toCreatedDate: reformatToDate(DEFAULT_TO_DATE),
  "entity.typeCode": COUNSEL_TICKET,
});

watch(fromDate, (newVal) => {
  if (!newVal) {
    fromDate.value = DEFAULT_FROM_DATE;
  }
});

watch(toDate, (newVal) => {
  if (!newVal) {
    toDate.value = DEFAULT_TO_DATE;
  }
});

watch(useCreatedDate, (newVal) => {
  if (!newVal) {
    fromDate.value = DEFAULT_FROM_DATE;
    toDate.value = DEFAULT_TO_DATE;
  }
});

watch(counselCategoryCode, (newVal) => {
  if (newVal) {
    useCounselCategoryCode.value = true;
  } else {
    useCounselCategoryCode.value = false;
  }
});

watch(reporterEId, (newVal) => {
  if (newVal) {
    useReporter.value = true;
  } else {
    useReporter.value = false;
  }
});

watch(ticketEID, (newVal) => {
  if (newVal) {
    useTicketEId.value = true;
  } else {
    useTicketEId.value = false;
  }
});

watch(tel, (newVal) => {
  if (newVal) {
    useTel.value = true;
  } else {
    useTel.value = false;
  }
});

watch(managerEid, (newVal) => {
  if (newVal) {
    useManager.value = true;
  } else {
    useManager.value = false;
  }
});

watch(typeCode, (newVal) => {
  if (newVal) {
    useTicketType.value = true;
  } else {
    useTicketType.value = false;
  }
});

watch(statusCode, (newVal) => {
  if (newVal) {
    useStatus.value = true;
  } else {
    useStatus.value = false;
  }
});

watch(
  counselTypeCodeLargeOptions,
  (newOptions) => {
    if (newOptions.length > 0 && !counselTypeCodeLarge.value) {
      counselTypeCodeLarge.value = null;
    }
  },
  { immediate: true }
);
watch(
  counselTypeCodeLarge,
  (newVal) => {
    if (newVal) {
      useCounselType.value = true;

      counselTypeCodeMediumOptions.value = [
        { name: "전체", value: null },
        ...counselTypeStore.getChildrenCounselTypesByTopParentCodeValue(newVal.code).map((item) => ({
          name: item.name,
          value: item,
        })),
      ];
      counselTypeCodeMedium.value = null;
      counselTypeCodeSmall.value = null;
    } else {
      useCounselType.value = false;
      counselTypeCodeMediumOptions.value = [{ name: "전체", value: null }];
      counselTypeCodeSmallOptions.value = [{ name: "전체", value: null }];
      counselTypeCodeMedium.value = null;
      counselTypeCodeSmall.value = null;
    }
  },
  { immediate: true }
);
watch(
  counselTypeCodeMedium,
  (newVal) => {
    if (newVal) {
      counselTypeCodeSmallOptions.value = [
        { name: "전체", value: null },
        ...counselTypeStore.getChildrenCounselTypesByTopParentCodeValue(newVal.code).map((item) => ({
          name: item.name,
          value: item,
        })),
      ];
      counselTypeCodeSmall.value = null;
    } else {
      counselTypeCodeSmallOptions.value = [{ name: "전체", value: null }];
      counselTypeCodeSmall.value = null;
    }
  },
  { immediate: true }
);

function openReporterSearchPopup() {
  $q.dialog({
    component: UserPopup,
    componentProps: {
      enableRowDblClick: true,
    },
  }).onOk((payload) => {
    reporterName.value = `${payload.payload[0].name} [${payload.payload[0].id}]`;
    reporterEId.value = payload.payload[0].entityId;
  });
}

function openManagerSearchPopup() {
  $q.dialog({
    component: UserPopup,
    componentProps: {
      enableRowDblClick: true,
    },
  }).onOk((payload) => {
    managerName.value = `${payload.payload[0].name} [${payload.payload[0].id}]`;
    managerEid.value = payload.payload[0].entityId;
  });
}

function getFormattedDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function reformatFromDate(fromDate) {
  return fromDate + " 00:00:00";
}

function reformatToDate(dateString) {
  // 문자열을 Date 객체로 변환
  const date = new Date(dateString);

  // 다음 날로 설정
  date.setDate(date.getDate() + 1);

  // 다음 날의 00:00:00으로 설정
  date.setHours(0, 0, 0, 0);

  // yyyy-mm-dd HH:mm:ss 형식으로 변환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 두 자리로 만듦
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function calculateDate() {
  const diffTime = Math.abs(new Date(toDate.value) - new Date(fromDate.value));
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays > MAX_ALLOWED_SEARCH_DAYS;
}

function search() {
  if (useCreatedDate.value && calculateDate()) {
    showAlert(DATE_ALERT_MESSAGE);
    return;
  }
  const param = {};

  // 발행일자
  if (useCreatedDate.value) {
    if (fromDate.value) param.fromCreatedDate = reformatFromDate(fromDate.value);
    if (toDate.value) param.toCreatedDate = reformatToDate(toDate.value);
  } else {
    param.fromCreatedDate = reformatFromDate(DEFAULT_FROM_DATE);
    param.toCreatedDate = reformatToDate(DEFAULT_TO_DATE);
  }

  //상담구분
  if (useCounselCategoryCode.value && counselCategoryCode.value)
    param["entity.counselCategoryCode"] = counselCategoryCode.value.code;

  // 보고자
  if (useReporter.value && reporterEId.value) param["entity.createdBy"] = reporterEId.value;

  // 티켓번호
  if (useTicketEId.value && ticketEID.value?.trim()) param.entityIds = [ticketEID.value.trim()];

  // 전화번호
  if (useTel.value && tel.value?.trim()) param["entity.tel"] = tel.value.trim();

  // 담당자
  if (useManager.value && managerEid.value) param["entity.manager.entityId"] = managerEid.value;

  // 티켓유형
  if (useTicketType.value && typeCode.value) param["entity.typeCode"] = typeCode.value.code;

  // 상담구분
  if (useCounselType.value) {
    if (counselTypeCodeLarge.value) param["entity.counselTypeCodeLarge"] = counselTypeCodeLarge.value.code;
    if (counselTypeCodeMedium.value) param["entity.counselTypeCodeMedium"] = counselTypeCodeMedium.value.code;
    if (counselTypeCodeSmall.value) param["entity.counselTypeCodeSmall"] = counselTypeCodeSmall.value.code;
  }

  // 처리상태
  if (useStatus.value) param["entity.statusCode"] = statusCode.value.code;

  searchedParam.value = param;
  emit("search", param);
}

function resetSearch() {
  useCreatedDate.value = true;
  useCounselCategoryCode.value = false;
  useReporter.value = false;
  useTicketEId.value = false;
  useTel.value = false;
  useManager.value = false;
  useTicketType.value = true;
  useCounselType.value = false;
  useStatus.value = false;

  fromDate.value = DEFAULT_FROM_DATE;
  toDate.value = DEFAULT_TO_DATE;
  counselCategoryCode.value = null;
  reporterName.value = null;
  reporterEId.value = null;
  ticketEID.value = null;
  tel.value = null;
  managerName.value = null;
  managerEid.value = null;
  typeCode.value = codeStore.codes.get(COUNSEL_TICKET);
  counselTypeCodeLarge.value = null;
  counselTypeCodeMedium.value = null;
  counselTypeCodeSmall.value = null;
  statusCode.value = null;
}

async function downloadTickets() {
  if (!props.hasDatas) {
    showAlert("다운로드 받을 목록이 없습니다.");
    return;
  }

  try {
    const response = await ticketApi.downloadTickets(searchedParam.value);

    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition ? contentDisposition.split("filename=")[1].replace(/['"]/g, "") : `TICKET.xlsx`;

    const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    handleApiError(error);
  }
}
</script>

<template>
  <div class="column">
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useCreatedDate" label="발행일자" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 240px">
        <div class="row full-width no-wrap">
          <a-input class="text-no-wrap col" type="date" v-model="fromDate" :max="toDate" />
          <a-input class="text-no-wrap col" type="date" v-model="toDate" :min="fromDate" />
        </div>
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useCounselCategoryCode" label="상담구분" />
      </div>
      <div class="col-auto top-border-left justify-start items-center row q-px-xs" style="width: 500px">
        <a-select
          :options="counselCategoryoptions"
          v-model="counselCategoryCode"
          option-label="name"
          style="width: 160px"
        />
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useReporter" label="보고자" />
      </div>
      <div class="col top-border-right justify-center column q-px-xs">
        <div class="row no-wrap">
          <a-input v-model="reporterName" :readonly="true" style="width: 150px" /><a-btn
            icon="search"
            class="q-ml-xs"
            @click="openReporterSearchPopup"
          />
        </div>
      </div>
    </div>
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useTicketEId" label="티켓번호" />
      </div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 240px">
        <a-input v-model="ticketEID" @keyup.enter="search" />
      </div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useTel" label="전화번호" />
      </div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 500px">
        <a-input v-model="tel" @keyup.enter="search" style="width: 160px" />
      </div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useManager" label="담당자" />
      </div>
      <div class="col body-border-right justify-center column q-px-xs width-25">
        <div class="row no-wrap">
          <a-input v-model="managerName" :readonly="true" style="width: 150px" /><a-btn
            icon="search"
            class="q-ml-xs"
            @click="openManagerSearchPopup"
          />
        </div>
      </div>
    </div>
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useTicketType" label="티켓유형" />
      </div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 240px">
        <a-select :options="ticketTypeOptions" v-model="typeCode" option-label="name" />
      </div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useCounselType" label="상담유형" />
      </div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 500px">
        <div class="row full-width no-wrap">
          <a-select
            class="col"
            :options="counselTypeCodeLargeOptions"
            v-model="counselTypeCodeLarge"
            option-label="name"
          />
          <a-select
            :options="counselTypeCodeMediumOptions"
            v-model="counselTypeCodeMedium"
            option-label="name"
            class="col q-ml-xs"
          />
          <a-select
            :options="counselTypeCodeSmallOptions"
            v-model="counselTypeCodeSmall"
            option-label="name"
            class="col q-ml-xs"
          />
        </div>
      </div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useStatus" label="처리상태" />
      </div>
      <div class="col body-border-right justify-center column q-px-xs width-25">
        <div class="row justify-between full-width no-wrap">
          <div class="col-4">
            <a-select :options="statusOptions" v-model="statusCode" option-label="name" style="width: 150px" />
          </div>
          <div class="col-auto q-ml-xs text-right">
            <a-btn label="조회" @click="search" />
            <a-btn label="Excel" class="q-ml-xs" @click="downloadTickets" />
            <a-btn label="초기화" class="q-ml-xs" @click="resetSearch" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.t-column {
  background-color: $grey-2;
  width: 120px;
}

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

.width-20 {
  width: 20%;
}

.width-25 {
  width: 25%;
}
</style>
