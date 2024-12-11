<script setup>
import { useDialogPluginComponent } from "quasar";
import { ref } from "vue";
import ATitleBar from "components/common/ATitleBar.vue";
import ABtn from "components/common/ABtn.vue";
import TabulatorGrid from "../common/TabulatorGrid.vue";
import { showAlert } from "src/js/common/dialog";

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK } = useDialogPluginComponent();

defineProps(["customerInfos"]);

const title = "업체 선택";
const columns = [
  {
    formatter: "rowSelection",
    titleFormatter: null,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: 20,
    resizable: false,
  },
  {
    title: "업체명",
    field: "name",
    headerHozAlign: "center",
    hozAlign: "center",
  },
];

const selectedInfo = ref(null);

function handleRowSelected(row) {
  selectedInfo.value = row[0];
}

function handleRowDeselected() {
  selectedInfo.value = null;
}

function select() {
  if (!selectedInfo.value) {
    showAlert("업체를 선택해주세요.");
    return;
  }
  onDialogOK(selectedInfo.value);
}
</script>

<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large column">
      <a-title-bar :title="title" class="full-width col-auto" />
      <div class="col full-width q-pa-xs column">
        <div class="col column">
          <TabulatorGrid
            class="fit col"
            :rows="$props.customerInfos"
            :columns="columns"
            :selectable-rows="1"
            @row-selected="handleRowSelected"
            @row-deselected="handleRowDeselected"
          />
        </div>
        <div class="col-auto text-right q-mt-xs">
          <a-btn label="선택" @click="select" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-large {
  min-width: 500px;
  min-height: 300px;
}
</style>
