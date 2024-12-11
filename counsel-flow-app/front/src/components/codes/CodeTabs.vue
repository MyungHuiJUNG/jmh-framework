<script setup>
import { ref, nextTick, watch } from "vue";
import SystemCodeList from "./SystemCodeList.vue";
import ServiceCodeList from "./ServiceCodeList.vue";
import ATabs from "../common/ATabs.vue";
import ATab from "../common/ATab.vue";
import AInput from "components/common/AInput.vue";
import ASelect from "components/common/ASelect.vue";
import ABtn from "components/common/ABtn.vue";
import codeApi from "src/js/api/codeApi";
import ACheckbox from "components/common/ACheckbox.vue";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";

const selectedTab = ref("system");

const SYSTEM = FlowSystemCode.CODE_TYPE.SYSTEM;
const SERVICE = FlowSystemCode.CODE_TYPE.SERVICE;

const codeData = ref([]);
const useCodeName = ref(false);
const useCode = ref(false);
const useUsable = ref(false);

const useState = ref(null);
const useStateList = [
  { label: "전체", value: null },
  { label: "사용", value: true },
  { label: "사용 안함", value: false },
];
const code = ref("");
const codeName = ref("");
const originalRows = ref([]);

const loading = ref(false);

function getCodes() {
  return new Promise((resolve, reject) => {
    codeApi
      .getCodes()
      .then((response) => {
        if (response.status === 200) {
          const sortDataByOrderNumber = (data) => {
            return data
              .map((item) => {
                if (item.children && item.children.length > 0) {
                  item.children = sortDataByOrderNumber(item.children);
                } else {
                  delete item.children;
                }
                return item;
              })

              .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
          };

          const sortedData = sortDataByOrderNumber(response.data);
          codeData.value = sortedData;
          originalRows.value = JSON.parse(JSON.stringify(sortedData));
          resolve();
        }
      })
      .catch((error) => {
        handleApiError(error);
        reject(error);
      });
  });
}

function recursiveSearch(data, searchTerm, field) {
  return data.reduce((acc, item) => {
    const currentItem = { ...item };
    let match = false;

    if (currentItem[field] && currentItem[field].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
      match = true;
    }

    if (currentItem.children && currentItem.children.length > 0) {
      const childResults = recursiveSearch(currentItem.children, searchTerm, field);
      if (childResults.length > 0) {
        match = true;
        currentItem.children = childResults;
      } else if (match) {
        currentItem.children = item.children;
      } else {
        delete currentItem.children;
      }
    }

    if (match) {
      acc.push(currentItem);
    }

    return acc;
  }, []);
}

function recursiveFilterByUsable(data, usable) {
  return data.reduce((acc, item) => {
    const currentItem = { ...item };
    let match = currentItem.usable === usable;

    if (currentItem.children && currentItem.children.length > 0) {
      const childResults = recursiveFilterByUsable(currentItem.children, usable);
      if (childResults.length > 0) {
        match = true;
        currentItem.children = childResults;
      } else if (match) {
        currentItem.children = item.children;
      } else {
        delete currentItem.children;
      }
    }

    if (match) {
      acc.push(currentItem);
    }

    return acc;
  }, []);
}

const filteredRows = ref([]);

async function search() {
  loading.value = true;

  await getCodes();
  applyFilters();

  await nextTick();

  loading.value = false;
}

function applyFilters() {
  let codeType = selectedTab.value === "system" ? SYSTEM : SERVICE;

  let filteredData = JSON.parse(JSON.stringify(originalRows.value));

  if (useCodeName.value && codeName.value?.trim()) {
    filteredData = recursiveSearch(filteredData, codeName.value.trim(), "name");
  }

  if (useCode.value && code.value?.trim()) {
    filteredData = recursiveSearch(filteredData, code.value.trim(), "code");
  }

  if (useUsable.value && useState.value !== null) {
    filteredData = recursiveFilterByUsable(filteredData, useState.value);
  }

  filteredData = filteredData.filter((item) => item.codeType === codeType);

  filteredRows.value = filteredData;
}

async function reset() {
  codeName.value = "";
  code.value = "";
  useState.value = null;
  useCodeName.value = false;
  useCode.value = false;
  useUsable.value = false;
}

watch(codeName, (newValue) => {
  if (newValue) useCodeName.value = true;
  else useCodeName.value = false;
});

watch(code, (newValue) => {
  if (newValue) useCode.value = true;
  else useCode.value = false;
});

watch(useState, (newValue) => {
  if (newValue) useUsable.value = true;
  else useUsable.value = false;
});
</script>

<template>
  <div class="row col fit column a-border q-pa-xs" style="min-height: 813px">
    <table class="my-table a-border q-mb-xs full-width">
      <colgroup>
        <col class="t-column" width="120px" />
        <col width="200px" />
        <col class="t-column" width="120px" />
        <col width="200px" />
        <col class="t-column" width="120px" />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <td class="a-border">
            <div class="row">
              <a-checkbox v-model="useCodeName" label="코드명" />
            </div>
          </td>
          <td><a-input class="custom-input" v-model="codeName" @keyup.enter="search"></a-input></td>

          <td class="a-border">
            <div class="row">
              <a-checkbox v-model="useCode" label="코드" />
            </div>
          </td>
          <td><a-input class="custom-input" v-model="code" @keyup.enter="search"></a-input></td>

          <td class="a-border">
            <div class="row">
              <a-checkbox v-model="useUsable" label="사용여부" />
            </div>
          </td>
          <td><a-select v-model="useState" :options="useStateList" style="width: 150px"></a-select></td>

          <td>
            <div class="row q-gutter-xs justify-end">
              <a-btn label="조회" @click="search"></a-btn><a-btn label="초기화" @click="reset"></a-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <a-tabs v-model="selectedTab">
        <a-tab name="system" label="시스템" />
        <a-tab name="service" label="서비스" />
      </a-tabs>
    </div>
    <div class="full-height col" v-if="selectedTab === 'system'">
      <SystemCodeList :filteredRows="filteredRows" />
    </div>
    <div class="full-height col" v-if="selectedTab === 'service'">
      <ServiceCodeList :filteredRows="filteredRows" />
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped>
.my-table {
  border-collapse: collapse;

  td .row {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  tr,
  td {
    padding: 1px map-get($space-xs, x);
    vertical-align: middle;
    height: $line-height + 2px;
  }
}

.t-column {
  background-color: $grey-2;
}
</style>
