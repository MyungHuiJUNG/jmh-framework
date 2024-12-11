<script setup>
import { ref, onMounted, watch, nextTick, computed } from "vue";
import AInput from "components/common/AInput.vue";
import ASelect from "components/common/ASelect.vue";
import ABtn from "components/common/ABtn.vue";
import ATitleBar from "../common/ATitleBar.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import permissionApi from "src/js/api/permissionApi";
import { usePermissionStore } from "src/stores/permissionStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import ACheckbox from "../common/ACheckbox.vue";
import { showAlert, showConfirm } from "src/js/common/dialog.js";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";

const permissionStore = usePermissionStore();
const permissionRoleStore = usePermissionRoleStore();

let title = "권한 그룹 목록"; // 타이틀바 제목
const permissionName = ref("");
const useStatus = ref(null);
const usePermissionName = ref(false);
const useStatusCheck = ref(false);

const canGetPermission = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.PERMISSION_ROLE.READ));
const canRemovePermission = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.PERMISSION_ROLE.DELETE));
const canSavePermission = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.PERMISSION_ROLE.SAVE));
const canAddPermission = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.PERMISSION_ROLE.ADD));

const useList = [
  { label: "전체", value: null },
  { label: "사용", value: true },
  { label: "사용 안함", value: false },
];
const childRef = ref("");

const columns = [
  //Define Table Columns
  {
    formatter: "rowSelection",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: 20,
  },
  {
    title: "#",
    field: "rownum",
    formatter: "rownum",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    resizable: false,
    width: 50,
  },
  {
    title: "권한명",
    field: "name",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: true,
    editor: "input",
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },
  {
    title: "사용여부",
    field: "usable",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    editor: "list",
    editorParams: {
      values: { true: "사용", false: "사용 안함" },
    },
    formatter: function (cell) {
      const value = cell.getValue();
      return value === true || value === "true" ? "사용" : "사용 안함";
    },
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData._isModified = true;

      let newValue = cell.getValue();

      if (newValue === "true" || newValue === "사용") {
        newValue = true;
      } else if (newValue === "false" || newValue === "사용 안함") {
        newValue = false;
      }

      if (typeof newValue === "boolean") {
        cell.getRow().update({ usable: newValue });
      } else {
        const oldValue = cell.getOldValue();
        cell.setValue(oldValue);
      }
    },
  },
];

async function postPermission() {
  const currentData = childRef.value.getData();
  const putParams = [];
  const postParams = [];
  let isValid = true;

  currentData.forEach((currentRow) => {
    if (!currentRow.name || currentRow.name.trim() === "") {
      showAlert("모든 행에서 이름은 필수 입력 사항입니다.");
      isValid = false;
      return;
    }

    if (currentRow._isModified) {
      if (currentRow.entityId) {
        const param = {
          entityId: currentRow.entityId,
          name: currentRow.name,
          usable: currentRow.usable,
        };
        putParams.push(param);
      } else {
        const param = {
          name: currentRow.name,
          usable: currentRow.usable,
        };
        postParams.push(param);
      }
    }
  });

  if (!isValid) {
    return;
  }

  const promises = [];

  if (putParams.length > 0) {
    const putPromise = permissionApi.putPermission({ entities: putParams }).catch((error) => {
      throw error;
    });
    promises.push(putPromise);
  }

  if (postParams.length > 0) {
    const postPromise = permissionApi.postPermission({ entities: postParams }).catch((error) => {
      throw error;
    });
    promises.push(postPromise);
  }

  if (promises.length > 0) {
    try {
      await Promise.all(promises);
      showAlert("저장되었습니다.");
      if (canGetPermission.value) {
        loadInitialData();
      } else {
        rows.value = [];
      }
    } catch (error) {
      handleApiError(error);
    }
  } else {
    showAlert("변경된 내용이 없습니다.");
  }
}

