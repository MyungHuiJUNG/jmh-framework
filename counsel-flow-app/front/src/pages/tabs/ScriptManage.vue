<script setup>
import TreeDataList from "components/treedata/TreeDataList.vue";
import counselTypeApi from "src/js/api/counselTypeApi";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { ref, onMounted, watch } from "vue";
import { handleApiError } from "src/js/common/errorHandler";
import AInput from "src/components/common/AInput.vue";
import ACheckbox from "src/components/common/ACheckbox.vue";
import ABtn from "src/components/common/ABtn.vue";
import ATitleBar from "src/components/common/ATitleBar.vue";
import ScriptBoard from "src/components/script/ScriptBoard.vue";

const counselTypeStore = useCounselTypeStore();

const counselTypes = ref([]);

const searchValues = ref();

const useName = ref(false);
const useCode = ref(false);
const nameSearch = ref(null);
const codeSearch = ref(null);

const selectedCounselType = ref();

watch(
  () => nameSearch.value,
  (newVal) => {
    if (newVal) useName.value = true;
    else useName.value = false;
  }
);

watch(
  () => codeSearch.value,
  (newVal) => {
    if (newVal) useCode.value = true;
    else useCode.value = false;
  }
);

onMounted(() => {
  getAllCounselType();
});

function getAllCounselType() {
  counselTypeApi
    .getCounselType()
    .then((response) => {
      const sortedData = sortWithChildren(response.data);
      counselTypes.value = transformTreeData(sortedData);
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function sortWithChildren(array) {
  return array
    .map((item) => {
      // children 이 있는 경우 재귀적으로 정렬
      if (item.children?.length) item.children = sortWithChildren(item.children);
      return item;
    })
    .sort((a, b) => a.orderNumber - b.orderNumber);
}

function transformTreeData(data) {
  const clonedData = JSON.parse(JSON.stringify(data));
  // 최상단에 "전체" 항목을 추가
  const root = [
    {
      entityId: "",
      name: "전체",
      code: "",
      path: null,
      orderNumber: 0,
      children: clonedData,
    },
  ];
  filterChildrenField(root); // 최상단 노드부터 시작
  return root;
}

function filterChildrenField(data) {
  return data.map((item) => {
    if (item.children && !item.children.length) {
      delete item.children;
    }
    if (item.children) item.children = filterChildrenField(item.children);
    item.name = item.name + " (" + (item.code === "" ? "All" : item.code) + ")";
    return item;
  });
}

function search() {
  const fieldValues = {};

  if (useName.value && nameSearch.value) fieldValues.name = nameSearch.value;
  if (useCode.value && codeSearch.value) fieldValues.code = codeSearch.value;

  searchValues.value = fieldValues;
}

function clearSearch() {
  nameSearch.value = null;
  codeSearch.value = null;
  searchValues.value = null;
}

function treeRowClicked(path) {
  if (path) {
    let pathArray = path.split(".");
    if (pathArray.length === 1) selectedCounselType.value = counselTypeStore.counselTypes.get(pathArray[0]);
    else if (pathArray.length === 2) selectedCounselType.value = counselTypeStore.counselTypes.get(pathArray[1]);
    else if (pathArray.length === 3) selectedCounselType.value = counselTypeStore.counselTypes.get(pathArray[2]);
  } else selectedCounselType.value = null;
}
</script>

<template>
  <div class="a-border q-pa-xs fit column" style="min-height: 680px">
    <div class="col-auto full-width q-mb-xs">
      <table class="full-width a-table">
        <colgroup>
          <col class="t-column" width="120px" />
          <col width="200px" />
          <col class="t-column" width="120px" />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <td>
              <div class="row">
                <a-checkbox v-model="useName" label="상담유형명" />
              </div>
            </td>
            <td>
              <div class="row">
                <a-input v-model="nameSearch" @keyup.enter="search" style="width: 100%" />
              </div>
            </td>
            <td>
              <div class="row">
                <a-checkbox v-model="useCode" label="코드" />
              </div>
            </td>
            <td>
              <div class="row justify-between">
                <div>
                  <a-input v-model="codeSearch" @keyup.enter="search" />
                </div>
                <div class="col-auto">
                  <a-btn label="조회" @click="search" />
                  <a-btn label="초기화" class="q-ml-xs" @click="clearSearch" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col column no-wrap full-width a-border q-pa-xs">
      <div class="row col">
        <div class="a-border full-height col-2 q-pa-xs">
          <TreeDataList :data="counselTypes" @row-click="treeRowClicked" ref="treeGrid" :filter="searchValues" />
        </div>
        <div class="q-ml-xs col full-height column no-wrap">
          <ATitleBar title="상담유형별 스크립트" class="col-auto full-width q-mb-xs" />
          <ScriptBoard :counsel-type="selectedCounselType" class="col" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.t-column {
  background-color: $grey-2;
}

.a-table,
.a-table tr,
.a-table td {
  border: 1px solid $grey-5;
  border-collapse: collapse;
}

.a-table td {
  padding: 1px map-get($space-xs, x);
  vertical-align: middle;
}

.a-table tr,
.a-table td {
  height: $line-height + 2;
}
</style>
