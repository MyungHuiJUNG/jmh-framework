<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useCodeStore } from "src/stores/codeStore";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import ticketApi from "src/js/api/ticketApi";
import AGrid from "components/common/TabulatorGrid.vue";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const loading = ref();

const emit = defineEmits(["rowSelected", "rowDeselected", "rowDeleted", "hasDatas"]);
defineExpose({ deleteTicket, loadInitialData, searchTickets, setData });

const COUNSEL_TICKET = FlowSystemCode.TICKET_TYPE.COUNSEL_TICKET;

const codeStore = useCodeStore();
const counselTypeStore = useCounselTypeStore();
const permissionRoleStore = usePermissionRoleStore();

const canGetTicket = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.TICKET_ROLE.READ));

const grid = ref(null);
const useBtnPagination = ref(false);

const ajaxUrl = "/rest/api/v1/ticket/tickets";

const columns = [
  {
    formatter: "rowSelection",
    titleFormatter: null,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: 20,
    resizable: false,
  },
  { title: "티켓번호", field: "entityId", headerHozAlign: "center", hozAlign: "center" },
  {
    title: "처리상태",
    field: "statusCode",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return codeStore.codes.get(code)?.name ?? code;
    },
  },
  {
    title: "티켓유형",
    field: "typeCode",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return codeStore.codes.get(code)?.name ?? code;
    },
  },
  {
    title: "상담구분",
    field: "counselCategoryCode",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return codeStore.codes.get(code)?.name ?? code;
    },
  },
  { title: "발행일시", field: "createdDate", headerHozAlign: "center", hozAlign: "center" },
  {
    title: "상담유형(대)",
    field: "counselTypeCodeLarge",
    headerHozAlign: "center",
    hozAlign: "left",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return counselTypeStore.counselTypes.get(code)?.name ?? code;
    },
  },
  {
    title: "상담유형(중)",
    field: "counselTypeCodeMedium",
    headerHozAlign: "center",
    hozAlign: "left",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return counselTypeStore.counselTypes.get(code)?.name ?? code;
    },
  },
  {
    title: "상담유형(소)",
    field: "counselTypeCodeSmall",
    headerHozAlign: "center",
    hozAlign: "left",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return counselTypeStore.counselTypes.get(code)?.name ?? code;
    },
  },
  { title: "전화번호", field: "tel", headerHozAlign: "center", hozAlign: "center" },
  {
    title: "담당자",
    field: "managerUserName",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      if (data.managerUserName && data.managerUserId) return data.managerUserName + ` [${data.managerUserId}]`;
      else return null;
    },
  },
  {
    title: "보고자",
    field: "createdByUserName", // 이름으로 받아야함
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      if (data.createdByUserName && data.createdByUserId) return data.createdByUserName + ` [${data.createdByUserId}]`;
      else return null;
    },
  },
];

const rows = ref([]);

const page = ref(0);
const size = ref(100);
const isLast = ref(false);
const defaultFromDate = ref(formatDate(getLastMonth(new Date()))); // 초기값 한달 전 00:00:00
const defaultToDate = ref(formatDate(setToDate(new Date()))); // 초기값 내일 00:00:00

const searchParam = ref({
  page: page.value,
  size: size.value,
  fromCreatedDate: defaultFromDate.value,
  toCreatedDate: defaultToDate.value,
  "entity.typeCode": COUNSEL_TICKET,
});

onMounted(() => {
  loadInitialData();
});

watch(rows, (newVal) => {
  if (newVal.length) emit("hasDatas", true);
  else emit("hasDatas", false);
});

function handleSelected(data) {
  emit("rowSelected", data);
}
function handleDeselected() {
  emit("rowDeselected");
}

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

async function infiniteScroll() {
  if (useBtnPagination.value) return;
  if (isLast.value) return;

  searchParam.value = {
    ...searchParam.value,
    page: page.value,
  };

  try {
    const response = await ticketApi.getTicket(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function searchTickets(param) {
  if (!canGetTicket.value) {
    showAlert("티켓 조회 권한이 없습니다.");
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

    return ticketApi
      .getTicket(searchParam.value)
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

function loadInitialData() {
  if (!canGetTicket.value) {
    showAlert("티켓 조회 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    // 버튼 페이징에서는 page, size를 tabulator에서 할당하고 관리
    searchParam.value = {
      fromCreatedDate: defaultFromDate.value,
      toCreatedDate: defaultToDate.value,
      "entity.typeCode": COUNSEL_TICKET,
    };
  } else {
    loading.value = true;
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      fromCreatedDate: defaultFromDate.value,
      toCreatedDate: defaultToDate.value,
      "entity.typeCode": COUNSEL_TICKET,
    };

    ticketApi
      .getTicket(searchParam.value)
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

function deleteTicket(entityId) {
  if (!entityId) return;

  showConfirm("삭제하시겠습니까?").then((res) => {
    if (res) {
      ticketApi
        .deleteTicket(entityId)
        .then((response) => {
          if (response.status === 200) {
            loadInitialData();
            if (useBtnPagination.value) setData();
            emit("rowDeleted");
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  });
}

function ajaxRequestFunction(url, config, params) {
  searchParam.value = {
    ...searchParam.value,
    page: params.page - 1, // Tabulator는 1-based, API는 0-based
    size: params.size || size.value,
    isPaging: true, // totalPages 받는 parameter
  };

  return new Promise(function (resolve, reject) {
    ticketApi
      .getTicket(searchParam.value)
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

function setData() {
  if (useBtnPagination.value) grid.value.setData();
}
</script>

<template>
  <div class="column fit no-wrap">
    <a-grid
      :rows="rows"
      :columns="columns"
      @row-selected="handleSelected"
      @row-deselected="handleDeselected"
      :selectable-rows="1"
      :infinite-scroll="infiniteScroll"
      :ajax-url="ajaxUrl"
      :ajax-request-func="ajaxRequestFunction"
      :pagination="useBtnPagination"
      :pagination-size="size"
      ref="grid"
      class="col full-width"
    />
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
