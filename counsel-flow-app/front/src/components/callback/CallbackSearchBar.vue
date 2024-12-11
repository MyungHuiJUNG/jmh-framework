<script setup>
import { ref, watch, computed } from "vue";
import AInput from "components/common/AInput.vue";
import ACheckbox from "../common/ACheckbox.vue";
import ABtn from "../common/ABtn.vue";
import ASelect from "../common/ASelect.vue";
import UserPopup from "../common/UserPopup.vue";
import { useQuasar } from "quasar";
import { useCodeStore } from "src/stores/codeStore";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import { useServiceStore } from "src/stores/representativeServiceStore";

const emit = defineEmits(["search"]);
const $q = useQuasar();
const codeStore = useCodeStore();
const serviceStore = useServiceStore();
const TICKET_PROCESS_STATUS = FlowSystemCode.CODES.TICKET_PROCESS_STATUS;
const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());

const fromDate = ref(DEFAULT_FROM_DATE); // 'YYYY-MM-DD'
const toDate = ref(DEFAULT_TO_DATE); // 'YYYY-MM-DD'
const tel = ref();
const statusCode = ref(null);
const representNumber = ref(null);
const managerEid = ref();
const managerName = ref();

const useCreatedDate = ref(true);
const useTel = ref(false);
const useStatus = ref(false);
const useService = ref(false);
const useManager = ref(false);

const statusOptions = ref(
  computed(() => {
    return [{ name: "전체", value: null }, ...codeStore.codes.get(TICKET_PROCESS_STATUS).children];
  })
);

const serviceOptions = ref(
  computed(() => {
    return [{ representNumberName: "전체", representNumber: null }, ...serviceStore.services];
  })
);

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

watch(tel, (newVal) => {
  if (newVal) useTel.value = true;
  else useTel.value = false;
});

watch(statusCode, (newVal) => {
  if (newVal) useStatus.value = true;
  else useStatus.value = false;
});

watch(representNumber, (newVal) => {
  if (newVal) useService.value = true;
  else useService.value = false;
});

watch(managerEid, (newVal) => {
  if (newVal) useManager.value = true;
  else useManager.value = false;
});

function setToDate(dateString) {
  // 입력된 날짜 문자열을 Date 객체로 변환
  const date = new Date(dateString);

  // 하루(24시간)를 추가
  date.setDate(date.getDate() + 1);

  // 년, 월, 일을 각각 추출하여 'yyyy-MM-dd' 형식으로 반환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function search() {
  const param = {};

  if (useCreatedDate.value) {
    param.fromCreatedDate = fromDate.value + " 00:00:00";
    param.toCreatedDate = setToDate(toDate.value) + " 00:00:00";
  } else {
    param.fromCreatedDate = DEFAULT_FROM_DATE + " 00:00:00";
    param.toCreatedDate = setToDate(DEFAULT_TO_DATE) + " 00:00:00";
  }

  if (useTel.value && tel.value?.trim()) param["entity.receptionNumber"] = tel.value.trim();
  if (useStatus.value) param["ticketStatusCode"] = statusCode.value.code; // code
  if (useService.value && representNumber.value) param["entity.representNumber"] = representNumber.value;
  if (useManager.value && managerEid.value) param["managerEntityId"] = managerEid.value;
  emit("search", param);
}

function resetSearch() {
  fromDate.value = DEFAULT_FROM_DATE;
  toDate.value = DEFAULT_TO_DATE;
  tel.value = null;
  statusCode.value = null;
  representNumber.value = null;
  managerEid.value = null;
  managerName.value = null;

  useCreatedDate.value = true;
  useTel.value = false;
  useStatus.value = false;
  useService.value = false;
  useManager.value = false;
}

function openMangerSearchPopup() {
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
</script>

<template>
  <div class="column">
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useCreatedDate" label="일자" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 240px">
        <div class="row full-width no-wrap">
          <a-input class="text-no-wrap col" type="date" v-model="fromDate" :max="toDate" />
          <a-input class="text-no-wrap col" type="date" v-model="toDate" :min="fromDate" />
        </div>
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useTel" label="수신번호" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 200px">
        <a-input v-model="tel" @keyup.enter="search" />
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useManager" label="담당자" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 200px">
        <div class="row no-wrap">
          <a-input v-model="managerName" :readonly="true" /><a-btn
            icon="search"
            class="q-ml-xs"
            @click="openMangerSearchPopup"
          />
        </div>
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useStatus" label="처리상태" />
      </div>
      <div class="col top-border-right justify-center column q-px-xs">
        <a-select :options="statusOptions" v-model="statusCode" option-label="name" style="width: 150px" />
      </div>
    </div>
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useService" label="대표서비스" />
      </div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 240px">
        <a-select
          :options="serviceOptions"
          v-model="representNumber"
          option-label="representNumberName"
          option-value="representNumber"
        />
        <!-- <a-input v-model="serviceCode" @keyup.enter="search" /> -->
      </div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs"></div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 200px"></div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs"></div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 200px"></div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs"></div>
      <div class="col body-border-right justify-center column q-px-xs">
        <div class="text-right full-width">
          <a-btn label="조회" @click="search" />
          <a-btn label="초기화" class="q-ml-xs" @click="resetSearch" />
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
