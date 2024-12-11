<template>
  <div class="row">
    <div class="col-1" style="background-color: #bdbdbd; text-align: center;">
      발행일자
    </div>
    <div class="col-2">
      1
    </div>

    <div class="col-1" style="background-color: #bdbdbd; text-align: center;">
      상담구분
    </div>
    <div class="col-2">
      <q-select class="text-h4 q-select-this" v-model="counselType" :options="items" label="전체" outlined style="width: 100px" @update:model-value="changeBox"/>
    </div>
    <div class="col-1" style="background-color: #bdbdbd; text-align: center;">
      보고자
    </div>
    <div class="col-2">
      ddddddddddd
    </div>
  </div>

  <div class="row">
    <div class="col-1" style="background-color: #bdbdbd; text-align: center;">
      티켓번호
    </div>
    <div class="col-2">
      1
    </div>

    <div id="number" class="col-1" style="background-color: #bdbdbd; text-align: center;">
      전화번호
    </div>
    <div class="col-2">
      2
    </div>
    <div class="col-1" style="background-color: #bdbdbd; text-align: center;">
      담당자
    </div>
    <div class="col-2">
      <q-input outlined dense>
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>
    </div>
  </div>

  <div class="row">
    <div class="col-1" style="background-color: #bdbdbd; text-align: center;">
      티켓유형
    </div>
    <div class="col-2">
      1
    </div>

    <div class="col-1" style="background-color: #bdbdbd; text-align: center;">
      상담유형
    </div>
    <div class="col-2">
      2
    </div>
    <div class="col-1" style="background-color: #bdbdbd; text-align: center;">
      처리상태
    </div>
    <div class="col-2">
      3
    </div>
  </div>

  <div class="row" id="test">
    <q-btn color="primary" label="콜백전달 닫기" style="width: 100px;" @click="saveData"/> &nbsp;
    <q-btn color="primary" label="닫기" style="width: 100px;" @click="close"/> &nbsp;
  </div>
</template>

<script setup>
import {inject, ref, watch} from "vue";


let counselType = ref(null);
const items = ref(['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']);

// let draggable = { type: Boolean, default: true },
// let modelDialog: { type: Boolean, default: false },
// let title: { type: String, default: "Titulo" }

let draggable = ref(true);
let modalDialog = ref(true);
let title = ref("TEST");
let swDialog = ref(false);
let target = null;
let nodeDragg = null;

const emit = defineEmits(["callback", "close"])
function aaa() {
  // depth1 = true;
}

function changeBox(e) {
  console.log("엥?", e)
}


function saveData() {
  emit("callback", {test: "test", test1: "test1"})
}

function close() {
  emit("close");
}

</script>

<style scoped>
.q-select-this {
  height: 28px !important;
  min-height: 28px !important;
}

.row > div {
  padding: 5px;
  border: 1px solid;
}

/* .q-field__control {
  display: flex;
  align-items: center;
  height: 30px;
  font-size: 40px;
} */
.q-btn {
  height: calc($line-height - 4px);
  padding: 0px 8px;
  min-height: 0;
}

:deep(.q-field--standard .q-field__control:before) {
  border: 0px !important;
  outline: none !important;
  padding: 2px !important;
}
:deep(.q-field--auto-height .q-field__control-container) {
  padding-left: 6px !important;
  outline: none !important;
}
:deep(.q-field--auto-height .q-field__control, ) {
  min-height: 32px !important;
  height: 32px !important;
  outline: none !important;
}
:deep(.q-field__marginal) {
  height: 32px !important;
  outline: none !important;
}
:deep(
    .q-field--auto-height .q-field__native,
    .q-field--auto-height .q-field__prefix,
    .q-field--auto-height .q-field__suffix
  ) {
  height: 32px !important;
  min-height: 32px !important;
  outline: none !important;
}

.cursor-move {
  cursor: move;
}
</style>
