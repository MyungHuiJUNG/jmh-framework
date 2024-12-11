<script setup>
import NotificationSearchBar from "src/components/notification/NotificationSearchBar.vue";
import TabulatorGrid from "src/components/common/TabulatorGrid.vue";
import ABtn from "src/components/common/ABtn.vue";
import { useCodeStore } from "src/stores/codeStore";
import { ref, onMounted, computed } from "vue";
import notificationApi from "src/js/api/notificationApi";
import { handleApiError } from "src/js/common/errorHandler";
import { showConfirm } from "src/js/common/dialog";
import { useAuthStore } from "src/stores/authStore";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import ATitleBar from "src/components/common/ATitleBar.vue";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import { showAlert } from "src/js/common/dialog";
import ALoadingSpinner from "src/components/common/ALoadingSpinner.vue";

const loading = ref(false);

const permissionRoleStore = usePermissionRoleStore();

const grid = ref(null);
const useBtnPagination = ref(false);
const ajaxUrl = "/rest/api/v1/notification/notifications";

const canGetNotifications = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.NOTIFICATION_ROLE.READ));
const canDeleteNotification = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.NOTIFICATION_ROLE.DELETE));

const authStore = useAuthStore();
const codeStore = useCodeStore();
const rows = ref([]);
const columns = [
  {
    formatter: "rowSelection",
    titleFormatter: "rowSelection",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: 20,
    resizable: false,
  },
  {
    title: "No.",
    formatter: "rownum",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: 20,
  },
  {
    title: "구분",
    field: "typeCode",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return codeStore.codes.get(code)?.name ?? code;
    },
  },
  {
    title: "메시지",
    field: "message",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      if (data.typeCode === FlowSystemCode.NOTIFICATION_TYPE.MESSAGE) return data.title;
      else return data.message;
    },
  },
  { title: "등록일시", field: "createdDate", headerHozAlign: "center", hozAlign: "center" },
  {
    title: "조회여부",
    field: "isRead",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const isRead = cell.getValue() || null;
      return isRead ? "읽음" : "안읽음";
    },
  },
  {
    title: "작성자",
    field: "sender.name",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      if (data.sender?.name && data.sender?.id) return `${data.sender.name} [${data.sender.id}]`;
      else return null;
    },
  },
];
const selectedRows = ref([]);
const defaultFromDate = ref(formatDate(getLastMonth(new Date()))); // 초기값 한달 전 00:00:00
const defaultToDate = ref(formatDate(setToDate(new Date()))); // 초기값 내일 00:00:00
const searchParam = ref();
const page = ref(0);
const size = ref(100);
const isLast = ref(false);

onMounted(() => {
  loadInitialData();
});

function getLastMonth(date) {
  const lastMonth = new Date(date);
  lastMonth.setMonth(date.getMonth() - 1);
  return lastMonth;
}

function setToDate(date) {
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  return tomorrow;
}

function formatDate(date) {
  // 해당 날짜의 00:00:00으로 설정
  date.setHours(0, 0, 0, 0);

  // 날짜를 "yyyy-mm-dd 00:00:00" 포맷으로 반환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = "00";
  const minutes = "00";
  const seconds = "00";
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function rowSelected(row) {
  selectedRows.value = [];
  selectedRows.value = row;
}

function search(params) {
  if (!canGetNotifications.value) {
    showAlert("알림 조회 권한이 없습니다.");
    return;
  }
  if (useBtnPagination.value) {
    searchParam.value = {
      "entity.receiver.entityId": authStore.entityId,
      ...params,
    };
    setData();
  } else {
    loading.value = true;
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      "entity.receiver.entityId": authStore.entityId,
      ...params,
    };
    notificationApi
      .getNotifications(searchParam.value)
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
}

function loadInitialData() {
  if (!canGetNotifications.value) {
    showAlert("알림 조회 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    searchParam.value = {
      fromCreatedDate: defaultFromDate.value,
      toCreatedDate: defaultToDate.value,
      "entity.receiver.entityId": authStore.entityId,
      typeCodes: codeStore.codes
        .get(FlowSystemCode.CODES.NOTIFICATION_TYPE)
        .children.filter((child) => child.code !== FlowSystemCode.NOTIFICATION_TYPE.MESSAGE)
        .map((child) => child.code)
        .join(","), // 메시지만 제외하고 조회
    };
  } else {
    loading.value = true;

    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      fromCreatedDate: defaultFromDate.value,
      toCreatedDate: defaultToDate.value,
      "entity.receiver.entityId": authStore.entityId,
      typeCodes: codeStore.codes
        .get(FlowSystemCode.CODES.NOTIFICATION_TYPE)
        .children.filter((child) => child.code !== FlowSystemCode.NOTIFICATION_TYPE.MESSAGE)
        .map((child) => child.code)
        .join(","), // 메시지만 제외하고 조회
    };
    notificationApi
      .getNotifications(searchParam.value)
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
}

async function infiniteScroll() {
  if (useBtnPagination.value) return;
  if (isLast.value) return;

  searchParam.value = {
    ...searchParam.value,
    page: page.value,
  };

  try {
    const response = await notificationApi.getNotifications(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function deleteNotifications() {
  if (!selectedRows.value.length) {
    showAlert("삭제할 알림을 선택해주세요.");
    return;
  }
  showConfirm("알림을 삭제하시겠습니까?").then((res) => {
    if (res) {
      let entityIds = "";
      for (const [i, row] of selectedRows.value.entries()) {
        entityIds += row.entityId;
        if (i < selectedRows.value.length - 1) {
          entityIds += ",";
        }
      }
      notificationApi
        .deleteNotifications(entityIds)
        .then((response) => {
          if (response.status === 200) {
            selectedRows.value = [];
            loadInitialData();
            if (useBtnPagination.value) setData();
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  });
}
function setData() {
  grid.value.setData();
}
function ajaxRequestFunction(url, config, params) {
  searchParam.value = {
    ...searchParam.value,
    page: params.page - 1, // Tabulator는 1-based, API는 0-based
    size: params.size || size.value,
    isPaging: true, // totalPages 받는 parameter
  };

  return new Promise(function (resolve, reject) {
    notificationApi
      .getNotifications(searchParam.value)
      .then((response) => {
        if (response.status === 200) {
          const result = {
            data: response.data.content,
            last_page: response.data.totalPages,
            last_row: response.data.totalElements,
          };
          resolve(result);
        }
      })
      .catch((error) => {
        handleApiError(error);
        reject(error);
      });
  });
}
</script>

<template>
  <div class="column no-wrap fit a-border q-pa-xs" style="min-height: 680px">
    <div class="col-auto q-mb-xs">
      <NotificationSearchBar @search="search" />
    </div>
    <div class="col column no-wrap a-border q-pa-xs">
      <a-title-bar title="알림 목록" class="col-auto full-width q-mb-xs" />
      <TabulatorGrid
        :rows="rows"
        :columns="columns"
        :infiniteScroll="infiniteScroll"
        :selectableRows="true"
        selectableRowsRangeMode="click"
        @rowSelected="rowSelected"
        @rowDeselected="rowSelected"
        :ajax-url="ajaxUrl"
        :ajax-request-func="ajaxRequestFunction"
        :pagination="useBtnPagination"
        :pagination-size="size"
        class="col full-width"
        ref="grid"
      />

      <div class="full-width text-right bg-grey-5 a-border q-pa-xs col-auto" v-if="canDeleteNotification">
        <a-btn label="삭제" @click="deleteNotifications" />
      </div>
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
