<script setup>
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import ACheckbox from "components/common/ACheckbox.vue";
import TreeDepth from "components/treedata/TreeDepth.vue";
import TreeDataList from "components/treedata/TreeDataList.vue";
import counselTypeApi from "src/js/api/counselTypeApi";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import { ref, onMounted, watch, computed } from "vue";
import FlowRoleCode from "src/js/common/FlowRoleCode";

const counselTypeStore = useCounselTypeStore();
const permissionRoleStore = usePermissionRoleStore();

const canGetCounselType = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.COUNSEL_TYPE_ROLE.READ)); // 권한 확인

const useName = ref(false);
const useCode = ref(false);
const nameSearch = ref(null);
const codeSearch = ref(null);

const counselTypes = ref([]);
const formattedTreeData = ref([]);

const depth1 = ref([]);
const depth2 = ref([]);
const depth3 = ref([]);

const selectedPath = ref(null); // treeDataList에서 선택한 항목의 path

// 선택된 entityId - 등록시 parentId, delete시 entityId로 사용
// code는 등록, 수정, 삭제시 부모 항목을 선택하기 위한 id값을 받아와서 선택함수를 실행하기 위해 사용
const selectedFirstDepthEntity = ref({
  entityId: null,
  code: null,
});
const selectedSecondDepthEntity = ref({
  entityId: null,
  code: null,
});
const selectedThirdDepthEntity = ref({
  entityId: null,
  code: null,
});

// grid ref
const treeGrid = ref(null);
const firstDepthGrid = ref(null);
const secondDepthGrid = ref(null);
const thirdDepthGrid = ref(null);

// 선택을 하기 위한 id field. code값과 같다
const selectedFirstDepthId = ref(null);
const selectedSecondDepthId = ref(null);
const selectedThirdDepthId = ref(null);

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
  getAllCounselType(); // 전체 리스트 호출
});

const searchValues = ref();

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

function resetDepthDatas() {
  depth1.value = [];
  depth2.value = [];
  depth3.value = [];
}

function treeRowClicked(path) {
  if (!path) {
    getAllCounselType();
    return;
  }
  selectedPath.value = path;

  const pathArray = selectedPath.value.split(".");

  if (pathArray.length) selectedFirstDepthId.value = pathArray[0];
  else selectedFirstDepthId.value = null;
  if (pathArray.length > 1) selectedSecondDepthId.value = pathArray[1];
  else selectedSecondDepthId.value = null;
  if (pathArray.length > 2) selectedThirdDepthId.value = pathArray[2];
  else selectedThirdDepthId.value = null;

  if (pathArray.length) firstDepthGrid.value.selectRow(selectedFirstDepthId.value); // 1depth 선택
}

function clearSelectedId() {
  selectedFirstDepthId.value = null;
  selectedSecondDepthId.value = null;
  selectedThirdDepthId.value = null;
}

////// Data Formatting /////
function filterChildrenField(data) {
  return data.map((item) => {
    if (item.children && !item.children.length) {
      delete item.children;
    }
    if (item.children) item.children = filterChildrenField(item.children);
    return item;
  });
}

function addIdField(data) {
  return data.map((item) => {
    const newItem = {
      ...item,
      id: item.code,
    };

    if (newItem.children?.length) newItem.children = addIdField(newItem.children);

    return newItem;
  });
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
  return addIdField(root);
}

function sortWithChildren(array) {
  return array
    .map((item) => {
      // children이 있는 경우 재귀적으로 정렬
      if (item.children?.length) item.children = sortWithChildren(item.children);
      return item;
    })
    .sort((a, b) => a.orderNumber - b.orderNumber);
}

////////// CRUD API //////////
function getAllCounselType() {
  if (canGetCounselType.value) {
    counselTypeApi
      .getCounselType()
      .then((response) => {
        const sortedData = sortWithChildren(response.data);
        formattedTreeData.value = transformTreeData(sortedData);
        counselTypes.value = addIdField(sortedData);
        resetDepthDatas();
        depth1.value = counselTypes.value;
      })
      .catch((error) => {
        handleApiError(error);
      });
  } else {
    showAlert("상담유형 조회 권한이 없습니다.");
  }
}

