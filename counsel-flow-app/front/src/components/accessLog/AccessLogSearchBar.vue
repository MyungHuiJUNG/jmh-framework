<script setup>
import { computed, ref, watch } from "vue";
import { useQuasar } from "quasar";
import UserPopup from "components/common/UserPopup.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import ACheckbox from "components/common/ACheckbox.vue";
import ASelect from "../common/ASelect.vue";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import { useCodeStore } from "src/stores/codeStore";

const $q = useQuasar();
const emit = defineEmits(["search"]);

const codeStore = useCodeStore();

const userEid = ref();
const accessType = ref(null);
const userName = ref();
const accessIp = ref();

const useCreatedDate = ref(true);
const useAccessType = ref(false);
const useUser = ref(false);
const useAccessIp = ref(false);

const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());
const fromDate = ref(DEFAULT_FROM_DATE); // 'YYYY-MM-DD'
const toDate = ref(DEFAULT_TO_DATE); // 'YYYY-MM-DD'

const accessTypeOptions = ref(
  computed(() => {
    return [{ name: "전체", value: null }, ...codeStore.codes.get(FlowSystemCode.CODES.ACCESS_TYPE_CODE).children];
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

watch(accessType, (newVal) => {
  if (newVal) useAccessType.value = true;
  else useAccessType.value = false;
});

watch(userEid, (newVal) => {
  if (newVal) useUser.value = true;
});

watch(accessIp, (newVal) => {
  if (newVal) useAccessIp.value = true;
  else useAccessIp.value = false;
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

function getFormattedDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
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
  if (useAccessType.value && accessType.value) param["entity.accessType"] = accessType.value.code;
  if (useUser.value && userEid.value) param["entity.user.entityId"] = userEid.value;
  if (useAccessIp.value && accessIp.value?.trim()) param["entity.clientIpAddress"] = accessIp.value.trim();

  emit("search", param);
}

function resetSearch() {
  useCreatedDate.value = true;
  useAccessType.value = false;
  useUser.value = false;
  useAccessIp.value = false;

  fromDate.value = DEFAULT_FROM_DATE;
  toDate.value = DEFAULT_TO_DATE;
  accessType.value = null;
  userEid.value = null;
  userName.value = null;
  accessIp.value = null;
}

function openUserSearchPopup() {
  $q.dialog({
    component: UserPopup,
    componentProps: {
      enableRowDblClick: true,
    },
  }).onOk((payload) => {
    userName.value = `${payload.payload[0].name} [${payload.payload[0].id}]`;
    userEid.value = payload.payload[0].entityId;
  });
}
</script>

<template>
  <div class="column">
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useCreatedDate" label="조회기간" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 240px">
        <div class="row full-width no-wrap">
          <a-input class="text-no-wrap col" type="date" v-model="fromDate" :max="toDate" />
          <a-input class="text-no-wrap col" type="date" v-model="toDate" :min="fromDate" />
        </div>
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useAccessType" label="접속유형" />
      </div>
      <div class="col-auto top-border-right justify-center column q-px-xs" style="width: 150px">
        <a-select v-model="accessType" :options="accessTypeOptions" option-label="name" />
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useUser" label="사용자" />
      </div>
      <div class="col-auto top-border-right justify-center column q-px-xs" style="width: 200px">
        <div class="row no-wrap">
          <a-input v-model="userName" :readonly="true" /><a-btn
            icon="search"
            class="q-ml-xs"
            @click="openUserSearchPopup"
          />
        </div>
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useAccessIp" label="접속ip" />
      </div>
      <div class="col top-border-right justify-center column q-px-xs">
        <div class="row justify-between no-wrap">
          <div>
            <a-input v-model="accessIp" @keyup.enter="search" style="width: 150px" />
          </div>
          <div class="col-auto q-ml-xs text-right">
            <a-btn label="조회" @click="search" />
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
</style>
