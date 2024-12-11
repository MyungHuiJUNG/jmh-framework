<script setup>
import TabulatorGrid from "src/components/common/TabulatorGrid.vue";
import ATitleBar from "src/components/common/ATitleBar.vue";
import StatisticsByCounselTypesSearchBar from "src/components/statistic/StatisticsByCounselTypesSearchBar.vue";
import { ref, onMounted, computed } from "vue";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert } from "src/js/common/dialog";
import statisticApi from "src/js/api/statisticApi";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ALoadingSpinner from "src/components/common/ALoadingSpinner.vue";

const loading = ref(false);

const FILE_NAME = "상담유형별 티켓통계";
const grid = ref(null);
const counselTypeStore = useCounselTypeStore();

const permissionRoleStore = usePermissionRoleStore();
const canGetStatisticsByCounselType = computed(() =>
  permissionRoleStore.hasPermission(FlowRoleCode.STATISTICS_COUNSEL_TYPE_ROLE.READ)
);

const rows = ref([]);
const columns = [
  {
    title: "날짜",
    field: "fromDate",
    headerHozAlign: "center",
    hozAlign: "center",
    width: 200,
    formatter: function (row) {
      const data = row.getData();
      return data.fromDate + ` ~ ${data.toDate}`;
    },
  },
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
  { title: "발행티켓수", field: "totalTicketCount", headerHozAlign: "center", hozAlign: "center" },
  { title: "미처리티켓수", field: "unprocessedTicketCount", headerHozAlign: "center", hozAlign: "center" },
  { title: "처리중티켓수", field: "inProcessTicketCount", headerHozAlign: "center", hozAlign: "center" },
  { title: "완료티켓수", field: "completedTicketCount", headerHozAlign: "center", hozAlign: "center" },
  {
    title: "처리율",
    field: "processingRate",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      const completionRate = (data.completedTicketCount / data.totalTicketCount) * 100;
      return completionRate.toFixed(1) + "%";
    },
  },
  { title: "이관티켓수", field: "transmitTicketCount", headerHozAlign: "center", hozAlign: "center" },
];

const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());

const searchParam = ref({
  fromDate: DEFAULT_FROM_DATE,
  toDate: DEFAULT_TO_DATE,
});

onMounted(() => {
  loadInitialData();
});

function getFormattedDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function getStatisticsByCounselTypes(params) {
  if (!canGetStatisticsByCounselType.value) {
    showAlert("상담유형별 통계 조회 권한이 없습니다.");
    return;
  }

  loading.value = true;

  statisticApi
    .getStatisticsByCounselType(params)
    .then((response) => {
      rows.value = response.data;
    })
    .catch((error) => {
      handleApiError(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

function loadInitialData() {
  getStatisticsByCounselTypes(searchParam.value);
}

function excelDownload() {
  grid.value.excelDownload(FILE_NAME);
}
</script>

<template>
  <div class="column no-wrap fit a-border q-pa-xs" style="min-height: 680px">
    <div class="col-auto q-mb-xs">
      <StatisticsByCounselTypesSearchBar @search="getStatisticsByCounselTypes" @excel-download="excelDownload" />
    </div>
    <div class="col column no-wrap a-border q-pa-xs">
      <ATitleBar title="상담유형별 티켓 통계" class="col-auto full-width q-mb-xs" />
      <TabulatorGrid :rows="rows" :columns="columns" class="col" ref="grid" />
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
