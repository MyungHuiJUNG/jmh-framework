<script setup>
import { ref } from "vue";
import AInput from "components/common/AInput.vue";
import { useDialogPluginComponent } from "quasar";
import { showAlert } from "src/js/common/dialog";
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const tel = ref("");

function addTel(num) {
  tel.value = tel.value + "" + num;
}

function backspace() {
  tel.value = tel.value.slice(0, -1);
}

function call() {
  if (/^\d+$/.test(tel.value)) {
    // 숫자만 포함하는지 확인
    onDialogOK(tel.value);
  } else {
    showAlert("전화번호는 숫자만 포함해야 합니다.");
  }
}

function clear() {
  tel.value = "";
}
</script>

<template>
  <q-dialog ref="dialogRef" transition-show="fade" transition-hide="fade">
    <q-card>
      <div class="q-pa-xs column justify-center" style="height: 50px">
        <a-input v-model="tel" @keyup.enter="call" />
      </div>
      <div class="q-mt-xs q-px-xs q-pb-md">
        <div class="row justify-center">
          <q-btn label="1" round @click="addTel('1')" />
          <q-btn label="2" round class="q-ml-xs" @click="addTel('2')" />
          <q-btn label="3" round class="q-ml-xs" @click="addTel('3')" />
        </div>
        <div class="row justify-center q-mt-xs">
          <q-btn label="4" round @click="addTel('4')" />
          <q-btn label="5" round class="q-ml-xs" @click="addTel('5')" />
          <q-btn label="6" round class="q-ml-xs" @click="addTel('6')" />
        </div>
        <div class="row justify-center q-mt-xs">
          <q-btn label="7" round @click="addTel('7')" />
          <q-btn label="8" round class="q-ml-xs" @click="addTel('8')" />
          <q-btn label="9" round class="q-ml-xs" @click="addTel('9')" />
        </div>
        <div class="row justify-center q-mt-xs">
          <q-btn label="*" round @click="addTel('*')" />
          <q-btn label="0" round class="q-ml-xs" @click="addTel('0')" />
          <q-btn label="#" round class="q-ml-xs" @click="addTel('#')" />
        </div>
        <div class="row justify-center q-mt-xs">
          <q-btn icon="close" color="primary" round @click="clear" />
          <q-btn icon="call" color="primary" round class="q-ml-xs" @click="call" />
          <q-btn icon="backspace" color="primary" class="q-ml-xs" round @click="backspace" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped></style>
