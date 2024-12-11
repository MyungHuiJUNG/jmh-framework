<script setup>
import { ref, watch, onMounted } from "vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import dept_btn from "components/common/ABtn.vue";
import userApi from "src/js/api/userApi";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const USE = FlowSystemCode.USE_CD.USE;

const columns = [
  {
    title: "#",
    field: "entityId",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
  {
    title: "조직 1depth",
    field: "organization",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    formatter: function (cell) {
      const org = cell.getValue();
      if (org && org.path) {
        return org.path.split(".")[0] || "";
      }
      return "";
    },
  },
  {
    title: "조직 2depth",
    field: "organization",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    formatter: function (cell) {
      const org = cell.getValue();
      if (org && org.path) {
        const parts = org.path.split(".");
        return parts[1] || "";
      }
      return "";
    },
  },
  {
    title: "조직 3depth",
    field: "organization",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    formatter: function (cell) {
      const org = cell.getValue();
      if (org && org.path) {
        const parts = org.path.split(".");
        return parts[2] || "";
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
    title: "사용여부",
    field: "useTypeCode",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
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

const rows = ref([]);
const page = ref(0);

function getUsers(pageNumber) {
  const param = {
    page: pageNumber,
    size: 10,
  };

  return userApi
    .getUsers(param)
    .then((response) => {
      if (response.status === 200) {
        return {
          data: response.data.content,
          last: response.data.last,
        };
      }
    })
    .catch((error) => {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("오류가 발생했습니다. 다시 시도해 주세요.");
      }
    });
}

async function loadInitialData() {
  page.value = 0;
  const result = await getUsers(page.value);
  if (result && result.data.length > 0) {
    console.log(result);
    rows.value = result.data;
    page.value += 1;
  }
}

const lastPage = ref(false);

async function infiniteScroll() {
  try {
    if (!lastPage.value) {
      const result = await getUsers(page.value);
      {
        if (result && result.data) {
          rows.value = [...rows.value, ...result.data];
          page.value += 1;
          lastPage.value = result.last;
        }
      }
    }
  } catch (err) {
    alert("오류가 발생했습니다. 다시 시도해 주세요.");
  }
}

onMounted(() => {
  loadInitialData();
});
</script>

<template>
  <div class="col-auto column no-wrap q-mb-xs q-pa-xs a-border">
    <tabulator-grid
      :rows="rows"
      height="300px"
      :columns="columns"
      @rowSelected="rowSelected"
      :infiniteScroll="infiniteScroll"
      :selectableRows="1"
      class="my-grid"
    />

    <div class="row justify-end q-gutter-xs q-pt-xs">
      <dept_btn label="신규" />
    </div>
  </div>
</template>
