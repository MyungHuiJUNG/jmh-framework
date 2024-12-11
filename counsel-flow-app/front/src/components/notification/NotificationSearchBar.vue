<script setup>
import ABtn from "../common/ABtn.vue";
import ACheckbox from "../common/ACheckbox.vue";
import AInput from "../common/AInput.vue";
import ASelect from "../common/ASelect.vue";
import { ref, computed, watch } from "vue";
import { useCodeStore } from "src/stores/codeStore";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const NOTIFICATION_TYPE = FlowSystemCode.CODES.NOTIFICATION_TYPE;

const emit = defineEmits(["search"]);
const codeStore = useCodeStore();

const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());
const typeCode = ref(null);
const message = ref();
const fromDate = ref(DEFAULT_FROM_DATE); // 'YYYY-MM-DD'
const toDate = ref(DEFAULT_TO_DATE); // 'YYYY-MM-DD'
const isRead = ref(null);

const useTypeCode = ref(false);
const useMessage = ref(false);
const useCreatedDate = ref(true);
const useIsRead = ref(false);

const typeCodeOptions = ref(
  computed(() => {
    const notificationTypes = codeStore.codes.get(FlowSystemCode.CODES.NOTIFICATION_TYPE).children;
    const filterMessageType = notificationTypes.filter(
      (type) => type.code !== FlowSystemCode.NOTIFICATION_TYPE.MESSAGE
    );
    return [{ name: "전체", value: null }, ...filterMessageType];
  })
);

const isReadOptions = [
  { name: "전체", value: null },
  { name: "읽음", value: true },
  { name: "안읽음", value: false },
];

watch(typeCode, (newVal) => {
  if (newVal) useTypeCode.value = true;
  else useTypeCode.value = false;
});

watch(message, (newVal) => {
  if (newVal) useMessage.value = true;
  else useMessage.value = false;
});

watch(isRead, (newVal) => {
  if (newVal === true || newVal === false) useIsRead.value = true;
  else if (newVal === null) useIsRead.value = false;
});

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

function search() {
  const param = {};
  if (useCreatedDate.value) {
    if (fromDate.value) param.fromCreatedDate = reformatFromDate(fromDate.value);
    if (toDate.value) param.toCreatedDate = reformatToDate(toDate.value);
  } else {
    param.fromCreatedDate = reformatFromDate(DEFAULT_FROM_DATE);
    param.toCreatedDate = reformatToDate(DEFAULT_TO_DATE);
  }

  if (useTypeCode.value && typeCode.value) param["entity.typeCode"] = typeCode.value.code;
  else
    param.typeCodes = codeStore.codes
      .get(FlowSystemCode.CODES.NOTIFICATION_TYPE)
      .children.filter((child) => child.code !== FlowSystemCode.NOTIFICATION_TYPE.MESSAGE)
      .map((child) => child.code)
      .join(",");
  if (useMessage.value && message.value?.trim()) param.keyword = message.value.trim();
  if (useIsRead.value) param["entity.isRead"] = isRead.value;

  emit("search", param);
}

function resetSearch() {
  useTypeCode.value = false;
  useMessage.value = false;
  useCreatedDate.value = true;
  useIsRead.value = false;

  typeCode.value = null;
  message.value = null;
  isRead.value = null;
  fromDate.value = DEFAULT_FROM_DATE;
  toDate.value = DEFAULT_TO_DATE;
}
</script>

<template>
  <div class="col-auto row fixed-height">
    <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
      <a-checkbox v-model="useTypeCode" label="구분" />
    </div>
    <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 150px">
      <a-select :options="typeCodeOptions" v-model="typeCode" option-label="name" style="width: 100%" />
    </div>
    <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
      <a-checkbox v-model="useMessage" label="메시지" />
    </div>
    <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 300px">
      <a-input v-model="message" @keyup.enter="search" />
    </div>
    <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
      <a-checkbox v-model="useCreatedDate" label="수신일자" />
    </div>
    <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 240px">
      <div class="row full-width no-wrap">
        <a-input class="text-no-wrap col" type="date" v-model="fromDate" :max="toDate" />
        <a-input class="text-no-wrap col" type="date" v-model="toDate" :min="fromDate" />
      </div>
    </div>
    <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
      <a-checkbox v-model="useIsRead" label="조회여부" />
    </div>
    <div class="col top-border-left justify-center column q-px-xs width-25">
      <a-select :options="isReadOptions" v-model="isRead" option-label="name" style="width: 150px" />
    </div>
    <div class="col-auto top-border-right justify-center column q-px-xs text-right">
      <div class="row text-right">
        <a-btn label="조회" @click="search" />
        <a-btn label="초기화" class="q-ml-xs" @click="resetSearch" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.t-column {
  background-color: $grey-2;
  width: 120px;
}

.top-border-left {
  border: 1px solid $grey-5;
  border-right: none;
}

.top-border-right {
  border: 1px solid $grey-5;
  border-left: none;
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
