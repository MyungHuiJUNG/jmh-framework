<script setup>
import { ref, onMounted, watch } from "vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import ATitleBar from "components/common/ATitleBar.vue";
import ACheckbox from "components/common/ACheckbox.vue";
import { useDialogPluginComponent } from "quasar";
import { showAlert } from "src/js/common/dialog.js";

const props = defineProps({
  codeList: Array,
});

let title = "상위코드 선택"; // 타이틀바 제목
const childRef = ref(null);

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();
const code = ref("");
const useInputValue = ref(false);

const columns = [
  {
    title: "#",
    field: "rownum",
    formatter: "rownum",
    headerHozAlign: "left",
    hozAlign: "left",
    headerSort: false,
    resizable: false,
    width: "9%",
  },
  {
    title: "코드명",
    field: "name",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
  {
    title: "코드",
    field: "code",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
];

const rows = ref([]);

const selectedRows = ref([]);
function rowSelected(selected) {
  selectedRows.value = selected;
}

function getSelectedRow() {
  const selectedData = childRef.value.getSelectedData();

  if (Array.isArray(selectedData) && selectedData.length > 0) {
    const selectedNode = selectedData[0];

    if (selectedNode.entityId == null || selectedNode.entityId < 0) {
      showAlert("해당 코드는 저장후 사용 가능 합니다.");
      return;
    }

    const payload = {
      parentEntityId: selectedNode.entityId,
      path: selectedNode.path,
    };

    onDialogOK({ payload });
  }
}

function handleClick(data) {
  if (data.entityId == null || data.entityId < 0) {
    showAlert("해당 코드는 저장후 사용 가능 합니다.");
    return;
  }

  const payload = {
    parentEntityId: data.entityId,
    path: data.path,
  };

  onDialogOK({ payload });
}

const filteredRows = ref([]);

function search() {
  if (useInputValue.value) {
    applyFilters();
  }
}

function applyFilters() {
  let filteredData = rows.value;

  if (code.value) {
    filteredData = recursiveSearch(filteredData, code.value);
  }

  filteredRows.value = filteredData;

  if (childRef.value) {
    childRef.value.replaceData(filteredRows.value);
  }
}

function recursiveSearch(data, code) {
  return data.reduce((acc, item) => {
    const currentItem = { ...item };
    let match = false;

    if (
      (currentItem.name && currentItem.name.toLowerCase().includes(code.toLowerCase())) ||
      (currentItem.code && currentItem.code.toLowerCase().includes(code.toLowerCase()))
    ) {
      match = true;
    }

    if (currentItem.children && currentItem.children.length > 0) {
      const childResults = recursiveSearch(currentItem.children, code);
      if (childResults.length > 0) {
        match = true;
        currentItem.children = childResults;
      } else if (match) {
        currentItem.children = item.children;
      } else {
        delete currentItem.children;
      }
    }

    if (match) {
      acc.push(currentItem);
    }

    return acc;
  }, []);
}

function reset() {
  useInputValue.value = false;
  code.value = "";
  childRef.value.replaceData(props.codeList);
  filteredRows.value = rows.value;
}

function onCancelClick() {
  onDialogHide();
}

watch(code, (newValue) => {
  if (newValue) {
    useInputValue.value = true;
  }
});

onMounted(() => {
  if (props.codeList) {
    rows.value = JSON.parse(JSON.stringify(props.codeList));
  }
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onCancelClick" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large">
      <a-title-bar :title="title" :close="true" @close="onCancelClick"></a-title-bar>
      <div class="q-pa-xs">
        <table class="my-table a-border full-width">
          <tbody>
            <tr>
              <td class="a-border">
                <div class="row">
                  <a-checkbox v-model="useInputValue"></a-checkbox>
                  <span class="q-ml-xs">코드/코드명</span>
                </div>
              </td>
              <td><a-input class="custom-input" v-model="code" @keyup.enter="search"></a-input></td>
              <td>
                <div class="row q-gutter-xs justify-end">
                  <a-btn label="조회" @click="search"></a-btn><a-btn label="초기화" @click="reset"></a-btn>
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
            :dataTree="true"
            :dataTreeStartExpanded="true"
            :selectableRows="1"
            @rowDblClick="handleClick"
            ref="childRef"
          />
        </q-card-section>

        <div class="row q-pa-xs justify-end">
          <a-btn label="선택" @click="getSelectedRow" />
        </div>
      </div>
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
