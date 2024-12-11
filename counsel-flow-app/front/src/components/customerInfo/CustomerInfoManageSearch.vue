<script setup>
import { ref, computed, watch } from "vue";
import { useCodeStore } from "src/stores/codeStore";
import ASelect from "components/common/ASelect.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import ACheckbox from "components/common/ACheckbox.vue";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const CUSTOMER_TYPE = FlowSystemCode.CODES.CUSTOMER_TYPE;
const emit = defineEmits(["search"]);
const codeStore = useCodeStore();

const useCompanyName = ref(false);
const useTel = ref(false);
const useManager = ref(false);
const useCustomerType = ref(false);

const name = ref("");
const searchTel = ref("");
const managerName = ref("");
const customerTypeCode = ref(null);

const customerTypeOptions = computed(() => {
  const codes = codeStore.codes.get(CUSTOMER_TYPE)?.children || [];
  return [
    { name: "전체", value: null },
    ...codes.map((item) => ({
      name: item.name,
      value: item.code,
    })),
  ];
});

watch(name, (newValue) => {
  useCompanyName.value = newValue.trim() !== "";
});

watch(searchTel, (newValue) => {
  useTel.value = newValue.trim() !== "";
});

watch(managerName, (newValue) => {
  useManager.value = newValue.trim() !== "";
});

watch(customerTypeCode, (newValue) => {
  useCustomerType.value = newValue !== null && newValue !== undefined && newValue !== "";
});

function search() {
  const param = {};

  if (useCompanyName.value && name.value) {
    param["entity.name"] = name.value;
  }

  if (useTel.value && searchTel.value) {
    const cleanTel = searchTel.value.replace(/-/g, "");
    param["searchTel"] = cleanTel;
  }
  if (useManager.value && managerName.value) {
    param["entity.managerName"] = managerName.value;
  }

  if (useCustomerType.value && customerTypeCode.value) {
    param["entity.customerTypeCode"] = customerTypeCode.value;
  }

  emit("search", param);
}

function resetSearch() {
  name.value = "";
  searchTel.value = "";
  managerName.value = "";
  customerTypeCode.value = null;

  useCompanyName.value = false;
  useTel.value = false;
  useManager.value = false;
  useCustomerType.value = false;
}
</script>

<template>
  <div class="column">
    <div class="col-auto row fixed-height">
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useCompanyName" label="회사명" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 200px">
        <a-input v-model="name" @keyup.enter="search" />
      </div>

      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useTel" label="전화번호" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 200px">
        <a-input v-model="searchTel" @keyup.enter="search" />
      </div>

      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useManager" label="업체담당자" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 200px">
        <a-input v-model="managerName" @keyup.enter="search" />
      </div>

      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useCustomerType" label="고객유형" />
      </div>
      <div class="col top-border-right justify-center column q-px-xs">
        <div class="col full-width row justify-between flex-center">
          <a-select
            :options="customerTypeOptions"
            v-model="customerTypeCode"
            option-label="name"
            option-value="value"
            style="width: 150px"
          />
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

.width-10 {
  width: 10%;
}

.width-20 {
  width: 20%;
}

.width-25 {
  width: 25%;
}
</style>
