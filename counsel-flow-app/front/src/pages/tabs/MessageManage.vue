<script setup>
import TabulatorGrid from "src/components/common/TabulatorGrid.vue";
import notificationApi from "src/js/api/notificationApi";
import { ref, onMounted, computed } from "vue";
import { handleApiError } from "src/js/common/errorHandler";
import { showAlert, showConfirm } from "src/js/common/dialog";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import ATitleBar from "src/components/common/ATitleBar.vue";
import ABtn from "src/components/common/ABtn.vue";
import { useAuthStore } from "src/stores/authStore";
import NotificationMessageSearchBar from "src/components/notification/NotificationMessageSearchBar.vue";
import { useQuasar } from "quasar";
import NotificationMessagePopup from "src/components/notification/NotificationMessagePopup.vue";
import { useCodeStore } from "src/stores/codeStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ALoadingSpinner from "src/components/common/ALoadingSpinner.vue";

const loading = ref(false);

const $q = useQuasar();
const permissionRoleStore = usePermissionRoleStore();

const grid = ref(null);
const useBtnPagination = ref(false);
const ajaxUrl = "/rest/api/v1/message/messages";

const canGetMessages = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.MESSAGE_ROLE.READ));
const canDeleteMessage = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.MESSAGE_ROLE.DELETE));

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
    title: "수신일자",
    field: "createdDate",
    headerHozAlign: "center",
    hozAlign: "center",
  },
  {
    title: "유형",
    field: "type",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return codeStore.codes.get(code)?.name ?? name;
    },
  },
  {
    title: "제목",
    field: "notification.title",
    headerHozAlign: "center",
    hozAlign: "center",
  },
  {
    title: "내용",
    field: "notification.message",
    headerHozAlign: "center",
    hozAlign: "center",
  },
  {
    title: "보낸사람",
    field: "notification.sender.entityId",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      return `${data.notification.sender.name} [${data.notification.sender.id}]`;
    },
  },
  {
    title: "받는사람",
    field: "notification.receiver.entityId",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      return `${data.notification.receiver.name} [${data.notification.receiver.id}]`;
    },
  },
  {
    title: "확인여부",
    field: "notification.isRead",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      const isRead = data.notification.isRead;
      if (isRead === true) return "읽음";
      else if (isRead === false) return "안읽음";
      else return null;
    },
  },
  {
    title: "확인일시",
    field: "notification.readDate",
    headerHozAlign: "center",
    hozAlign: "center",
  },
];
const selectedRows = ref([]);
const page = ref(0);
const size = ref(100);
const isLast = ref(false);
const searchParam = ref();
const defaultFromDate = ref(formatDate(getLastMonth(new Date()))); // 초기값 한달 전 00:00:00
const defaultToDate = ref(formatDate(setToDate(new Date()))); // 초기값 내일 00:00:00

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

function loadInitialData() {
  if (!canGetMessages.value) {
    showAlert("쪽지 조회 권한이 없습니다.");
    return;
  }
  if (useBtnPagination.value) {
    searchParam.value = {
      fromCreatedDate: defaultFromDate.value,
      toCreatedDate: defaultToDate.value,
      "entity.owner.entityId": authStore.entityId,
    };
  } else {
    loading.value = true;
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      fromCreatedDate: defaultFromDate.value,
      toCreatedDate: defaultToDate.value,
      "entity.owner.entityId": authStore.entityId,
    };
    notificationApi
      .getMessages(searchParam.value)
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
    const response = await notificationApi.getMessages(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function rowSelected(row) {
  selectedRows.value = [];
  selectedRows.value = row;
}

function search(params) {
  if (!canGetMessages.value) {
    showAlert("쪽지 조회 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    searchParam.value = {
      "entity.owner.entityId": authStore.entityId,
      ...params,
    };
    setData();
  } else {
    loading.value = true;
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      "entity.owner.entityId": authStore.entityId,
      ...params,
    };
    notificationApi
      .getMessages(searchParam.value)
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

function rowDbclick(row) {
  const notificationEid = row.notification.entityId;
  const messageType = row.type;
  if (messageType === FlowSystemCode.MESSAGE_TYPE.RECEIVE_MESSAGE) {
    notificationApi
      .updateNotification(notificationEid)
      .then((response) => {
        if (response.status === 200) {
          loadInitialData();
          if (useBtnPagination.value) setData();
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  $q.dialog({
    component: NotificationMessagePopup,
    componentProps: {
      componentType: "read",
      data: row.notification,
    },
  });
}

function deleteMessages() {
  if (!selectedRows.value.length) {
    showAlert("삭제할 쪽지를 선택해주세요.");
    return;
  }
  showConfirm("쪽지를 삭제하시겠습니까?").then((res) => {
    if (res) {
      let entityIds = "";
      for (const [i, row] of selectedRows.value.entries()) {
        entityIds += row.entityId;
        if (i < selectedRows.value.length - 1) {
          entityIds += ",";
        }
      }
      notificationApi
        .deleteMessages(entityIds)
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
      .getMessages(searchParam.value)
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
      <NotificationMessageSearchBar @search="search" />
    </div>
    <div class="col column no-wrap a-border q-pa-xs">
      <a-title-bar title="쪽지 목록" class="col-auto full-width q-mb-xs" />
      <TabulatorGrid
        :rows="rows"
        :columns="columns"
        :infiniteScroll="infiniteScroll"
        :selectableRows="true"
        selectableRowsRangeMode="click"
        @rowSelected="rowSelected"
        @rowDeselected="rowSelected"
        @rowDblClick="rowDbclick"
        :ajax-url="ajaxUrl"
        :ajax-request-func="ajaxRequestFunction"
        :pagination="useBtnPagination"
        :pagination-size="size"
        class="col full-width"
        ref="grid"
      />

      <div class="full-width text-right bg-grey-5 a-border q-pa-xs col-auto" v-if="canDeleteMessage">
        <a-btn label="삭제" @click="deleteMessages" />
      </div>
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
