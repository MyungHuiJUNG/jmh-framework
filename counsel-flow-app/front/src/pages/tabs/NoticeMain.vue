<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";
import noticeApi from "src/js/api/noticeApi";
import { showAlert, showConfirm } from "src/js/common/dialog";
import NoticeDetail from "components/notice/NoticeDetail.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import ATitleBar from "components/common/ATitleBar.vue";
import ACheckbox from "src/components/common/ACheckbox.vue";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";

const permissionRoleStore = usePermissionRoleStore();

const useBtnPagination = ref(false);
const ajaxUrl = "/rest/api/v1/notice/notices";

const DEFAULT_FROM_DATE = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
const DEFAULT_TO_DATE = getFormattedDate(new Date());

// NoticeDetail 컴포넌트
const noticeDetail = ref(null);

const fromDate = ref(DEFAULT_FROM_DATE); // 'YYYY-MM-DD'
const toDate = ref(DEFAULT_TO_DATE); // 'YYYY-MM-DD'
const keyword = ref(null);
const useCreatedDate = ref(true);
const useKeyword = ref(false);

const canGetNotice = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.NOTICE_ROLE.READ));
const canRemoveNotice = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.NOTICE_ROLE.DELETE));

const grid = ref(null);

const selectedRows = ref([]);
const rows = ref([]);

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
    formatter: "rownum", // 가상의 row번호
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: 30,
  },
  {
    title: "제목",
    field: "title",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: true,
  },
  {
    title: "등록자",
    field: "createdBy",
    formatter: function (row) {
      let data = row.getData();
      if (data.createdByUserName && data.createdByUserId) return data.createdByUserName + ` [${data.createdByUserId}]`;
      else return null;
    },
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    width: 125,
  },
  {
    title: "등록일자",
    field: "createdDate",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    width: 125,
  },
];

const page = ref(0);
const size = ref(100);
const isLast = ref(false);

const searchParam = ref({
  page: page.value,
  size: size.value,
  fromCreatedDate: DEFAULT_FROM_DATE,
  toCreatedDate: addOneDay(DEFAULT_TO_DATE),
});

