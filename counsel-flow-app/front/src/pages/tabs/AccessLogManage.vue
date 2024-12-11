<script setup>
import AccessLogSearchBar from "src/components/accessLog/AccessLogSearchBar.vue";
import TabulatorGrid from "src/components/common/TabulatorGrid.vue";
import ATitleBar from "src/components/common/ATitleBar.vue";
import { ref, onMounted, computed } from "vue";
import { useCodeStore } from "src/stores/codeStore";
import accessLogApi from "src/js/api/accessLogApi";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert } from "src/js/common/dialog";
import ALoadingSpinner from "src/components/common/ALoadingSpinner.vue";

const loading = ref(false);

const permissionRoleStore = usePermissionRoleStore();

const canGetAccessLog = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.ACCESS_LOG_ROLE.READ));

const useBtnPagination = ref(false);
const ajaxUrl = "/rest/api/v1/access-log/access-logs";

const codeStore = useCodeStore();
const rows = ref([]);
const columns = [
  {
    title: "접속일시",
    field: "accessDate",
    headerHozAlign: "center",
    hozAlign: "center",
  },
  {
    title: "접속유형",
    field: "accessType",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return codeStore.codes.get(code)?.name ?? code;
    },
  },
  {
    title: "사용자",
    field: "user",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      return data.user.name + ` [${data.user.id}]`;
    },
  },
  {
    title: "접속ip",
    field: "clientIpAddress",
    headerHozAlign: "center",
    hozAlign: "center",
  },
];

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
  if (!canGetAccessLog.value) {
    showAlert("접속 로그 조회 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    searchParam.value = {};
  } else {
    loading.value = true;
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
    };

    accessLogApi
      .getAccessLogs(searchParam.value)
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
    const response = await accessLogApi.getAccessLogs(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function search(param) {
  if (!canGetAccessLog.value) {
    showAlert("접속 로그 조회 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    searchParam.value = {
      ...param,
    };
    setData();
  } else {
    loading.value = true;
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      ...param,
    };
    accessLogApi
      .getAccessLogs(searchParam.value)
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
    accessLogApi
      .getAccessLogs(searchParam.value)
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
      <AccessLogSearchBar @search="search" />
    </div>
    <div class="col column no-wrap a-border q-pa-xs">
      <ATitleBar title="접속 로그" class="col-auto full-width q-mb-xs" />
      <TabulatorGrid
        :rows="rows"
        :columns="columns"
        class="col"
        ref="grid"
        :infinite-scroll="infiniteScroll"
        :ajax-url="ajaxUrl"
        :ajax-request-func="ajaxRequestFunction"
        :pagination="useBtnPagination"
        :pagination-size="size"
      />
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
