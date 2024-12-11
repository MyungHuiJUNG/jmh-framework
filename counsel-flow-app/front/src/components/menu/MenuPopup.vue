<script setup>
import { ref, onMounted } from "vue";
import ATitleBar from "components/common/ATitleBar.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import ABtn from "src/components/common/ABtn.vue";
import { useDialogPluginComponent } from "quasar";
import { showAlert } from "src/js/common/dialog";

const props = defineProps({
  menuList: Array,
});

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const columns = [
  {
    title: "메뉴명",
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

    if (selectedNode.entityId == null || selectedNode.entityId == "") {
      showAlert("다시 시도해주세요.");
      return;
    }

    const payload = {
      parentEntityId: selectedNode.entityId,
      path: selectedNode.path,
    };

    onDialogOK({ payload });
  }
}

function handleDblClick(selectedNode) {
  if (selectedNode.entityId == null || selectedNode.entityId == "") {
    showAlert("다시 시도해주세요.");
    return;
  }

  const payload = {
    parentEntityId: selectedNode.entityId,
    path: selectedNode.path,
  };

  onDialogOK({ payload });
}

function onCancelClick() {
  onDialogHide();
}

onMounted(() => {
  if (props.menuList) {
    rows.value = JSON.parse(JSON.stringify(props.menuList));
  }
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onCancelClick" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large">
      <a-title-bar title="상위메뉴 선택" :close="true" />
      <div class="q-pa-xs">
        <tabulator-grid
          ref="gridRef"
          :rows="rows"
          height="532px"
          :columns="columns"
          class="col full-width"
          :dataTree="true"
          :dataTreeStartExpanded="true"
          :header-visible="false"
          :reactiveData="false"
          @rowDblClick="handleDblClick"
          :selectableRows="1"
        />
        <div class="row q-pa-xs justify-end">
          <a-btn label="선택" @click="getParentEntityId" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-large {
  min-width: 700px;
  min-height: 300px;
}
</style>
