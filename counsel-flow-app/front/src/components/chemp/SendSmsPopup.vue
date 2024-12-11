<script setup>
import { useDialogPluginComponent } from "quasar";
import ATitleBar from "../common/ATitleBar.vue";
import ATextarea from "../common/ATextarea.vue";
import ABtn from "../common/ABtn.vue";
import AInput from "../common/AInput.vue";
import { ref, computed, watch } from "vue";
import chempApi from "src/js/api/chempApi";
import { handleApiError } from "src/js/common/errorHandler";
import { showAlert } from "src/js/common/dialog";

const emit = defineEmits(["close", "callback", ...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

// title 기본은 제목없음

const smsType = ref(4); // SMS : 4, LMS : 6
const senderNumber = ref("15445000"); // 발신번호 : 대표번호값
const receiverType = ref("MBER"); // XCL, SYSTEM, MBER, PLUS
const receiverNumber = ref(); // 수신번호 : 직접입력
const subject = ref("제목없음"); // LMS시 제목
const contents = ref("");
const usable = ref(true);

const smsTypeText = computed(() => {
  if (smsType.value === 4) {
    return "SMS";
  } else if (smsType.value === 6) {
    return "LMS";
  } else {
    return "Unknown";
  }
});
const byteLength = ref(0);
const byteMaxLength = computed(() => {
  if (smsType.value === 4) {
    return 80;
  } else if (smsType.value === 6) {
    return 2000;
  } else {
    return -1;
  }
});

const sendType = ref("msg"); // msg, alimTalk

watch(
  byteLength,
  (newVal) => {
    if (newVal < 80) smsType.value = 4;
    else smsType.value = 6;
  },
  {
    immediate: true,
  }
);

function sendMessage() {
  if (byteLength.value > byteMaxLength.value) {
    showAlert("입력가능한 bytes를 초과했습니다.");
    return;
  }
  if (!contents.value?.trim()) {
    showAlert("내용을 입력해주세요.");
    return;
  }
  if (!receiverNumber.value?.trim()) {
    showAlert("수신번호를 입력해주세요.");
    return;
  }
  if (receiverNumber.value && !isNumeric(receiverNumber.value)) {
    showAlert("수신번호는 숫자만 입력해주세요.");
    return;
  }

  const params = {};

  params["entity.smsType"] = smsType.value;
  params["entity.senderNumber"] = senderNumber.value;
  params["entity.receiverType"] = receiverType.value;
  params["entity.receiverNumber"] = receiverNumber.value;
  if (smsType.value === 6) params["entity.subject"] = subject.value;
  params["entity.contents"] = contents.value;
  params["entity.usable"] = usable.value;

  chempApi
    .sendMessage(params)
    .then((response) => {
      onDialogOK();
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function calculateBytes(str) {
  return new Blob([str]).size;
}

function updateByteLength() {
  byteLength.value = calculateBytes(contents.value);
}

function isNumeric(str) {
  const regex = /^\d+$/;
  return regex.test(str);
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large column no-wrap">
      <a-title-bar title="문자발송" :close="true" class="col-auto full-width" />
      <div class="column col full-width q-pa-xs">
        <div class="col-auto row full-width">
          <div class="col-auto fixed-height t-column q-pa-xs left-border">발송유형</div>
          <div class="col row fixed-height q-pa-xs a-border">
            <q-radio v-model="sendType" val="msg" label="문자발송" dense />
            <q-radio v-model="sendType" val="alimTalk" label="알림톡" class="q-ml-xs" dense disable />
          </div>
        </div>
        <div class="col full-width q-pa-xs column q-mt-xs a-border">
          <ATextarea class="col" height="100%" v-model="contents" @input="updateByteLength" />
          <div class="col-auto row justify-between">
            <span>{{ smsTypeText }}</span>
            <span>{{ byteLength }}/{{ byteMaxLength }}bytes</span>
          </div>
        </div>
        <div class="col-auto row full-width q-mt-xs">
          <div class="col-auto fixed-height t-column q-pa-xs left-border">수신번호</div>
          <div class="col q-px-xs fixed-height column justify-center a-border">
            <a-input v-model="receiverNumber" />
          </div>
        </div>
        <div class="col-auto row full-width">
          <div class="col-auto fixed-height t-column q-pa-xs bottom-left-border">발신번호</div>
          <div class="col q-px-xs fixed-height column justify-center bottom-right-border">
            <a-input disable v-model="senderNumber" />
          </div>
        </div>
        <div class="col-auto full-width text-right q-mt-xs q-pa-xs">
          <a-btn label="발송" @click="sendMessage" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-large {
  min-width: 400px;
  height: 600px;
}
.fixed-height {
  height: $line-height + 2;
}
.t-column {
  background-color: $grey-2;
}
.left-border {
  border: 1px solid $grey-5;
  border-right: none;
}
.bottom-left-border {
  border: 1px solid $grey-5;
  border-right: none;
  border-top: none;
}
.bottom-right-border {
  border: 1px solid $grey-5;
  border-top: none;
}
</style>
