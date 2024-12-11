<script setup>
import { ref, onMounted } from "vue";
import ATitleBar from "components/common/ATitleBar.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import ABtn from "src/components/common/ABtn.vue";
import { useDialogPluginComponent } from "quasar";
import { showAlert } from "src/js/common/dialog";

const props = defineProps({
  categoryList: Array,
});

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const columns = [
  {
    title: "카테고리명",
    field: "name",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: false,
  },
];

const rows = ref([]);
const gridRef = ref([]);

function getParentEntityId() {
  const selectedData = gridRef.value.getSelectedData();

  if (Array.isArray(selectedData) && selectedData.length > 0) {
    const selectedNode = selectedData[0];

    if ((selectedNode.entityId == null || selectedNode.entityId == "") && selectedNode.name !== "전체") {
      showAlert("해당 카테고리는 저장후 사용 가능 합니다.");
      return;
    }

    const parentEntityId = selectedNode.entityId;

    onDialogOK({ parentEntityId });
  }
}

function handleDblClick(selectedNode) {
  if ((selectedNode.entityId == null || selectedNode.entityId == "") && selectedNode.name !== "전체") {
    showAlert("해당 카테고리는 저장후 사용 가능 합니다.");
    return;
  }

  const parentEntityId = selectedNode.entityId;

  onDialogOK({ parentEntityId });
}

onMounted(() => {
  if (props.categoryList) {
    rows.value = JSON.parse(JSON.stringify(props.categoryList));
  }
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large column no-wrap">
      <a-title-bar title="카테고리 이동" :close="true" class="col-auto full-width" />
      <div class="q-pa-xs column col full-width no-wrap">
        <tabulator-grid
          ref="gridRef"
          :rows="rows"
          :columns="columns"
          class="col full-width"
          :dataTree="true"
          :dataTreeStartExpanded="true"
          :header-visible="false"
          :reactiveData="false"
          @rowDblClick="handleDblClick"
          :selectableRows="1"
        />
        <div class="row q-pa-xs justify-between full-width col-auto">
          <span style="color: red; font-weight: bold">선택한 카테고리의 하위로 이동합니다.</span>
          <a-btn label="선택" @click="getParentEntityId" class="q-ml-xs" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-large {
  min-width: 500px;
  height: 500px;
}
</style>
