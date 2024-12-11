<script setup>
import { onMounted, ref, watch, computed } from "vue";
import boardApi from "src/js/api/boardApi";
import ATitleBar from "components/common/ATitleBar.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import ACheckbox from "src/components/common/ACheckbox.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import BoardCatagory from "src/components/board/BoardCategory.vue";
import BoardDetailPopup from "src/components/board/BoardDetailPopup.vue";
import BoardRegistPopup from "src/components/board/BoardRegistPopup.vue";
import { useCategoryStore } from "src/stores/categoryStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { useQuasar } from "quasar";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import UserPopup from "src/components/common/UserPopup.vue";

const $q = useQuasar();
const categoryStore = useCategoryStore();
const permissionRoleStore = usePermissionRoleStore();

const useBtnPagination = ref(false);
const ajaxUrl = "/rest/api/v1/board/boards";

const canGetBoard = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.BOARD_ROLE.READ));
const canAddBoard = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.BOARD_ROLE.ADD));
const canRemoveBoard = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.BOARD_ROLE.DELETE));

const searchTxt = ref("");
const useSearchTxt = ref(false);
const useUser = ref(false);
const userEid = ref();
const userName = ref();
const searchCategory = ref("");
const rows = ref([]);

const grid = ref("");
const selectedRows = ref([]);
const boardColumns = [
  {
    formatter: "rowSelection",
    titleFormatter: "rowSelection",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: 20,
  },
  { title: "entityId", field: "entityId", visible: false },
  { title: "#", formatter: "rownum", headerHozAlign: "center", hozAlign: "center", headerSort: false, width: 60 },
  {
    title: "카테고리",
    field: "categories",
    formatter: function (row) {
      let data = row.getData();

      if (!data.category || !data.category.path) {
        return "전체";
      }

      const categoryPath = data.category.path.split(".");
      const categoryNames = categoryPath.map((code) => {
        const category = categoryStore.categories.get(code);
        return category ? category.name : code;
      });

      return categoryNames.join(" > ");
    },
    headerHozAlign: "center",
    hozAlign: "left",
    headerSort: true,
  },
  { title: "제목", field: "title", headerHozAlign: "center", hozAlign: "left", headerSort: true },
  {
    title: "등록자",
    field: "createdBy",
    formatter: function (row) {
      let data = row.getData();
      return data.createdByUser.name + ` [${data.createdByUser.id}]`;
    },
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    width: 150,
  },
  {
    title: "등록일자",
    field: "createdDate",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: true,
    width: 150,
  },
  { title: "조회수", field: "readCount", headerHozAlign: "center", hozAlign: "center", headerSort: true, width: 100 },
];

const page = ref(0);
const size = ref(100);
const isLast = ref(false);
const searchParam = ref({});

const categoryRef = ref(null);

watch(searchTxt, (newVal) => {
  if (newVal) useSearchTxt.value = true;
  else useSearchTxt.value = false;
});

watch(userEid, (newVal) => {
  if (newVal) useUser.value = true;
  else useUser.value = false;
});

function rowSelected(row) {
  selectedRows.value = row;
}

