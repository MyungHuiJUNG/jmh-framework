<script setup>
import { ref, onMounted, watch } from "vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import ATitleBar from "components/common/ATitleBar.vue";
import ACheckbox from "components/common/ACheckbox.vue";
import { useDialogPluginComponent } from "quasar";
import permissionApi from "src/js/api/permissionApi";
import { handleApiError } from "src/js/common/errorHandler";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";

let title = "권한 선택";
const childRef = ref(null);

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK } = useDialogPluginComponent();

const permissionName = ref("");
const usePermissionName = ref(false);

const columns = [
  {
    title: "#",
    field: "entityId",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: "5%",
  },
  {
    title: "권한명",
    field: "name",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
];

const rows = ref([]);

const page = ref(0);
const SIZE = 100;
const isLast = ref(false);
const loading = ref(false);

const searchParam = ref({
  page: page.value,
  size: SIZE,
});

const selectedRows = ref([]);
function rowSelected(selected) {
  selectedRows.value = selected;
}

function getSelectedRow() {
  const selectedData = childRef.value.getSelectedData();

  if (Array.isArray(selectedData) && selectedData.length > 0) {
    const payload = {
      entityId: selectedData[0].entityId,
      name: selectedData[0].name,
    };

    onDialogOK({ payload });
  }
}

function handleClick(data) {
  const payload = {
    entityId: data.entityId,
    name: data.name,
  };

  onDialogOK({ payload });
}

function saveSearchParams() {
  const param = {};

  if (usePermissionName.value && permissionName.value) param.permissionName = permissionName.value;

  searchPermissions(param);
}

async function infiniteScroll() {
  if (isLast.value) return;

  searchParam.value = {
    ...searchParam.value,
    page: page.value,
  };

  try {
    const response = await permissionApi.getPermissions(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function searchPermissions(param) {
  page.value = 0;
  searchParam.value = {
    page: page.value,
    size: SIZE,
    ...param,
  };

  loading.value = true;

  return permissionApi
    .getPermissions(searchParam.value)
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

function loadInitialData() {
  page.value = 0;
  searchParam.value = {
    page: page.value,
    size: SIZE,
  };

  loading.value = true;

  permissionApi
    .getPermissions(searchParam.value)
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

function reset() {
  permissionName.value = "";
  usePermissionName.value = false;
}

watch(permissionName, (newValue) => {
  if (newValue) {
    usePermissionName.value = true;
  }
});

onMounted(() => {
  setTimeout(() => {
    loadInitialData();
  }, 100);
});
</script>

<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large">
      <a-title-bar :title="title" :close="true"></a-title-bar>
      <div class="q-pa-xs">
        <table class="my-table a-border full-width">
          <tbody>
            <tr>
              <td class="a-border">
                <div class="row">
                  <a-checkbox v-model="usePermissionName" label="권한명"></a-checkbox>
                </div>
              </td>
              <td><a-input class="custom-input" v-model="permissionName" @keyup.enter="saveSearchParams"></a-input></td>
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
            :columns="columns"
            height="500px"
            @rowSelected="rowSelected"
            :infiniteScroll="infiniteScroll"
            :selectableRows="1"
            @rowDblClick="handleClick"
            ref="childRef"
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
    width: 20%;
  }

  td:nth-child(2) {
    width: 30%;
  }

  .row {
    display: flex;
    align-items: center;
  }
}
</style>
