<script setup>
import { ref, watch, onMounted, computed } from "vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import dept_btn from "components/common/ABtn.vue";
import userApi from "src/js/api/userApi";
import { useOrganizationStore } from "src/stores/organizationStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert } from "src/js/common/dialog.js";
import { handleApiError } from "src/js/common/errorHandler";
import ATitleBar from "../common/ATitleBar.vue";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const USE = FlowSystemCode.USE_CD.USE;

const organizationStore = useOrganizationStore();
const permissionRoleStore = usePermissionRoleStore();

const useBtnPagination = ref(false);
const ajaxUrl = "/rest/api/v1/user/users";

const emit = defineEmits(["rowClick", "newClick"]);
defineExpose({ loadInitialData, searchUsers, setData });

const canGetUser = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.USER_ROLE.READ));
const canAddUser = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.USER_ROLE.ADD));

const grid = ref("");

function rowSelected() {}

function handleNewClick() {
  grid.value.deselectAllRows();
  emit("newClick");
}

function rowClicked(row) {
  emit("rowClick", row.entityId);
}

const columns = [
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
    field: "organization",
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
    field: "organization",
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
    field: "organization",
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
    field: "name",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
  {
    title: "아이디",
    field: "id",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
  {
    title: "사용여부",
    field: "useTypeCode",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    formatter: function (cell) {
      const value = cell.getValue();
      // 내부 값에 따라 표시할 텍스트를 결정
      const actualValue = value && value.value ? value.value : value;

      return actualValue === USE ? "사용" : "사용 안함";
    },
  },
  {
    title: "CTI ID",
    field: "ctiLoginId",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
  {
    title: "내선번호",
    field: "ctiExtension",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
  },
];

const rows = ref([]);

const page = ref(0);
const size = ref(100);
const isLast = ref(false);
const loading = ref(false);

const searchParam = ref({
  page: page.value,
  size: size.value,
});

async function infiniteScroll() {
  if (useBtnPagination.value) return;
  if (isLast.value) return;

  searchParam.value = {
    ...searchParam.value,
    page: page.value,
  };

  try {
    const response = await userApi.getUsers(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function searchUsers(param) {
  if (!canGetUser.value) {
    showAlert("사용자 조회 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    searchParam.value = {
      ...param,
    };
    setData();
  } else {
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
      ...param,
    };

    loading.value = true;

    return userApi
      .getUsers(searchParam.value)
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
  if (!canGetUser.value) {
    showAlert("사용자 조회 권한이 없습니다.");
    return;
  }

  if (useBtnPagination.value) {
    searchParam.value = {};
  } else {
    page.value = 0;
    searchParam.value = {
      page: page.value,
      size: size.value,
    };

    loading.value = true;

    userApi
      .getUsers(searchParam.value)
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

onMounted(() => {
  loadInitialData();
});

function setData() {
  if (useBtnPagination.value) grid.value.setData();
}
function ajaxRequestFunction(url, config, params) {
  searchParam.value = {
    ...searchParam.value,
    page: params.page - 1, // Tabulator는 1-based, API는 0-based
    size: params.size || size.value,
    isPaging: true, // totalPages 받는 parameter
  };

  return new Promise(function (resolve, reject) {
    userApi
      .getUsers(searchParam.value)
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
  <div class="column no-wrap fit">
    <a-title-bar title="사용자정보" class="col-auto full-width q-mb-xs" />
    <tabulator-grid
      :rows="rows"
      :columns="columns"
      @rowClick="rowClicked"
      @rowSelected="rowSelected"
      @row-deselected="rowSelected"
      :infiniteScroll="infiniteScroll"
      :selectableRows="1"
      :ajax-url="ajaxUrl"
      :ajax-request-func="ajaxRequestFunction"
      :pagination="useBtnPagination"
      :pagination-size="size"
      class="col full-width"
      ref="grid"
    />

    <div class="text-right q-pa-xs col-auto bg-grey-5">
      <dept_btn v-if="canAddUser" label="신규" @click="handleNewClick" />
    </div>
  </div>

  <a-loading-spinner v-model="loading" />
</template>

<style lang="scss" scoped>
.my-table,
.my-table tr,
.my-table td {
  border: 1px solid $grey-5;
  border-collapse: collapse;
}

.my-table td {
  padding: 1px map-get($space-xs, x);
  vertical-align: middle;
}

.my-table td,
.my-table tr {
  height: $line-height + 2px;
}

.select-width {
  flex: 1 1 100px;
}

td:nth-child(1) {
  background-color: $grey-2;
  width: 7%;
}

td:nth-child(2) {
  width: 21%;
}

td:nth-child(3) {
  background-color: $grey-2;
  width: 7%;
}

td:nth-child(4) {
  width: 13%;
}

td:nth-child(5) {
  background-color: $grey-2;
  width: 7%;
}

td:nth-child(6) {
  width: 13%;
}

td:nth-child(7) {
  background-color: $grey-2;
  width: 7%;
}

td:nth-child(8) {
  width: 25%;
}
</style>
