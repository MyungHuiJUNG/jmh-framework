<script setup>
import { ref, onMounted, computed } from "vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import ABtn from "components/common/ABtn.vue";
import taskRequestApi from "src/js/api/taskRequestApi";
import { useOrganizationStore } from "src/stores/organizationStore";
import { showAlert, showConfirm } from "src/js/common/dialog.js";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import ATitleBar from "../common/ATitleBar.vue";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";

const USE = FlowSystemCode.USE_CD.USE;
const permissionRoleStore = usePermissionRoleStore();

const hasPermission = computed(() =>
  permissionRoleStore.hasPermission(FlowRoleCode.REQUEST_MANAGEMENT.REQUEST_INIT_PWD_APPROVAL)
);

const organizationStore = useOrganizationStore();
const childRef = ref(null);
const selectedRows = ref([]);
const loading = ref(false);

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
    title: "조직(대)",
    field: "requestor.organization",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    formatter: function (cell) {
      const org = cell.getValue();
      if (org && org.path) {
        if (org.path.split(".")[0]) {
          const organizations = organizationStore.organizations;
          const orgName = organizations.get(org.path.split(".")[0] || "");
          return orgName.name;
        }
      }
      return "";
    },
  },
  {
    title: "조직(중)",
    field: "requestor.organization",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    formatter: function (cell) {
      const org = cell.getValue();
      if (org && org.path) {
        if (org.path.split(".")[1]) {
          const organizations = organizationStore.organizations;
          const orgName = organizations.get(org.path.split(".")[1] || "");
          return orgName.name;
        }
      }
      return "";
    },
  },
  {
    title: "조직(소)",
    field: "requestor.organization",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    formatter: function (cell) {
      const org = cell.getValue();
      if (org && org.path) {
        if (org.path.split(".")[2]) {
          const organizations = organizationStore.organizations;
          const orgName = organizations.get(org.path.split(".")[2] || "");
          return orgName.name;
        }
      }
      return "";
    },
  },
  {
    title: "사용자명",
    field: "requestor.name",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
  {
    title: "아이디",
    field: "requestor.id",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
  {
    title: "사용여부",
    field: "requestor.useTypeCode",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    formatter: function (cell) {
      const value = cell.getValue();
      const actualValue = value && value.value ? value.value : value;

      return actualValue === USE ? "사용" : "사용 안함";
    },
  },
  {
    title: "CTI ID",
    field: "requestor.ctiLoginId",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
  {
    title: "내선번호",
    field: "requestor.ctiExtension",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
];

const rows = ref([]);

function rowSelected(selected) {
  selectedRows.value = selected;
}

function getPasswordChangeUsers() {
  loading.value = true;
  const param = {
    "entity.requestType": "INIT_PASSWORD",
    "entity.stateType": "IN_PROGRESS",
  };

  taskRequestApi
    .getPasswordResetRequestor(param)
    .then((response) => {
      if (response.status === 200) {
        rows.value = response.data;
      }
    })
    .catch((error) => {
      handleApiError(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

function nowTime() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function putPasswordChangeUser() {
  const selectedRows = childRef.value.getSelectedData();

  if (selectedRows.length === 0) {
    showAlert("선택된 사용자가 없습니다.");
    return;
  }

  const userConfirmed = await showConfirm("초기화 하시겠습니까?");

  if (userConfirmed) {
    let successCount = 0;
    let failureCount = 0;

    for (const row of selectedRows) {
      const param = {
        "entity.requestType": "INIT_PASSWORD",
        "entity.stateType": "ACCEPT",
        "entity.requestor.entityId": row.requestor.entityId,
        "entity.responseDate": nowTime(),
      };

      try {
        await taskRequestApi.putPasswordReset(row.entityId, param);
        successCount++;
      } catch (error) {
        failureCount++;
      }
    }

    let resultMessage = `${successCount}명의 사용자의 비밀번호가 초기화되었습니다.`;
    if (failureCount > 0) {
      resultMessage += `\n${failureCount}명의 사용자에서 오류가 발생했습니다.`;
    }
    getPasswordChangeUsers();
    showAlert(resultMessage);
  }
}

async function deletePasswordChangeUser() {
  const selectedRows = childRef.value.getSelectedData();

  if (selectedRows.length === 0) {
    showAlert("선택된 사용자가 없습니다.");
    return;
  }

  const userConfirmed = await showConfirm("삭제 하시겠습니까?");

  if (userConfirmed) {
    let successCount = 0;
    let failureCount = 0;

    for (const row of selectedRows) {
      const param = {
        "entity.requestType": "INIT_PASSWORD",
        "entity.stateType": "REJECT",
        "entity.requestor.entityId": row.requestor.entityId,
        "entity.responseDate": nowTime(),
      };

      try {
        await taskRequestApi.putPasswordReset(row.entityId, param);
        successCount++;
      } catch (error) {
        failureCount++;
      }
    }

    let resultMessage = `${successCount}명의 사용자의 비밀번호 초기화를 거절하였습니다.`;
    if (failureCount > 0) {
      resultMessage += `\n${failureCount}명의 사용자에서 오류가 발생했습니다.`;
    }
    getPasswordChangeUsers();
    showAlert(resultMessage);
  }
}

onMounted(() => getPasswordChangeUsers());
</script>

<template>
  <div class="column fit no-wrap" style="height: 220px">
    <a-title-bar title="비밀번호 초기화 요청자" class="col-auto full-width q-mb-xs" />
    <tabulator-grid
      :rows="rows"
      :columns="columns"
      :selectableRows="true"
      @rowSelected="rowSelected"
      :selectableRowsRangeMode="'click'"
      class="col"
      ref="childRef"
    />
    <div class="text-right bg-grey-5 q-pa-xs col-auto full-width">
      <a-btn label="삭제" @click="deletePasswordChangeUser" v-if="hasPermission" />
      <a-btn label="비밀번호 초기화" @click="putPasswordChangeUser" class="q-ml-xs" v-if="hasPermission" />
      <a-btn label="목록 새로고침" @click="getPasswordChangeUsers" class="q-ml-xs" />
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