watch(keyword, (newVal) => {
  if (newVal) useKeyword.value = true;
  else useKeyword.value = false;
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

function getNotices(param) {
  noticeApi
    .getNotices(param)
    .then((response) => {
      rows.value = response.data.content;
      isLast.value = response.data.last;
      page.value += 1;
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function loadInitialData() {
  if (!canGetNotice.value) {
    showAlert("공지사항 읽기 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    searchParam.value = {
      fromCreatedDate: DEFAULT_FROM_DATE,
      toCreatedDate: addOneDay(DEFAULT_TO_DATE),
    };
  } else {
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      fromCreatedDate: DEFAULT_FROM_DATE,
      toCreatedDate: addOneDay(DEFAULT_TO_DATE),
    };
    getNotices(searchParam.value);
  }
}

async function checkNumberOfNoticeToDelete() {
  if (selectedRows.value.length === 0) {
    await showAlert("삭제할 목록을 선택해주세요.");
    return false;
  }

  const result = await showConfirm("삭제하시겠습니까?");
  if (!result) {
    return false;
  }
  if (!selectedRows.value[0]) {
    return false;
  }

  if (selectedRows.value.length === 1) {
    deleteNotice(selectedRows.value[0].entityId);
  } else {
    let entityIds = "";
    for (const [i, row] of selectedRows.value.entries()) {
      entityIds += row.entityId;
      if (i < selectedRows.value.length - 1) {
        entityIds += ",";
      }
    }
    deleteNotices(entityIds);
  }
}

function deleteNotice(entityId) {
  noticeApi
    .deleteNotice(entityId)
    .then((resposne) => {
      loadInitialData();
      noticeDetail.value.resetInfo();
      if (useBtnPagination.value) setData();
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function deleteNotices(entityIds) {
  noticeApi
    .deleteNotices(entityIds)
    .then((resposne) => {
      loadInitialData();
      noticeDetail.value.resetInfo();
      if (useBtnPagination.value) setData();
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function resetSearchInfo() {
  fromDate.value = DEFAULT_FROM_DATE;
  toDate.value = DEFAULT_TO_DATE;
  keyword.value = null;
  useCreatedDate.value = true;
  useKeyword.value = false;
}

function search() {
  if (!canGetNotice.value) {
    showAlert("공지사항 읽기 권한이 없습니다.");
    return;
  }
  const param = {};

  if (useBtnPagination.value) {
    if (useCreatedDate.value) {
      param["fromCreatedDate"] = fromDate.value;
      param["toCreatedDate"] = addOneDay(toDate.value);
    }
    if (useKeyword.value && keyword.value?.trim()) {
      param["keyword"] = keyword.value.trim();
    }
    searchParam.value = {
      ...param,
    };
    setData();
  } else {
    if (useCreatedDate.value) {
      param["fromCreatedDate"] = fromDate.value;
      param["toCreatedDate"] = addOneDay(toDate.value);
    }
    if (useKeyword.value && keyword.value?.trim()) {
      param["keyword"] = keyword.value.trim();
    }
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      ...param,
    };
    getNotices(searchParam.value);
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
    const response = await noticeApi.getNotices(searchParam.value);
    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function addOneDay(dateStr) {
  // 입력된 'yyyy-MM-dd' 형식의 날짜 문자열을 Date 객체로 변환
  const date = new Date(dateStr);

  // 하루를 추가 (24 * 60 * 60 * 1000 밀리초 = 1일)
  date.setDate(date.getDate() + 1);

  // 날짜를 다시 'yyyy-MM-dd' 형식으로 변환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function rowClick(row) {
  noticeDetail.value.getNotice(row.entityId);
}

function rowSelected(row) {
  selectedRows.value = [];
  selectedRows.value = row;
}

function rowDeselected(row) {
  selectedRows.value = [];
  selectedRows.value = row;
}

function refreshTabulatorRow() {
  selectedRows.value = [];
  grid.value.deselectAllRows();
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
    noticeApi
      .getNotices(searchParam.value)
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
  <div class="a-border q-pa-xs column fit" style="min-height: 680px">
    <div class="col-auto full-width">
      <table class="a-table full-width">
        <colgroup>
          <col width="120px" />
          <col width="240px" />
          <col width="120px" />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <td class="t-column">
              <a-checkbox v-model="useCreatedDate" label="등록일자" />
            </td>
            <td>
              <div class="row">
                <a-input class="col" type="date" v-model="fromDate" :max="toDate" />
                <a-input class="col" type="date" v-model="toDate" :min="fromDate" />
              </div>
            </td>
            <td class="t-column">
              <a-checkbox v-model="useKeyword" label="제목 + 내용" />
            </td>
            <td>
              <div class="row">
                <div class="col-6">
                  <a-input v-model="keyword" @keyup.enter="search" style="width: 300px" />
                </div>
                <div class="col-6 row justify-end">
                  <a-btn label="조회" @click="search" />
                  <a-btn label="초기화" class="q-ml-xs" @click="resetSearchInfo" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col row q-mt-xs full-width">
      <div class="col column full-height a-border q-pa-xs">
        <a-title-bar title="공지사항 목록" class="col-auto full-width q-mb-xs" />
        <tabulator-grid
          ref="grid"
          :rows="rows"
          :columns="columns"
          :selectableRows="true"
          :infinite-scroll="infiniteScroll"
          selectableRowsRangeMode="click"
          @rowClick="rowClick"
          @rowSelected="rowSelected"
          @rowDeselected="rowDeselected"
          :ajax-url="ajaxUrl"
          :ajax-request-func="ajaxRequestFunction"
          :pagination="useBtnPagination"
          :pagination-size="size"
          class="col full-width"
        />
        <div class="full-width text-right bg-grey-5 a-border q-pa-xs col-auto">
          <a-btn v-if="canRemoveNotice" label="삭제" @click="checkNumberOfNoticeToDelete" />
        </div>
      </div>
      <div class="col-7 q-ml-xs full-height a-border q-pa-xs">
        <NoticeDetail ref="noticeDetail" @refreshNotice="loadInitialData" @refreshTabulatorRow="refreshTabulatorRow" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.t-column {
  background-color: $grey-2;
  width: 120px;
}

.a-table,
.a-table tr,
.a-table td {
  border: 1px solid $grey-5;
  border-collapse: collapse;
}

.a-table td {
  padding: 1px map-get($space-xs, x);
  vertical-align: middle;
}

.a-table tr,
.a-table td {
  height: $line-height + 2;
}
</style>
