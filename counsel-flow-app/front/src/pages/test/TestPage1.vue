<template>
  <div class="row">
    <div class="col-6">
      <div class="row" id="test">
        <q-btn color="primary" label="Layered Popup" style="width: 100px;" @click="showLayerPopup"/> &nbsp;
        <q-btn color="primary" label="Confirm Popup" style="width: 100px;" @click="showConfirm" /> &nbsp;
        <q-btn color="primary" label="Alert Popup" style="width: 100px;" @click="showAlert('', $event)" /> &nbsp;
        <q-btn color="primary" label="Block" style="width: 100px" @click="showBlock"/>
        <q-btn color="primary" label="Notify" style="width: 100px" @click="showNofity"/>
        <q-btn color="primary" label="Window Popup" style="width: 100px" @click="showWindowPopup"/>

      </div>
    </div>
  </div>

</template>

<script setup>

import AppPopup from "components/common/js/app-popup";
import TestPagePopup from "pages/test/popup/TestPagePopup.vue";
import AppUtil from "components/common/js/app-util";
import TestPageWinPopup from "pages/test/popup/TestPageWinPopup.vue";

function showLayerPopup() {
  AppPopup.openLayered({
    title: "테스트 페이지",
    component: TestPagePopup,
    width: 500,
    height: 500,
    callbackFunc: (result) => {
      console.log(result)
      AppPopup.showAlert('Return Value : ', 'value1: ' + result.test + ", value2: " + result.test1);
    }
  });
}

function showConfirm() {
  AppPopup.showConfirm("알림", "수락하시겠습니까?")
    .yes(() => {
      showAlert("Confirm: Yes");
    })
    .no(() => {
      showAlert("Confirm: No");
  });
}

function showNofity() {
  AppPopup.showNotify("Nofify", {color: 'black', textColor: 'white'});
}

function showAlert(msg, event) {
  let showMsg = "TEST 메세지 입니다."

  if (!AppUtil.isEmpty(msg))
    showMsg = msg;

  AppPopup.showAlert("알림입니당.", showMsg);
}

function showBlock() {
  AppPopup.showBlock("준비중 입니다...", true)

  setTimeout(() =>{
    AppPopup.hideBlock()
  }, 1000);
}

function showWindowPopup() {
  let props = {data1: "1", data2: "2"}
  let options = {
    component: TestPageWinPopup,
    props: props,
    width: 500,
    height: 500
  }
  AppPopup.openWindow(options);
}


</script>

<style scoped>

.row > div {
  padding: 5px;
  border: 1px solid;
}

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
