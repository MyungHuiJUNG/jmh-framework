<script setup>
import ABtn from "../common/ABtn.vue";
import ACheckbox from "../common/ACheckbox.vue";
import AInput from "../common/AInput.vue";
import ASelect from "../common/ASelect.vue";
import { ref, computed, watch } from "vue";
import UserPopup from "../common/UserPopup.vue";
import { useQuasar } from "quasar";
import { useCodeStore } from "src/stores/codeStore";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const $q = useQuasar();
const codeStore = useCodeStore();

const emit = defineEmits(["search"]);

const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());
const keyword = ref();
const fromDate = ref(DEFAULT_FROM_DATE); // 'YYYY-MM-DD'
const toDate = ref(DEFAULT_TO_DATE); // 'YYYY-MM-DD'
const senderName = ref();
const senderEid = ref();
const messageType = ref(null);

const messageTypeOptions = ref(
  computed(() => {
    return [{ name: "전체", value: null }, ...codeStore.codes.get(FlowSystemCode.CODES.MESSAGE_TYPE).children];
  })
);

const useCreatedDate = ref(true);
const useKeyWord = ref(false);
const useSender = ref(false);
const useMessageType = ref(false);

watch(keyword, (newVal) => {
  if (newVal) useKeyWord.value = true;
  else useKeyWord.value = false;
});

watch(senderEid, (newVal) => {
  if (newVal) useSender.value = true;
  else useSender.value = false;
});

watch(messageType, (newVal) => {
  if (newVal) useMessageType.value = true;
  else useMessageType.value = false;
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

  if (useMessageType.value && messageType.value) param["entity.type"] = messageType.value.code;
  if (useKeyWord.value && keyword.value?.trim()) param.keyword = keyword.value.trim();
  if (useSender.value) param["senderEntityId"] = senderEid.value;

  emit("search", param);
}

function resetSearch() {
  useCreatedDate.value = true;
  useKeyWord.value = false;
  useSender.value = false;
  useMessageType.value = false;

  fromDate.value = DEFAULT_FROM_DATE;
  toDate.value = DEFAULT_TO_DATE;
  keyword.value = null;
  senderEid.value = null;
  senderName.value = null;
  messageType.value = null;
}

function openUserPopup() {
  $q.dialog({
    component: UserPopup,
    componentProps: {
      enableRowDblClick: true,
    },
  }).onOk((payload) => {
    senderEid.value = payload.payload[0].entityId;
    senderName.value = `${payload.payload[0].name} [${payload.payload[0].id}]`;
  });
}
</script>

<template>
  <div class="col-auto row fixed-height">
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
      <a-checkbox v-model="useMessageType" label="유형" />
    </div>
    <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 100px">
      <a-select :options="messageTypeOptions" v-model="messageType" option-label="name" />
    </div>
    <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
      <a-checkbox v-model="useKeyWord" label="제목 + 내용" />
    </div>
    <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 300px">
      <a-input v-model="keyword" @keyup.enter="search" />
    </div>
    <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
      <a-checkbox v-model="useSender" label="보낸사람" />
    </div>
    <div class="col top-border-left justify-center column q-px-xs">
      <div class="row col no-wrap items-center">
        <a-input readonly v-model="senderName" />
        <a-btn icon="search" @click="openUserPopup" class="q-ml-xs" />
      </div>
    </div>
    <div class="col-auto top-border-end justify-center column q-px-xs text-right">
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
}

.top-border-end {
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
