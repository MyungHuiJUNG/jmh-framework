<script setup>
import { ref, onMounted, computed } from "vue";
import { useCodeStore } from "src/stores/codeStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import customerInfoApi from "src/js/api/customerInfoApi";
import AGrid from "components/common/TabulatorGrid.vue";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";

const emit = defineEmits(["rowSelected", "rowDeselected", "rowDeleted"]);
defineExpose({ deleteCustomerInfo, loadInitialData, searchCustomerInfos, setData });

const permissionRoleStore = usePermissionRoleStore();
const codeStore = useCodeStore();

const canGetCustomerInfo = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CUSTOMER_INFO_ROLE.READ));

const loading = ref(false);

const grid = ref(null);
const useBtnPagination = ref(false);
const ajaxUrl = "/rest/api/v1/customer-info/customer-infos";

const columns = [
  {
    title: "#",
    field: "rownum",
    formatter: "rownum",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    resizable: false,
    width: "50",
  },
  {
    title: "회사명",
    field: "name",
    headerHozAlign: "center",
    hozAlign: "center",
  },
  {
    title: "대표번호",
    field: "representativeNumber",
    headerHozAlign: "center",
    hozAlign: "center",
  },
  {
    title: "전화번호1",
    field: "secondaryNumber",
    headerHozAlign: "center",
    hozAlign: "center",
  },
  {
    title: "전화번호2",
    field: "thirdNumber",
    headerHozAlign: "center",
    hozAlign: "center",
  },
  {
    title: "업체담당자",
    field: "managerName",
    headerHozAlign: "center",
    hozAlign: "center",
  },
  {
    title: "고객유형",
    field: "customerTypeCode",
    headerHozAlign: "center",
    hozAlign: "center",
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return codeStore.codes.get(code)?.name ?? code;
    },
  },
  {
    title: "비고",
    field: "note",
    headerHozAlign: "center",
    hozAlign: "center",
  },
];

const rows = ref([]);

const page = ref(0);
const size = ref(100);
const isLast = ref(false);

const searchParam = ref({
  page: page.value,
  size: size.value,
});

function handleSelected(data) {
  emit("rowSelected", data);
}
function handleDeselected() {
  emit("rowDeselected");
}

async function infiniteScroll() {
  if (useBtnPagination.value) return;
  if (isLast.value) return;

  searchParam.value = {
    ...searchParam.value,
    page: page.value,
  };

  try {
    const response = await customerInfoApi.getCustomerInfos(searchParam.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function searchCustomerInfos(param) {
  if (!canGetCustomerInfo.value) {
    showAlert("업체정보 조회 권한이 없습니다.");
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

    return customerInfoApi
      .getCustomerInfos(searchParam.value)
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
  if (!canGetCustomerInfo.value) {
    showAlert("업체정보 조회 권한이 없습니다.");
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

    customerInfoApi
      .getCustomerInfos(searchParam.value)
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

function deleteCustomerInfo(entityId) {
  if (!entityId) return;

  showConfirm("삭제하시겠습니까?").then((res) => {
    if (res) {
      customerInfoApi
        .deleteCustomerInfo(entityId)
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
    customerInfoApi
      .getCustomerInfos(searchParam.value)
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
  <div class="full-height">
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
      class="full-height"
      ref="grid"
    />
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
