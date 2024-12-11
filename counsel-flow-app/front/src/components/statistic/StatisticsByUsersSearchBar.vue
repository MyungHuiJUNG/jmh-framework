<script setup>
import { ref, computed, watch, watchEffect } from "vue";
import { useQuasar } from "quasar";
import { useOrganizationStore } from "src/stores/organizationStore";
import ASelect from "components/common/ASelect.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import ACheckbox from "components/common/ACheckbox.vue";
import UserPopup from "components/common/UserPopup.vue";

const $q = useQuasar();
const emit = defineEmits(["search", "excelDownload"]);

const organizationStore = useOrganizationStore();

const useCreatedDate = ref(true);
const useOrg = ref(false);
const useUser = ref(false);
const useTel = ref(false);

const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());

const fromDate = ref(DEFAULT_FROM_DATE); // 'YYYY-MM-DD'
const toDate = ref(DEFAULT_TO_DATE); // 'YYYY-MM-DD'

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

const userEid = ref();
const userName = ref();
const tel = ref();

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

watch(userEid, (newVal) => {
  if (newVal) useUser.value = true;
});

watch(tel, (newVal) => {
  if (newVal) useTel.value = true;
  else useTel.value = false;
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

function search() {
  const param = {};
  if (useCreatedDate.value) {
    param.fromDate = fromDate.value;
    param.toDate = toDate.value;
  } else {
    param.fromDate = DEFAULT_FROM_DATE;
    param.toDate = DEFAULT_TO_DATE;
  }

  if (useOrg.value) {
    if (org1.value) param.organizationPath = org1.value.code;
    if (org2.value) param.organizationPath += `.${org2.value.code}`;
    if (org3.value) param.organizationPath += `.${org3.value.code}`;
  }

  if (useUser.value) param.userEntityId = userEid.value;
  if (useTel.value && tel.value?.trim()) param.ctiExtension = tel.value.trim();

  emit("search", param);
}

function resetSearch() {
  useCreatedDate.value = true;
  useOrg.value = false;
  useUser.value = false;
  useTel.value = false;

  fromDate.value = DEFAULT_FROM_DATE;
  toDate.value = DEFAULT_TO_DATE;
  org1.value = null;
  userEid.value = null;
  userName.value = null;
  tel.value = null;
}
</script>

<template>
  <div class="column no-wrap">
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
        <a-checkbox v-model="useOrg" label="조직" />
      </div>
      <div class="col top-border-right justify-center column q-px-xs">
        <div class="row col-auto" style="width: 500px">
          <a-select class="col" :options="org1Options" v-model="org1" option-label="name" />
          <a-select class="col" :options="org2Options" v-model="org2" option-label="name" />
          <a-select class="col" :options="org3Options" v-model="org3" option-label="name" />
        </div>
      </div>
    </div>
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useUser" label="상담사" />
      </div>
      <div class="col-auto body-border-left justify-center column q-px-xs" style="width: 240px">
        <div class="row no-wrap">
          <a-input v-model="userName" :readonly="true" /><a-btn
            icon="search"
            class="q-ml-xs"
            @click="openUserSearchPopup"
          />
        </div>
      </div>
      <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useTel" label="내선번호" />
      </div>
      <div class="col body-border-right justify-center column q-px-xs no-wrap">
        <div class="row justify-between no-wrap">
          <div>
            <a-input v-model="tel" @keyup.enter="search" style="width: 200px" />
          </div>
          <div class="col-auto q-ml-xs text-right no-wrap">
            <a-btn label="조회" @click="search" />
            <a-btn label="Excel" class="q-ml-xs" @click="$emit('excelDownload')" />
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
