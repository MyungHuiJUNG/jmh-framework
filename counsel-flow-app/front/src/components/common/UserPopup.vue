<script setup>
import { ref, onMounted, watch, computed } from "vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import ATitleBar from "components/common/ATitleBar.vue";
import ACheckbox from "components/common/ACheckbox.vue";
import ASelect from "./ASelect.vue";
import { useDialogPluginComponent } from "quasar";
import { useOrganizationStore } from "src/stores/organizationStore";
import { handleApiError } from "src/js/common/errorHandler";
import userApi from "src/js/api/userApi";
import ALoadingSpinner from "./ALoadingSpinner.vue";

const props = defineProps({
  selectableRows: {
    type: [Boolean, Number],
    default: 1,
  },
  selectableRowsRangeMode: {
    type: [Boolean, String], // "click" - 컨트롤, 쉬프트로 복수 선택모드
    default: false,
  },
  enableRowDblClick: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "사용자 선택",
  },
});

const organizationStore = useOrganizationStore();
const useBtnPagination = ref(false);
const ajaxUrl = "/rest/api/v1/user/users";

// let title = "사용자 선택";
const grid = ref(null);
const userName = ref("");
const userId = ref("");
const extensionNumber = ref("");
const org1Options = ref(
  computed(() => {
    return [
      { name: "전체", value: null },
      ...organizationStore.organizationArray.map((item) => ({
        name: item.name,
        value: item,
      })),
    ];
  })
);
const org2Options = ref([{ name: "전체", value: null }]);
const org3Options = ref([{ name: "전체", value: null }]);
const org1 = ref(null);
const org2 = ref(null);
const org3 = ref(null);
const useUserName = ref(false);
const useOrg = ref(false);
const useUserId = ref(false);
const useExtensionNumber = ref(false);