function getCounselTypeByEntityId(entityId) {
  return counselTypeApi
    .getCounselType(entityId)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function handleWhenIsDepth2() {
  counselTypeApi
    .getCounselType()
    .then((response) => {
      if (response.status === 200) {
        const sortedData = sortWithChildren(response.data);
        formattedTreeData.value = transformTreeData(sortedData);
        counselTypes.value = addIdField(sortedData);
        resetDepthDatas();
        depth1.value = counselTypes.value;
        // depth1 선택 추가
        if (selectedFirstDepthEntity.value.code) firstDepthGrid.value.selectRow(selectedFirstDepthEntity.value.code);
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function handleWhenIsDepth3() {
  counselTypeApi
    .getCounselType()
    .then((response) => {
      if (response.status === 200) {
        const sortedData = sortWithChildren(response.data);
        formattedTreeData.value = transformTreeData(sortedData);
        counselTypes.value = addIdField(sortedData);
        resetDepthDatas();
        depth1.value = counselTypes.value;
        if (selectedFirstDepthEntity.value.code) firstDepthGrid.value.selectRow(selectedFirstDepthEntity.value.code);
        // depth2 선택 추가
        selectedSecondDepthId.value = selectedSecondDepthEntity.value.code;
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

async function deleteCounselType({ depth, entityId }) {
  if (!entityId) {
    showAlert("삭제할 항목을 선택해주세요");
    return;
  }
  const confirmed = await showConfirm("삭제하시겠습니까?");

  if (confirmed) {
    counselTypeStore
      .remove(entityId)
      .then((response) => {
        if (response.status === 200) {
          if (canGetCounselType.value && depth === 1) {
            getAllCounselType();
          } else if (canGetCounselType.value && depth === 2) {
            handleWhenIsDepth2();
          } else if (canGetCounselType.value && depth === 3) {
            handleWhenIsDepth3();
          } else {
            depth1.value = [];
          }
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}

function handleDeleteDepth1(entityId) {
  deleteCounselType({ depth: 1, entityId });
}

function handleDeleteDepth2(entityId) {
  deleteCounselType({ depth: 2, entityId });
}

function handleDeleteDepth3(entityId) {
  deleteCounselType({ depth: 3, entityId });
}

function handleDepth1Selected(row) {
  depth2.value = [];
  depth3.value = [];
  if (!row.entityId) return;

  getCounselTypeByEntityId(row.entityId)
    .then((data) => {
      depth2.value = sortWithChildren(addIdField(data.children));
      if (selectedSecondDepthId.value) secondDepthGrid.value.selectRow(selectedSecondDepthId.value);
      selectedSecondDepthId.value = null; // 선택 후 id값 비우기
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function handleDepth2Selected(row) {
  depth3.value = [];
  if (!row.entityId) return;

  getCounselTypeByEntityId(row.entityId)
    .then((data) => {
      depth3.value = sortWithChildren(addIdField(data.children));
      if (selectedThirdDepthId.value) thirdDepthGrid.value.selectRow(selectedThirdDepthId.value);
      selectedThirdDepthId.value = null; // 선택 후 id값 비우기
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function handleSaveDepth1({ newRows, modifiedRows }) {
  handleSaveDepth({ depth: 1, newRows, modifiedRows });
}

function handleSaveDepth2({ newRows, modifiedRows }) {
  handleSaveDepth({ depth: 2, newRows, modifiedRows });
}

function handleSaveDepth3({ newRows, modifiedRows }) {
  handleSaveDepth({ depth: 3, newRows, modifiedRows });
}

function handleSaveDepth({ depth, newRows, modifiedRows }) {
  // 데이터가 없으면 함수 종료
  if (!newRows?.length && !modifiedRows?.length) return;

  const hasEmptyFields = (rows) =>
    rows.some(
      (item) => !item.code || item.code.toString().trim() === "" || !item.name || item.name.toString().trim() === ""
    );

  // 신규 또는 수정 데이터에서 빈 항목이 있는지 확인
  if ((newRows?.length && hasEmptyFields(newRows)) || (modifiedRows?.length && hasEmptyFields(modifiedRows))) {
    showAlert("빈 항목이 있습니다.");
    return;
  }
  const isInvalidCode = (rows) =>
    rows.some(
      (item) => item.code.includes(".") // 코드에 '.'이 포함되었는지 확인
    );

  if ((newRows?.length && isInvalidCode(newRows)) || (modifiedRows?.length && isInvalidCode(modifiedRows))) {
    showAlert("코드명에 .을 포함할 수 없습니다.");
    return;
  }

  // depth에 따른 상위 유형 선택 확인 및 부모 ID 설정
  let selectedParentEntityId = null;
  let currentDepthValue = null;

  if (depth === 2) {
    if (!selectedFirstDepthEntity.value?.entityId) {
      showAlert("상위유형을 선택해주세요.");
      return;
    }
    selectedParentEntityId = selectedFirstDepthEntity.value.entityId;
    currentDepthValue = depth2.value;
  } else if (depth === 3) {
    if (!selectedSecondDepthEntity.value?.entityId) {
      showAlert("상위유형을 선택해주세요.");
      return;
    }
    selectedParentEntityId = selectedSecondDepthEntity.value.entityId;
    currentDepthValue = depth3.value;
  } else {
    currentDepthValue = depth1.value;
  }

  // 신규 데이터에 부모 ID와 정렬 순서를 추가
  const preparedNewRows = newRows.map((item, index) => {
    const baseObject = {
      code: item.code,
      name: item.name,
      orderNumber: item.orderNumber ?? currentDepthValue.length + 1 + index, // orderNumber가 있으면 사용, 없으면 계산
    };

    if (depth > 1) baseObject.parent = { entityId: selectedParentEntityId };

    return baseObject;
  });

  // 수정 데이터는 그대로 사용하되, depth에 따른 parent 설정 추가
  const preparedModifiedRows = modifiedRows.map((item) => {
    const baseObject = {
      entityId: item.entityId,
      code: item.code,
      name: item.name,
      orderNumber: item.orderNumber,
    };

    if (depth > 1) {
      baseObject.parent = { entityId: item.parentEntityId };
    }

    return baseObject;
  });

  // 다중등록 API 요청이 있는 경우 처리
  if (preparedNewRows.length) {
    counselTypeStore
      .save(preparedNewRows)
      .then((saveResponse) => {
        // 등록 성공 후 다중수정 API 요청 처리 (수정할 내용이 있는 경우에만)
        if (saveResponse.status === 200 && preparedModifiedRows.length) {
          return counselTypeStore.update(preparedModifiedRows);
        }
        // 수정할 내용이 없으면 바로 null 반환
        return null;
      })
      .then((updateResponse) => {
        // 수정이 없거나 성공한 경우 처리
        const updateSuccess = updateResponse === null || (updateResponse && updateResponse.status === 200);

        // 성공 처리
        if (updateSuccess) {
          if (canGetCounselType.value && depth === 1) {
            getAllCounselType();
          } else if (canGetCounselType.value && depth === 2) {
            handleWhenIsDepth2();
          } else if (canGetCounselType.value && depth === 3) {
            handleWhenIsDepth3();
          } else {
            depth1.value = [];
          }
          showAlert("저장이 완료되었습니다");
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  } else if (preparedModifiedRows.length) {
    // 등록할 내용이 없을 때 수정만 처리
    counselTypeStore
      .update(preparedModifiedRows)
      .then((updateResponse) => {
        if (updateResponse.status === 200) {
          if (canGetCounselType.value && depth === 1) {
            getAllCounselType();
          } else if (canGetCounselType.value && depth === 2) {
            handleWhenIsDepth2();
          } else if (canGetCounselType.value && depth === 3) {
            handleWhenIsDepth3();
          } else {
            depth1.value = [];
          }
          showAlert("저장이 완료되었습니다");
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}
</script>

<template>
  <div class="a-border q-pa-xs fit column" style="min-height: 680px">
    <div class="col-auto">
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
              <div class="row full-width">
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
    <div class="row col q-mt-xs">
      <div class="a-border full-height col-2 q-pa-xs">
        <TreeDataList :data="formattedTreeData" @row-click="treeRowClicked" ref="treeGrid" :filter="searchValues" />
      </div>
      <div class="a-border full-height col q-ml-xs q-pa-xs">
        <TreeDepth
          ref="firstDepthGrid"
          :data="depth1"
          title="상담유형(1depth)"
          type-name="상담유형명"
          :is-top="true"
          @delete-row="handleDeleteDepth1"
          @save-rows="handleSaveDepth1"
          @row-selected="handleDepth1Selected"
          @row-click="clearSelectedId"
          v-model="selectedFirstDepthEntity"
          viewType="counselType"
        />
      </div>
      <div class="a-border full-height col q-ml-xs q-pa-xs">
        <TreeDepth
          ref="secondDepthGrid"
          :data="depth2"
          title="상담유형(2depth)"
          type-name="상담유형명"
          :parent-entity="selectedFirstDepthEntity"
          @row-selected="handleDepth2Selected"
          @delete-row="handleDeleteDepth2"
          @save-rows="handleSaveDepth2"
          @row-click="clearSelectedId"
          v-model="selectedSecondDepthEntity"
          viewType="counselType"
        />
      </div>
      <div class="a-border full-height col q-ml-xs q-pa-xs">
        <TreeDepth
          ref="thirdDepthGrid"
          :data="depth3"
          title="상담유형(3depth)"
          type-name="상담유형명"
          :parent-entity="selectedSecondDepthEntity"
          @delete-row="handleDeleteDepth3"
          @save-rows="handleSaveDepth3"
          @row-click="clearSelectedId"
          v-model="selectedThirdDepthEntity"
          viewType="counselType"
        />
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
