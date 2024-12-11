<script setup>
import { ref, onMounted, computed } from "vue";
import TabulatorGrid from "src/components/common/TabulatorGrid.vue";
import ATitleBar from "src/components/common/ATitleBar.vue";
import ABtn from "src/components/common/ABtn.vue";
import CallbackSearchBar from "src/components/callback/CallbackSearchBar.vue";
import callbackApi from "src/js/api/callbackApi";
import { handleApiError } from "src/js/common/errorHandler";
import { useCodeStore } from "src/stores/codeStore";
import { useQuasar } from "quasar";
import UserPopup from "src/components/common/UserPopup.vue";
import { showAlert, showConfirm } from "src/js/common/dialog";
import CallbackTargetGroupPopup from "src/components/callback/CallbackTargetGroupPopup.vue";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import ALoadingSpinner from "src/components/common/ALoadingSpinner.vue";

const loading = ref(false);

const $q = useQuasar();
const permissionRoleStore = usePermissionRoleStore();
const codeStore = useCodeStore();

const grid = ref(null);
const useBtnPagination = ref(false);
const ajaxUrl = "/rest/api/v1/callback/ticket/tickets";

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
  // { title: "콜백 생성일시", field: "createdDate", headerHozAlign: "center", hozAlign: "center" },
  {
    title: "대표서비스",
    field: "representNumberName",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      return `${data.representNumberName} (${data.representNumber})`;
    },
  },
  { title: "인입경로", field: "inboundPathCode", headerHozAlign: "center", hozAlign: "center" },
  { title: "수신번호", field: "receptionNumber", headerHozAlign: "center", hozAlign: "center" },
  { title: "콜백번호", field: "callbackNumber", headerHozAlign: "center", hozAlign: "center" },
  {
    title: "담당자",
    field: "ticket",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (row) {
      const data = row.getData();
      if (data.ticket.managerUserName && data.ticket.managerUserId)
        return data.ticket.managerUserName + ` [${data.ticket.managerUserId}]`;
      else return null;
    },
  },
  {
    title: "티켓 처리상태",
    field: "ticket.statusCode",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return codeStore.codes.get(code)?.name ?? code;
    },
  },
  { title: "티켓 발행일시", field: "ticket.createdDate", headerHozAlign: "center", hozAlign: "center" },
  { title: "티켓 처리일시", field: "ticket.endDate", headerHozAlign: "center", hozAlign: "center" },
];
const title = "콜백목록";

const canReadCallback = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CALLBACK_ROLE.READ));
const canUseAutoBtn = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CALLBACK_ROLE.AUTO));
const canUseManualBtn = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CALLBACK_ROLE.MANUAL));

const selectedRows = ref([]);

const page = ref(0);
const size = ref(100);
const isLast = ref(false);
const searchParam = ref();
const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());

onMounted(() => {
  loadInitialData();
});

function setToDate(dateString) {
  // 입력된 날짜 문자열을 Date 객체로 변환
  const date = new Date(dateString);

  // 하루(24시간)를 추가
  date.setDate(date.getDate() + 1);

  // 년, 월, 일을 각각 추출하여 'yyyy-MM-dd' 형식으로 반환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
function getFormattedDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function search(param) {
  if (!canReadCallback.value) {
    showAlert("콜백 조회 권한이 없습니다.");
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
    callbackApi
      .getCallbacks(searchParam.value)
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
  if (!canReadCallback.value) {
    showAlert("콜백 조회 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    searchParam.value = {
      fromCreatedDate: DEFAULT_FROM_DATE + " 00:00:00",
      toCreatedDate: setToDate(DEFAULT_TO_DATE) + " 00:00:00",
    };
  } else {
    loading.value = true;

    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      fromCreatedDate: DEFAULT_FROM_DATE + " 00:00:00",
      toCreatedDate: setToDate(DEFAULT_TO_DATE) + " 00:00:00",
    };
    callbackApi
      .getCallbacks(searchParam.value)
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

function rowSelected(row) {
  selectedRows.value = [];
  selectedRows.value = row;
}

async function infiniteScroll() {
  if (useBtnPagination.value) return;
  if (isLast.value) return;

  searchParam.value = {
    ...searchParam.value,
    page: page.value,
  };

  try {
    const response = await callbackApi.getCallbacks(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function setManagerManually() {
  if (!selectedRows.value || !selectedRows.value.length) {
    showAlert("콜백을 선택해주세요.");
    return;
  }
  $q.dialog({
    component: UserPopup,
    componentProps: {
      enableRowDblClick: true,
      title: "콜백 수동분배",
    },
  }).onOk((payload) => {
    showConfirm(`${payload.payload[0].name} [${payload.payload[0].id}] 에게 분배하시겠습니까?`).then((res) => {
      if (res) {
        const promises = selectedRows.value.map((row) =>
          callbackApi.setManagerManually(row.entityId, payload.payload[0].entityId)
        );
        Promise.all(promises)
          .then((response) => {
            if (response.every((response) => response.status === 200)) {
              showAlert("수동분배가 완료되었습니다.");
            }
          })
          .catch((error) => {
            handleApiError(error);
          })
          .finally(() => {
            loadInitialData();
            if (useBtnPagination.value) setData();
          });
      }
    });
  });
}

function setCallbackTargetGroup() {
  $q.dialog({
    component: CallbackTargetGroupPopup,
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
    callbackApi
      .getCallbacks(searchParam.value)
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
      <CallbackSearchBar @search="search" />
    </div>
    <div class="col column no-wrap a-border q-pa-xs">
      <a-title-bar :title="title" class="q-mb-xs col-auto full-width" />
      <TabulatorGrid
        :rows="rows"
        :columns="columns"
        :selectableRows="true"
        selectableRowsRangeMode="click"
        @rowSelected="rowSelected"
        @rowDeselected="rowSelected"
        :infiniteScroll="infiniteScroll"
        :ajax-url="ajaxUrl"
        :ajax-request-func="ajaxRequestFunction"
        :pagination="useBtnPagination"
        :pagination-size="size"
        ref="grid"
        class="col full-width"
      />
      <div class="full-width text-right bg-grey-5 a-border q-pa-xs col-auto" v-if="canUseAutoBtn || canUseManualBtn">
        <a-btn label="자동분배 설정" @click="setCallbackTargetGroup" v-if="canUseAutoBtn" />
        <a-btn label="수동분배" class="q-ml-xs" @click="setManagerManually" v-if="canUseManualBtn" />
      </div>
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
