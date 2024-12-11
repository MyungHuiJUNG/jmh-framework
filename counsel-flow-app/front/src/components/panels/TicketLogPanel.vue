<script setup>
import { ref, computed } from "vue";
import { useCodeStore } from "src/stores/codeStore";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import ticketApi from "src/js/api/ticketApi";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import { handleApiError } from "src/js/common/errorHandler";

const emit = defineEmits(["rowClick"]);
const counselTypeStore = useCounselTypeStore();
const codeStore = useCodeStore();
defineExpose({ getTickets });
const grid = ref(null);
const useBtnPagination = ref(false);

const columns = [
  { title: "티켓번호", field: "entityId", headerHozAlign: "center", hozAlign: "center" },
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
    title: "인입채널",
    field: "channels",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const channels = cell.getValue();
      let contactCode = null;
      if (channels?.length) {
        contactCode = codeStore.codes.get(channels[0].contactCode).name;
      }
      return contactCode;
    },
  },
  { title: "수/발신번호", field: "tel", headerHozAlign: "center", hozAlign: "center" },
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
];
const ajaxUrl = "/rest/api/v1/ticket/tickets";

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

function getTickets(tel) {
  if (useBtnPagination.value) {
    const param = { ...searchParam.value };
    if (tel) param["entity.tel"] = tel;
    searchParam.value = param;
    setData();
  } else {
    page.value = 0;
    const param = { ...searchParam.value };
    if (tel) param["entity.tel"] = tel;

    searchParam.value = param;
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

function handleClick(data) {
  emit("rowClick", data);
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
  grid.value.setData();
}
</script>

<template>
  <tabulator-grid
    :rows="rows"
    :columns="columns"
    @rowDblClick="handleClick"
    :selectable-rows="1"
    :infinite-scroll="infiniteScroll"
    :ajax-url="ajaxUrl"
    :ajax-request-func="ajaxRequestFunction"
    :pagination="useBtnPagination"
    :pagination-size="size"
    ref="grid"
    class="ticket-grid col fit"
  />
</template>

<style lang="scss" scoped></style>