async function deletePermission() {
  const selectedRow = childRef.value.getSelectedData();

  if (!selectedRow || selectedRow.length === 0) {
    showAlert("선택된 권한이 없습니다.");
    return;
  }

  const userConfirmed = await showConfirm("삭제 하시겠습니까?");

  if (userConfirmed) {
    const selectedRowsData = childRef.value.getSelectedData();

    const idsToDelete = [];
    const rowsToRemove = [];

    for (const row of selectedRowsData) {
      if (row.entityId && row.name === "Super Admin") {
        showAlert("admin 권한은 삭제 할 수 없습니다.");
        continue;
      }

      if (row.entityId) {
        idsToDelete.push(row.entityId);
      } else {
        rowsToRemove.push(row);
      }
    }

    if (idsToDelete.length > 0) {
      permissionApi
        .deletePermission(idsToDelete)
        .then((response) => {
          if (response.status === 200) {
            if (canGetPermission.value) {
              loadInitialData();
            } else {
              rows.value = [];
            }
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }

    rowsToRemove.forEach((row) => {
      const index = rows.value.findIndex((r) => r === row);
      if (index > -1) {
        rows.value.splice(index, 1);
      }
    });

    selectedRows.value = [];
  }
}

function addEmptyRow() {
  // rows.value.push({ usable: true });

  rows.value.unshift({ usable: true });
  nextTick(() => {
    const firstRow = childRef.value.getRows()[0];
    if (firstRow) {
      const nameCell = firstRow.getCell("name");
      if (nameCell) {
        const cellElement = nameCell.getElement();
        cellElement.focus();
      }
    }
    childRef.value.scrollToRow(firstRow, "top");
  });
}

const selectedRows = ref([]);

function rowSelected(rows) {
  selectedRows.value = rows;

  const row = rows[0];
  if (row.entityId) {
    permissionApi
      .getMenusByPermission(row.entityId)
      .then((response) => {
        if (response.status === 200) {
          const menuIds = response.data.map((item) => item.entityId);
          permissionStore.setMenuIds(menuIds);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });

    permissionApi
      .getRolesByPermission(row.entityId)
      .then((response) => {
        if (response.status === 200) {
          const roleIds = response.data.map((item) => item.entityId);
          permissionStore.setRoleIds(roleIds);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });

    permissionStore.setEntityId(row.entityId);
  } else {
    permissionStore.clearIds();
  }
}

function rowDeSelected() {
  permissionStore.clearIds();
}

function saveSearchParams() {
  if (canGetPermission.value) {
    const param = {};

    if (usePermissionName.value && permissionName.value?.trim()) param["entity.name"] = permissionName.value.trim();
    if (useStatusCheck.value && useStatus.value !== null) param["usables"] = useStatus.value;

    console.log(param);
    searchPermissions(param);
  }
}

const rows = ref([]);

const page = ref(0);
const SIZE = 100;
const isLast = ref(false);
const loading = ref(false);

const searchParam = ref({
  page: page.value,
  size: SIZE,
});

async function infiniteScroll() {
  if (isLast.value) return;

  searchParam.value = {
    ...searchParam.value,
    page: page.value,
  };

  try {
    const response = await permissionApi.getPermissions(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function searchPermissions(param) {
  if (!canGetPermission.value) {
    showAlert("권한 조회 권한이 없습니다.");
    return;
  }
  page.value = 0;
  searchParam.value = {
    page: page.value,
    size: SIZE,
    ...param,
  };

  loading.value = true;

  return permissionApi
    .getPermissions(searchParam.value)
    .then((response) => {
      if (response && response.data) {
        rows.value = response.data.content;
        isLast.value = response.data.last;
        page.value += 1;
      }
    })
    .catch((error) => {
      handleApiError(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

function loadInitialData() {
  if (!canGetPermission.value) {
    showAlert("권한 조회 권한이 없습니다.");
    return;
  }
  page.value = 0;
  searchParam.value = {
    page: page.value,
    size: SIZE,
  };

  loading.value = true;

  permissionApi
    .getPermissions(searchParam.value)
    .then((response) => {
      if (response.status === 200) {
        rows.value = response.data.content;
        isLast.value = response.data.last;
        page.value += 1;
      }
    })
    .catch((error) => {
      handleApiError(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

function reset() {
  permissionName.value = "";
  useStatus.value = null;
  usePermissionName.value = false;
  useStatusCheck.value = false;
}

watch(permissionName, (newValue) => {
  if (newValue) usePermissionName.value = true;
  else usePermissionName.value = false;
});

watch(useStatus, (newValue) => {
  if (newValue !== null) {
    useStatusCheck.value = true;
  } else {
    useStatusCheck.value = false;
  }
});

onMounted(() => {
  loadInitialData();
});
</script>

<template>
  <div class="fit column">
    <a-title-bar :title="title" class="col-auto full-width q-mb-xs" />
    <div class="col-auto row fixed-height q-mb-xs">
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="usePermissionName" label="권한명" />
      </div>
      <div class="col-auto top-border-left justify-center column q-px-xs" style="width: 150px">
        <a-input class="custom-input" v-model="permissionName" @keyup.enter="saveSearchParams"></a-input>
      </div>

      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useStatusCheck" label="사용여부" />
      </div>

      <div class="col-auto top-border-left justify-center column q-px-xs">
        <a-select class="fixed-width" v-model="useStatus" :options="useList"></a-select>
      </div>

      <div class="col top-border-right justify-end items-center row q-px-xs">
        <div class="text-right">
          <a-btn label="조회" @click="saveSearchParams"></a-btn
          ><a-btn label="초기화" @click="reset" class="q-ml-xs"></a-btn>
        </div>
      </div>
    </div>

    <tabulator-grid
      :rows="rows"
      :columns="columns"
      @rowSelected="rowSelected"
      @row-deselected="rowDeSelected"
      class="full-width col"
      :infiniteScroll="infiniteScroll"
      :selectableRows="1"
      ref="childRef"
    />

    <div class="row full-width justify-end q-pa-xs q-gutter-xs bg-grey-5 a-border col-auto">
      <a-btn v-if="canAddPermission" label="추가" @click="addEmptyRow"></a-btn>
      <a-btn v-if="canRemovePermission" label="삭제" @click="deletePermission"></a-btn>
      <a-btn v-if="canAddPermission || canSavePermission" label="저장" @click="postPermission"></a-btn>
    </div>

    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped>
.fixed-height {
  height: $line-height + 2;
}
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

.fixed-width {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
