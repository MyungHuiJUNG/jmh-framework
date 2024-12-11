<script setup>
import { ref, watch, computed } from "vue";
import dept_select from "components/common/ASelect.vue";
import dept_input from "components/common/AInput.vue";
import dept_btn from "components/common/ABtn.vue";
import ACheckbox from "../common/ACheckbox.vue";
import { useOrganizationStore } from "src/stores/organizationStore";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const USE = FlowSystemCode.USE_CD.USE;
const UNUSE = FlowSystemCode.USE_CD.UNUSE;

const organizationStore = useOrganizationStore();

const emit = defineEmits(["rowClick", "search", "newClick"]);

const org1Options = ref(
  computed(() => {
    return [
      { name: "전체", value: null },
      ...organizationStore.organizationArray.map((item) => ({
        name: item.name,
        value: item,
      })),
    ];
  })
);
const org2Options = ref([{ name: "전체", value: null }]);
const org3Options = ref([{ name: "전체", value: null }]);
const org1 = ref(null);
const org2 = ref(null);
const org3 = ref(null);

const userName = ref("");
const userId = ref("");
const ctiId = ref("");
const extensionNumber = ref("");
const userState = ref(null);

// 체크박스 연결 상태
const useOrg = ref(false);
const useName = ref(false);
const useId = ref(false);
const useState = ref(false);
const useCtiId = ref(false);
const useExtension = ref(false);

const userStateList = [
  { label: "전체", value: null },
  { label: "사용", value: USE },
  { label: "사용 안함", value: UNUSE },
];

// 조직 검색 파라미터 업데이트

watch(
  org1Options,
  (newOptions) => {
    if (newOptions.length) org1.value = null;
  },
  { immediate: true }
);

watch(
  org1,
  (newVal) => {
    if (newVal) {
      useOrg.value = true;
      org2Options.value = [
        { name: "전체", value: null },
        ...organizationStore
          .getChildrenOrganizationsByTopParentCodeValue(newVal.code)
          .map((item) => ({ name: item.name, value: item })),
      ];
      org2.value = null;
      org3.value = null;
    } else {
      useOrg.value = false;
      org2Options.value = [{ name: "전체", value: null }];
      org3Options.value = [{ name: "전체", value: null }];
      org2.value = null;
      org3.value = null;
    }
  },
  { immediate: true }
);

watch(
  org2,
  (newVal) => {
    if (newVal) {
      org3Options.value = [
        { name: "전체", value: null },
        ...organizationStore
          .getChildrenOrganizationsByTopParentCodeValue(newVal.code)
          .map((item) => ({ name: item.name, value: item })),
      ];
      org3.value = null;
    } else {
      org3Options.value = [{ name: "전체", value: null }];
      org3.value = null;
    }
  },
  { immediate: true }
);

watch(userName, (newValue) => {
  if (newValue) useName.value = true;
  else useName.value = false;
});

watch(userId, (newValue) => {
  if (newValue) useId.value = true;
  else useId.value = false;
});

watch(ctiId, (newValue) => {
  if (newValue) useCtiId.value = true;
  else useCtiId.value = false;
});

watch(extensionNumber, (newValue) => {
  if (newValue) useExtension.value = true;
  else useExtension.value = false;
});

watch(userState, (newValue) => {
  if (newValue) useState.value = true;
  else useState.value = false;
});

// 초기화 함수
function reset() {
  userState.value = null;
  userName.value = "";
  userId.value = "";
  ctiId.value = "";
  extensionNumber.value = "";
  org1.value = null;

  useOrg.value = false;
  useName.value = false;
  useId.value = false;
  useState.value = false;
  useCtiId.value = false;
  useExtension.value = false;
}

// 검색 파라미터 저장 함수
function saveSearchParams() {
  const param = {};

  // 체크박스가 선택된 경우에만 검색 조건에 추가
  if (useOrg.value) {
    if (org1.value) param.organizationPath = org1.value.code;
    if (org2.value) param.organizationPath += `.${org2.value.code}`;
    if (org3.value) param.organizationPath += `.${org3.value.code}`;
  }

  if (useName.value && userName.value?.trim()) param["entity.name"] = userName.value.trim();
  if (useId.value && userId.value?.trim()) param["entity.id"] = userId.value.trim();
  if (useState.value && userState.value !== null) param["useTypeCodes"] = userState.value;
  if (useCtiId.value && ctiId.value?.trim()) param["entity.ctiLoginId"] = ctiId.value.trim();
  if (useExtension.value && extensionNumber.value?.trim()) param["entity.ctiExtension"] = extensionNumber.value.trim();

  emit("search", param);
}
</script>

<template>
  <div class="column">
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useOrg" label="조직(부서)" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 400px">
        <div class="row full-width no-wrap">
          <dept_select class="col" v-model="org1" :options="org1Options" option-label="name" />
          <dept_select class="col" v-model="org2" :options="org2Options" option-label="name" />
          <dept_select class="col" v-model="org3" :options="org3Options" option-label="name" />
        </div>
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useName" label="사용자명" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 150px">
        <dept_input v-model="userName" @keyup.enter="saveSearchParams" />
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useId" label="아이디" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 150px">
        <dept_input v-model="userId" @keyup.enter="saveSearchParams" />
      </div>
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useState" label="사용여부" />
      </div>
      <div class="col top-border-right justify-center column q-px-xs width-25">
        <dept_select v-model="userState" :options="userStateList" style="width: 150px" />
      </div>
    </div>
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useCtiId" label="CTI ID" />
      </div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 400px">
        <dept_input v-model="ctiId" @keyup.enter="saveSearchParams" />
      </div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useExtension" label="내선번호" />
      </div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 150px">
        <dept_input v-model="extensionNumber" @keyup.enter="saveSearchParams" />
      </div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs"></div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 150px"></div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs"></div>
      <div class="col body-border-right justify-center column q-px-xs width-25">
        <div class="row justify-between full-width no-wrap">
          <div class="col-4"></div>
          <div class="col-auto text-right">
            <dept_btn label="조회" @click="saveSearchParams" />
            <dept_btn label="초기화" @click="reset" class="q-ml-xs" />
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