function search() {
  if (!canGetBoard.value) {
    showAlert("게시판 조회 권한이 없습니다.");
    return;
  }
  if (useBtnPagination.value) {
    searchParam.value = {};
    if (searchCategory.value) {
      searchParam.value["entity.categoryId"] = searchCategory.value.entityId;
    }

    if (useSearchTxt.value && searchTxt.value?.trim()) {
      searchParam.value["keyword"] = searchTxt.value.trim();
    }

    if (useUser.value && userEid.value) {
      searchParam.value["entity.createdByUser"] = userEid.value;
    }
    setData();
  } else {
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
    };

    if (searchCategory.value) {
      searchParam.value["entity.categoryId"] = searchCategory.value.entityId;
    }

    if (useSearchTxt.value && searchTxt.value?.trim()) {
      searchParam.value["keyword"] = searchTxt.value.trim();
    }

    if (useUser.value && userEid.value) {
      searchParam.value["entity.createdByUser"] = userEid.value;
    }

    boardApi
      .getBoards(searchParam.value)
      .then((response) => {
        if (response.status === 200) {
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

function getBoardDatas() {
  if (!canGetBoard.value) {
    showAlert("게시판 조회 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    searchParam.value = {};
    if (searchCategory.value) {
      searchParam.value["entity.categoryId"] = searchCategory.value.entityId;
    }
  } else {
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
    };

    if (searchCategory.value) {
      searchParam.value["entity.categoryId"] = searchCategory.value.entityId;
    }

    boardApi
      .getBoards(searchParam.value)
      .then((response) => {
        if (response.status === 200) {
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
    const response = await boardApi.getBoards(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function treeRowClicked(data) {
  // node데이터
  searchCategory.value = data;
  getBoardDatas();
  if (useBtnPagination.value) setData();
  selectedRows.value = [];
}

function deleteBoard() {
  if (!selectedRows.value.length) {
    showAlert("삭제할 게시물을 선택하세요.");
    return;
  }

  let entityIds = "";
  for (const idx in selectedRows.value) {
    if (idx > 0) entityIds += ",";
    entityIds += selectedRows.value[idx].entityId;
  }

  showConfirm("선택한 게시글을 삭제하시겠습니까?").then((res) => {
    if (res) {
      boardApi
        .deleteBoards(entityIds)
        .then((response) => {
          if (response.status === 200) {
            selectedRows.value = [];
            getBoardDatas();
            if (useBtnPagination.value) setData();
            getAllCategories();
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  });
}

function addBoard() {
  const propCategoryData = searchCategory.value?.entityId ? { categoryId: searchCategory.value.entityId } : null;

  $q.dialog({
    component: BoardRegistPopup,
    componentProps: propCategoryData ? { propCategoryData } : {},
  }).onOk(() => {
    getBoardDatas();
    if (useBtnPagination.value) setData();
    getAllCategories();
  });
}

function rowDbclick(row) {
  const propData = {
    entityId: row.entityId,
  };

  $q.dialog({
    component: BoardDetailPopup,
    componentProps: { propData: propData },
  }).onOk((result) => {
    let msg = "";
    if (result.type === "delete") msg = "삭제되었습니다.";

    if (result.type === "update") msg = "수정 저장되었습니다.";

    if (msg) {
      showAlert(msg);
      getBoardDatas();
      if (useBtnPagination.value) setData();
      getAllCategories();
    }
  });

  const params = {
    readCount: row.readCount + 1,
  };

  boardApi
    .updateBoard(propData.entityId, params)
    .then((response) => {
      row.readCount++;
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function resetSearchInfo() {
  searchTxt.value = null;
  useSearchTxt.value = false;
  userName.value = null;
  userEid.value = null;
  useUser.value = false;
}

function getAllCategories() {
  categoryRef.value.getAllCategories();
}

function openUserPopup() {
  $q.dialog({
    component: UserPopup,
    componentProps: {
      enableRowDblClick: true,
    },
  }).onOk((payload) => {
    userEid.value = payload.payload[0].entityId;
    userName.value = `${payload.payload[0].name} [${payload.payload[0].id}]`;
  });
}

onMounted(() => {
  getBoardDatas();
  getAllCategories();
  categoryStore.load();
});

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
    boardApi
      .getBoards(searchParam.value)
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
  <div class="a-border q-pa-xs fit column">
    <div class="col row">
      <div class="col-2 a-border full-height q-pa-xs">
        <BoardCatagory
          :addAdjustTreeButton="true"
          :addCategoryManageComponent="true"
          @rowClick="treeRowClicked"
          ref="categoryRef"
        />
      </div>
      <div class="col column full-height q-ml-xs">
        <div class="col-auto q-mb-xs full-width">
          <table class="a-table full-width">
            <colgroup>
              <col class="t-column" width="120px" />
              <col width="300px" />
              <col class="t-column" width="120px" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td>
                  <div class="row">
                    <a-checkbox v-model="useSearchTxt" label="제목 + 내용" />
                  </div>
                </td>
                <td>
                  <div class="row">
                    <a-input v-model="searchTxt" @keyup.enter="search()" class="full-width" />
                  </div>
                </td>
                <td>
                  <div class="row"><a-checkbox v-model="useUser" label="등록자" /></div>
                </td>
                <td>
                  <div class="row justify-between">
                    <div class="row">
                      <a-input v-model="userName" :readonly="true" />
                      <a-btn icon="search" class="q-ml-xs" @click="openUserPopup" />
                    </div>
                    <div class="col-auto">
                      <a-btn label="조회" @click="search" />
                      <a-btn label="초기화" class="q-ml-xs" @click="resetSearchInfo" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column col no-wrap a-border q-pa-xs full-width">
          <a-title-bar title="게시판 목록" class="col-auto full-width q-mb-xs" />
          <tabulator-grid
            ref="grid"
            :rows="rows"
            :columns="boardColumns"
            :selectableRows="true"
            :infinite-scroll="infiniteScroll"
            selectableRowsRangeMode="click"
            @rowSelected="rowSelected"
            @rowDeselected="rowSelected"
            @rowDblClick="rowDbclick"
            :ajax-url="ajaxUrl"
            :ajax-request-func="ajaxRequestFunction"
            :pagination="useBtnPagination"
            :pagination-size="size"
            class="col full-width"
          />
          <div class="full-width text-right bg-grey-5 a-border q-pa-xs col-auto">
            <a-btn v-if="canRemoveBoard" label="삭제" @click="deleteBoard" />
            <a-btn v-if="canAddBoard" label="등록" class="q-ml-xs" @click="addBoard" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.t-column {
  background-color: $grey-2;
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