const emit = defineEmits(["close", "callback", ...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const listColumns = [
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
    headerSort: false,
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
    headerSort: false,
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
    headerSort: false,
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
    headerSort: false,
  },
  {
    title: "아이디",
    field: "id",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
  {
    title: "내선번호",
    field: "ctiExtension",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
];

const managerColumns = [
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
    headerSort: false,
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
    headerSort: false,
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
    headerSort: false,
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
    headerSort: false,
  },
  {
    title: "아이디",
    field: "id",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
  {
    title: "내선번호",
    field: "ctiExtension",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
];

const selectedRows = ref([]);
function rowSelected(selected) {
  selectedRows.value = selected;
}

watch(
  org1Options,
  (newOptions) => {
    if (newOptions.length) org1.value = null;
  },
  { immediate: true }
);

watch(
  org1,
  (newVal) => {
    if (newVal) {
      useOrg.value = true;
      org2Options.value = [
        { name: "전체", value: null },
        ...organizationStore
          .getChildrenOrganizationsByTopParentCodeValue(newVal.code)
          .map((item) => ({ name: item.name, value: item })),
      ];
      org2.value = null;
      org3.value = null;
    } else {
      useOrg.value = false;
      org2Options.value = [{ name: "전체", value: null }];
      org3Options.value = [{ name: "전체", value: null }];
      org2.value = null;
      org3.value = null;
    }
  },
  { immediate: true }
);

watch(
  org2,
  (newVal) => {
    if (newVal) {
      org3Options.value = [
        { name: "전체", value: null },
        ...organizationStore
          .getChildrenOrganizationsByTopParentCodeValue(newVal.code)
          .map((item) => ({ name: item.name, value: item })),
      ];
      org3.value = null;
    } else {
      org3Options.value = [{ name: "전체", value: null }];
      org3.value = null;
    }
  },
  { immediate: true }
);

function saveSearchParams() {
  const param = {};

  if (useOrg.value) {
    if (org1.value) param.organizationPath = org1.value.code;
    if (org2.value) param.organizationPath += `.${org2.value.code}`;
    if (org3.value) param.organizationPath += `.${org3.value.code}`;
  }

  if (useUserName.value && userName.value?.trim()) param["entity.name"] = userName.value.trim();
  if (useUserId.value && userId.value?.trim()) param["entity.id"] = userId.value.trim();
  if (useExtensionNumber.value && extensionNumber.value?.trim())
    param["entity.ctiExtension"] = extensionNumber.value.trim();

  searchUsers(param);
}

function getSelectedRow() {
  const selectedData = grid.value.getSelectedData();

  if (Array.isArray(selectedData) && selectedData.length > 0) {
    const payload = selectedData.map((row) => ({
      entityId: row.entityId,
      name: row.name,
      id: row.id,
    }));

    onDialogOK({ payload });
  }
}

function handleClick(data) {
  const payload = [
    {
      entityId: data.entityId,
      name: data.name,
      id: data.id,
    },
  ];

  onDialogOK({ payload });
}

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

watch(userName, (newValue) => {
  if (newValue) {
    useUserName.value = true;
  } else {
    useUserName.value = false;
  }
});

watch(userId, (newValue) => {
  if (newValue) {
    useUserId.value = true;
  } else {
    useUserId.value = false;
  }
});

watch(extensionNumber, (newValue) => {
  if (newValue) {
    useExtensionNumber.value = true;
  } else {
    useExtensionNumber.value = false;
  }
});

function reset() {
  userName.value = "";
  userId.value = "";
  extensionNumber.value = "";
  org1.value = null;

  useUserName.value = false;
  useUserId.value = false;
  useOrg.value = false;
  useExtensionNumber.value = false;
}

onMounted(() => {
  setTimeout(() => {
    loadInitialData();
  }, 100);
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
  <q-dialog ref="dialogRef" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large">
      <a-title-bar :title="title" :close="true"></a-title-bar>
      <div class="q-pa-xs">
        <table class="my-table a-border full-width">
          <tbody>
            <tr class="a-border">
              <td class="a-border">
                <div class="row">
                  <a-checkbox v-model="useUserName" label="사용자명"></a-checkbox>
                </div>
              </td>
              <td><a-input class="custom-input" v-model="userName" @keyup.enter="saveSearchParams"></a-input></td>
              <td class="a-border">
                <div class="row">
                  <a-checkbox v-model="useOrg" label="조직"></a-checkbox>
                </div>
              </td>
              <td>
                <div class="row full-width no-wrap">
                  <a-select
                    class="select-width text-no-wrap"
                    v-model="org1"
                    :options="org1Options"
                    option-label="name"
                  />
                  <a-select
                    class="select-width text-no-wrap"
                    v-model="org2"
                    :options="org2Options"
                    option-label="name"
                  />
                  <a-select
                    class="select-width text-no-wrap"
                    v-model="org3"
                    :options="org3Options"
                    option-label="name"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td class="a-border">
                <div class="row">
                  <a-checkbox v-model="useUserId" label="아이디"></a-checkbox>
                </div>
              </td>
              <td><a-input class="custom-input" v-model="userId" @keyup.enter="saveSearchParams"></a-input></td>
              <td class="a-border">
                <div class="row">
                  <a-checkbox v-model="useExtensionNumber" label="내선번호"></a-checkbox>
                </div>
              </td>
              <td>
                <a-input class="custom-input" v-model="extensionNumber" @keyup.enter="saveSearchParams"></a-input>
              </td>
              <td>
                <div class="row q-gutter-xs justify-end">
                  <a-btn label="조회" @click="saveSearchParams"></a-btn><a-btn label="초기화" @click="reset"></a-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <q-card-section>
          <tabulator-grid
            :rows="rows"
            :columns="managerColumns"
            :infiniteScroll="infiniteScroll"
            height="500px"
            @rowSelected="rowSelected"
            :selectableRows="selectableRows"
            :selectableRowsRangeMode="selectableRowsRangeMode"
            ref="grid"
            v-if="props.enableRowDblClick"
            @rowDblClick="handleClick"
            :ajax-url="ajaxUrl"
            :ajax-request-func="ajaxRequestFunction"
            :pagination="useBtnPagination"
            :pagination-size="size"
          />

          <tabulator-grid
            v-else
            :rows="rows"
            :columns="listColumns"
            :infiniteScroll="infiniteScroll"
            height="500px"
            @rowSelected="rowSelected"
            :selectableRows="selectableRows"
            :selectableRowsRangeMode="selectableRowsRangeMode"
            :ajax-url="ajaxUrl"
            :ajax-request-func="ajaxRequestFunction"
            :pagination="useBtnPagination"
            :pagination-size="size"
            ref="grid"
          />
        </q-card-section>

        <div class="row q-pa-xs justify-end">
          <a-btn label="선택" @click="getSelectedRow" />
        </div>
      </div>

      <a-loading-spinner v-model="loading" />
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.no-wrap {
  white-space: nowrap;
}

.q-card__section {
  padding: 0px;
}

.dialog-large {
  min-width: 700px;
  min-height: 300px;
}

.my-table {
  border-collapse: collapse;

  td {
    padding: 2px;
    vertical-align: middle;
  }

  td:nth-child(1) {
    background-color: $grey-2;
    width: 13%;
  }

  td:nth-child(2) {
    width: 25%;
  }

  td:nth-child(3) {
    background-color: $grey-2;
    width: 13%;
  }

  td:nth-child(4) {
    width: 25%;
  }

  .row {
    display: flex;
    align-items: center;
  }
}

.select-width {
  flex: 1 1 100px;
  width: 70px;
  min-width: 70px;
}
</style>
