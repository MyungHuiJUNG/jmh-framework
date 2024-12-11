<script setup>
import { useDialogPluginComponent } from "quasar";

const props = defineProps({
  msg: {
    type: [String, null],
  },
  showOkButton: {
    type: Boolean,
    default: true,
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
});

defineEmits([
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

function onOKClick() {
  onDialogOK();
}
</script>


<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" @keyup.enter="onDialogOK">
    <q-card class="q-dialog-plugin">
      <q-card-section class="q-mt-md text-center q-pt-none" style="white-space: pre-wrap;">
        {{ msg }}
      </q-card-section>
      <q-card-actions class="row q-gutter-md" align="center">
        <q-btn v-if="showOkButton" color="primary" :label="showCancelButton ? '예' : '확인'" @click="onOKClick" />
        <q-btn v-if="showCancelButton" color="negative" label="아니요" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
