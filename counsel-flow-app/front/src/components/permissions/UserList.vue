<script setup>
import { ref, computed, watch } from "vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import ATitleBar from "../common/ATitleBar.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import permissionApi from "src/js/api/permissionApi";
import { usePermissionStore } from "src/stores/permissionStore";
import { useQuasar } from "quasar";
import UserPopup from "../common/UserPopup.vue";
import ACheckbox from "components/common/ACheckbox.vue";
import { showAlert, showConfirm } from "src/js/common/dialog.js";
import { handleApiError } from "src/js/common/errorHandler";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import FlowRoleCode from "src/js/common/FlowRoleCode";

const $q = useQuasar();
const permissionRoleStore = usePermissionRoleStore();

const canRemovePermission = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.PERMISSION_ROLE.DELETE));
const canSavePermission = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.PERMISSION_ROLE.SAVE));
const canAddPermission = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.PERMISSION_ROLE.ADD));

function openUserPopup() {
  if (permissionStore.entityId == null) {
    showAlert("선택된 권한이 없습니다.");
    return;
  }

  return new Promise((resolve) => {
    $q.dialog({
      component: UserPopup,
      componentProps: {
        selectableRows: true,
        selectableRowsRangeMode: "click",
      },
    })
      .onOk((payload) => {
        payload.payload.forEach((selectedUser) => {
          const isDuplicate = rows.value.some((row) => row.entityId === selectedUser.entityId);

          if (!isDuplicate) {
            rows.value.push({
              entityId: selectedUser.entityId,
              name: selectedUser.name,
              id: selectedUser.id,
            });
          }
        });
      })
      .onCancel(() => {
        resolve(null);
      });
  });
}

const permissionStore = usePermissionStore();
let title = "사용자 목록";

const childRef = ref(null);

const userName = ref("");
const useName = ref(false); // 사용자명 체크박스

const columns = [
  {
    formatter: "rowSelection",
    titleFormatter: "rowSelection",
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
    title: "사용자명",
    field: "name",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
  {
    title: "아이디",
    field: "id",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
];

const rows = ref([]);

function postUsersByPermissions() {
  const allRows = childRef.value.getData();

  if (allRows.length > 0) {
    const param = {
      entities: [],
    };

    allRows.forEach((row) => {
      param.entities.push({
        entityId: row.entityId,
      });
    });

    permissionApi
      .postUsersByPermission(param, permissionStore.entityId)
      .then((response) => {
        if (response.status === 200) {
          showAlert("저장 되었습니다.");
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}

function getUsersByPermissions() {
  if (permissionStore.entityId) {
    permissionApi
      .getUsersByPermission(permissionStore.entityId)
      .then((response) => {
        if (response.status === 200) {
          rows.value = response.data;
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  } else {
    rows.value = [];
  }
}

const selectedRows = ref([]);

async function deleteRows() {
  if (permissionStore.entityId == null) {
    showAlert("선택된 권한이 없습니다.");
    return;
  }

  const selectedRows = childRef.value.getSelectedData();

  if (selectedRows.length === 0) {
    showAlert("선택된 사용자가 없습니다.");
    return;
  }

  const userConfirmed = await showConfirm("삭제 하시겠습니까?");

  if (userConfirmed) {
    const entityIds = selectedRows.map((row) => row.entityId).join(",");

    permissionApi
      .deleteUsersByPermission(permissionStore.entityId, entityIds)
      .then((response) => {
        if (response.status === 200) {
          getUsersByPermissions();
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}

function rowSelected(selected) {
  selectedRows.value = selected;
}

const filters = ref([]);
function search() {
  const newFilters = [];

  if (useName.value && userName.value?.trim()) {
    newFilters.push({ field: "name", type: "like", value: userName.value.trim() });
  }

  filters.value = newFilters.length > 0 ? newFilters : [];
}

function reset() {
  userName.value = "";
  useName.value = false;
}

watch(userName, (newValue) => {
  if (newValue) useName.value = true;
  else useName.value = false;
});

watch(
  () => permissionStore.entityId,
  () => {
    getUsersByPermissions();
  }
);
</script>

<template>
  <div class="fit column">
    <a-title-bar :title="title" class="col-auto full-width q-mb-xs" />
    <div class="col-auto row fixed-height q-mb-xs">
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
        <a-checkbox v-model="useName" label="사용자명" />
      </div>
      <div class="col top-border-left justify-center column q-px-xs">
        <a-input v-model="userName" @keyup.enter="search" style="max-width: 150px"></a-input>
      </div>
      <div class="col-auto top-border-right justify-center column q-px-xs">
        <div class="row">
          <div class="col-auto q-ml-xs text-right">
            <a-btn label="조회" @click="search"></a-btn><a-btn label="초기화" @click="reset" class="q-ml-xs"></a-btn>
          </div>
        </div>
      </div>
    </div>

    <tabulator-grid
      class="full-width col"
      :rows="rows"
      :columns="columns"
      :filters="filters"
      @rowSelected="rowSelected"
      :selectableRows="true"
      selectableRowsRangeMode="click"
      ref="childRef"
    />

    <div class="row full-width justify-end q-pa-xs q-gutter-xs bg-grey-5 a-border col-auto">
      <a-btn label="추가" @click="openUserPopup" v-if="canAddPermission"></a-btn>
      <a-btn label="삭제" @click="deleteRows" v-if="canRemovePermission"></a-btn>
      <a-btn label="저장" @click="postUsersByPermissions" v-if="canAddPermission || canSavePermission"></a-btn>
    </div>
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
