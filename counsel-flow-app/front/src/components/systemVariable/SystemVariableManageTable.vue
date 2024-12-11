<script setup>
import { ref, onMounted, computed } from "vue";
import ABtn from "components/common/ABtn.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import systemVariableApi from "src/js/api/systemVariableApi";
import { useSystemVariableStore } from "src/stores/systemVariableStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import ATitleBar from "../common/ATitleBar.vue";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";

const systemVariableStore = useSystemVariableStore();
const permissionRoleStore = usePermissionRoleStore();

const canGetVariable = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.VARIABLE_ROLE.READ));
const canSaveVariable = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.VARIABLE_ROLE.SAVE));

const gridRef = ref(null);

const rows = ref([]);

const loading = ref(false);

const columns = [
  {
    title: "시스템변수명",
    field: "displayName",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: false,
  },
  {
    title: "값",
    field: "value",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: false,
    editor: "adaptable",
    editorParams: {
      editorLookup: function (cell) {
        const rowData = cell.getRow().getData();
        return rowData.editType === "select" ? "list" : "input";
      },
      paramsLookup: function (lookup, cell) {
        const rowData = cell.getRow().getData();
        const editItem = rowData.editItem;
        const editItemArray = editItem ? editItem.split(",").map((item) => item.trim()) : [];
        if (lookup === "list") {
          return {
            values: editItemArray,
          };
        }
      },
    },
    editable: function (cell) {
      return cell.getRow().getData().value !== null;
    },
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },
  {
    title: "설명",
    field: "description",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: false,
  },
];

async function getSystemVariable() {
  if (!canGetVariable.value) {
    showAlert("시스템변수 조회 권한이 없습니다.");
    return;
  }

  loading.value = true;
  try {
    const response = await systemVariableApi.getSystemVariable();
    if (response.status === 200) {
      function cleanEmptyChildren(data) {
        if (Array.isArray(data)) {
          return data.map((item) => {
            if (item.children && item.children.length === 0) {
              delete item.children;
            } else if (item.children) {
              item.children = cleanEmptyChildren(item.children);
            }
            return item;
          });
        }
        return data;
      }
      rows.value = cleanEmptyChildren(response.data);
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
}

function putSystemVariables() {
  const allRows = gridRef.value.getData();
  const modifiedRows = [];
  let hasInvalidValue = false;

  function collectModifiedRows(dataArray) {
    dataArray.forEach((item) => {
      if (item._isModified) {
        if (item.value === null || item.value.trim() === "") {
          showAlert(`'${item.displayName}'의 값이 공백입니다. 값을 입력해 주세요.`);
          hasInvalidValue = true;
        } else if (item.value.trim().length > 1024) {
          showAlert("값은 1024자를 초과할 수 없습니다.");
          hasInvalidValue = true;
        } else {
          modifiedRows.push(item);
        }
      }

      if (item.children && item.children.length > 0) {
        collectModifiedRows(item.children);
      }
    });
  }

  collectModifiedRows(allRows);

  if (hasInvalidValue) {
    return;
  }

  if (modifiedRows.length === 0) {
    showAlert("수정된 메뉴가 없습니다.");
    return;
  }

  const updatePromises = modifiedRows.map((rowData) => {
    const entityId = rowData.entityId;
    if (!entityId) {
      return Promise.resolve();
    }

    const param = {
      entity: {
        value: rowData.value,
        description: rowData.description,
      },
    };

    return systemVariableApi
      .putSystemVariable(entityId, param)
      .then(() => {
        rowData._isModified = false;
      })
      .catch((error) => {
        showAlert(`시스템변수 '${rowData.displayName}' 업데이트 중 오류가 발생했습니다.`);
        throw error;
      });
  });

  Promise.all(updatePromises)
    .then(() => {
      showAlert("시스템변수가 성공적으로 저장되었습니다.");
      getSystemVariable();
      systemVariableStore.load();
    })
    .catch((error) => {
      handleApiError(error);
    });
}

onMounted(() => getSystemVariable());
</script>

<template>
  <div class="fit column">
    <a-title-bar title="시스템 변수 목록" class="col-auto full-width q-mb-xs" />
    <tabulator-grid
      ref="gridRef"
      :rows="rows"
      :columns="columns"
      :reactiveData="false"
      class="col full-width"
      :dataTree="true"
      :dataTreeStartExpanded="true"
      :selectableRows="1"
    />

    <div class="row full-width justify-end q-pa-xs q-gutter-xs bg-grey-5 a-border">
      <a-btn v-if="canSaveVariable" label="저장" @click="putSystemVariables"></a-btn>
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped>
.t-column {
  background-color: $grey-2;
}

.select-width {
  flex: 1 1 100px;
}

.a-table,
.a-table tr,
.a-table td {
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
