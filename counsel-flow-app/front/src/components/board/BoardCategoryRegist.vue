<script setup>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import ATitleBar from "components/common/ATitleBar.vue";
import BoardCatagory from "src/components/board/BoardCategory.vue";

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const titleBar = ref("");

function chooseCategory(data) {
  onDialogOK(data);
}
</script>

<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss transition-show="fade" transition-hide="fade" class="dialog-ref">
    <q-card class="dialog-body column no-wrap">
      <a-title-bar ref="titleBar" title="카테고리 선택" :close="true" class="col-auto full-width" />
      <div class="col full-width">
        <board-catagory :addChooseButton="true" @chooseCategory="chooseCategory" />
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-body {
  min-width: 300px;
  height: 505px;
}
</style>
