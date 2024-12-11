<template>
  <q-dialog class="custom" ref="dialogRef" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="card" :style="[popupStyle]">
      <!-- css문제로 title 제거 -->
      <component :is="AsyncComp" :propData="propData" @callback="callbackData" @close="close" style="height: 100%"/>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {defineAsyncComponent, getCurrentInstance, onMounted, reactive, ref} from "vue";
import { useDialogPluginComponent } from 'quasar'

const { dialogRef,onDialogOK, onDialogCancel} = useDialogPluginComponent()
const props = defineProps({
  title: String,
  width: Number,
  height: Number,
  position: String,
  top: Number, 
  left: Number,
  component: Object,
  propData: Object,
});

const popupVuePath = ref("");
let popupVueName = ref("");
let fullPath = ref("");


const allPath = import.meta.glob('@/**/*.vue');

onMounted(() => {
  popupVueName.value = props.component.__name;
  popupVuePath.value = popupVuePath.value.replace("/src", "@")
})

const AsyncComp = defineAsyncComponent(() => {
  const matchedComponent = Object.keys(allPath).find(path => path.includes(popupVueName.value));
  if (matchedComponent) {
    // 파일을 비동기적으로 로드하여 Promise 반환
    // return import(allPath[matchedComponent]);
    return allPath[matchedComponent]();
  } else {
    return Promise.reject(new Error(`Component not found: ㅋㅋㅋㅋ`));
  }
})

const popupStyle = reactive({
  'min-width': props.width.toString() + "px",
  'height': props.height.toString() + "px",
  'position': props.position,
  'top': props.top + '%', 
  'left': props.left + '%', 
});

function callbackData(callbackData) {
  onDialogOK(callbackData);
}

function close() {
  onDialogCancel();
}

</script>

<style scoped>

</style>
