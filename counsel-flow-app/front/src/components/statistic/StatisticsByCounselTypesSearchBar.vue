<script setup>
import { ref, computed, watch } from "vue";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import ASelect from "components/common/ASelect.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import ACheckbox from "components/common/ACheckbox.vue";

const emit = defineEmits(["search", "excelDownload"]);

const counselTypeStore = useCounselTypeStore();

// 조회가능 최대기간
const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());

const fromDate = ref(DEFAULT_FROM_DATE); // 'YYYY-MM-DD'
const toDate = ref(DEFAULT_TO_DATE); // 'YYYY-MM-DD'

const counselTypeCodeLarge = ref(null); // 상담유형1
const counselTypeCodeMedium = ref(null); // 상담유형2
const counselTypeCodeSmall = ref(null); // 상담유형3

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
const useCounselType = ref(false);

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
  counselTypeCodeLargeOptions,
  (newOptions) => {
    if (newOptions.length) counselTypeCodeLarge.value = null;
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
        ...counselTypeStore
          .getChildrenCounselTypesByTopParentCodeValue(newVal.code)
          .map((item) => ({ name: item.name, value: item })),
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
        ...counselTypeStore
          .getChildrenCounselTypesByTopParentCodeValue(newVal.code)
          .map((item) => ({ name: item.name, value: item })),
      ];
      counselTypeCodeSmall.value = null;
    } else {
      counselTypeCodeSmallOptions.value = [{ name: "전체", value: null }];
      counselTypeCodeSmall.value = null;
    }
  },
  { immediate: true }
);

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
    param.fromDate = fromDate.value;
    param.toDate = toDate.value;
  } else {
    param.fromDate = DEFAULT_FROM_DATE;
    param.toDate = DEFAULT_TO_DATE;
  }

  if (useCounselType.value) {
    if (counselTypeCodeLarge.value) param.counselTypePath = counselTypeCodeLarge.value.code;
    if (counselTypeCodeMedium.value) param.counselTypePath += `.${counselTypeCodeMedium.value.code}`;
    if (counselTypeCodeSmall.value) param.counselTypePath += `.${counselTypeCodeSmall.value.code}`;
  }

  emit("search", param);
}

function resetSearch() {
  useCreatedDate.value = true;
  useCounselType.value = false;

  fromDate.value = DEFAULT_FROM_DATE;
  toDate.value = DEFAULT_TO_DATE;
  counselTypeCodeLarge.value = null;
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
        <a-checkbox v-model="useCounselType" label="상담유형" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 500px">
        <div class="row full-width">
          <a-select
            class="col"
            :options="counselTypeCodeLargeOptions"
            v-model="counselTypeCodeLarge"
            option-label="name"
          />
          <a-select
            class="col"
            :options="counselTypeCodeMediumOptions"
            v-model="counselTypeCodeMedium"
            option-label="name"
          />
          <a-select
            class="col"
            :options="counselTypeCodeSmallOptions"
            v-model="counselTypeCodeSmall"
            option-label="name"
          />
        </div>
      </div>
      <div class="col top-border-right justify-center column q-px-xs">
        <div class="row">
          <div class="col"></div>
          <div class="col-auto q-ml-xs text-right">
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
</style>
