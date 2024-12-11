<script setup>
import AIconBtn from "components/AIconBtn.vue";
import { useDialogPluginComponent } from "quasar";
import { ref, onMounted, onUnmounted } from "vue";
import customerInfoApi from "src/js/api/customerInfoApi";
import { useCodeStore } from "src/stores/codeStore";

const codeStore = useCodeStore();
const props = defineProps(["signalInfo"]);
const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogCancel, onDialogHide } = useDialogPluginComponent();
const TRANSFER = CounselFlowHubVoiceCode.CallType.TRANSFER;
const CONSULT = CounselFlowHubVoiceCode.CallType.CONSULT;
const customerName = ref("미인증고객");
const customerTypeCode = ref();
const note = ref();

const GENERAL = codeStore.codes.get("GENERAL").code;
const VIP = codeStore.codes.get("VIP").code;
const CAUTION = codeStore.codes.get("CAUTION").code;

/**
 * props.signalInfo
{
    "channelType": "IPRON_V5",
    "channelInfo": {
        "id": "agent011",
        "password": "",
        "extension": "2002",
        "state": "PROCESS",
        "subState": 0,
        "callInfo": {
            "callType": "NORMAL",
            "callId": 100004,
            "direction": "IB", // 인입경로 IB : 인바운드, OB : 아웃바운드
            "callerId": "2003", // 발신번호
            "calledId": "2002", // 수신번호
            "extraData": {
                "ucid": "AE701160-F577-4311-BA53-EA22A3608ECE"
            },
            "connectionId": "6bca0b110c1f41",
            "xferCallId": null,
            "xferDirection": null,
            "xferCallerId": "",
            "xferCalledId": "",
            "xferExtraData": null,
            "xferConnectionId": null
        },
        "callInfos": []
    },
    "expiredDate": "2024-10-11T08:12:08.000Z"
}
 */

onMounted(() => {
  getCustomerInfo();
});

onUnmounted(() => {
  console.log("unmounted");
});

function getCustomerInfo() {
  if (props.signalInfo.channelInfo.callInfo.callType === CONSULT) return;

  let tel = null;
  if (props.signalInfo.channelInfo.callInfo.callType === TRANSFER)
    tel = props.signalInfo.channelInfo.callInfo.xferCallerId;
  else tel = props.signalInfo.channelInfo.callInfo.callerId;

  if (!tel) return;

  const param = {};
  param["searchTel"] = tel;
  customerInfoApi.getCustomerInfos(param).then((response) => {
    if (response.status === 200) {
      const result = response.data;
      if (result.length) {
        if (result[0].name) customerName.value = result[0].name;
        if (result[0].customerTypeCode) customerTypeCode.value = result[0].customerTypeCode;
        if (result[0].note) note.value = result[0].note;
      }
    }
  });
}

function getCustomerTypeName(code) {
  return codeStore.codes.get(code)?.name || code;
}

function okClicked() {
  onDialogOK();
}

function cancelClicked() {
  onDialogHide();
}
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
    transition-show="fade"
    transition-hide="fade"
    class="row"
    @keyup.enter="okClicked"
  >
    <q-card class="dialog-body row col-auto">
      <div class="col-5 full-height"></div>
      <div class="col-7 column q-pa-xl full-height">
        <div class="col-2 full-width"></div>
        <div class="full-width col column q-pa-lg bg-grey-2 no-wrap border-radius-10">
          <div class="col-auto row items-center full-width">
            <span class="name q-mr-xl">{{
              signalInfo?.channelInfo?.callInfo?.callType === CONSULT ? "협의 전화" : customerName
            }}</span>
            <span class="tel">
              {{
                signalInfo?.channelInfo?.callInfo?.callType === TRANSFER
                  ? signalInfo?.channelInfo?.callInfo?.xferCallerId
                  : signalInfo?.channelInfo?.callInfo?.callerId
              }}
            </span>
          </div>
          <div class="row q-mt-sm col full-width">
            <div class="col row items-center full-height">
              <span class="note fit">{{ note }}</span>
            </div>
            <div class="col-auto row items-center justify-end full-height">
              <!-- 일반고객 -->
              <a-icon-btn
                :label="getCustomerTypeName(customerTypeCode)"
                icon="mood"
                v-if="customerTypeCode === GENERAL"
              />
              <!-- 주의고객 -->
              <a-icon-btn
                :label="getCustomerTypeName(customerTypeCode)"
                icon="warning"
                v-else-if="customerTypeCode === CAUTION"
              />
              <!-- VIP -->
              <a-icon-btn
                :label="getCustomerTypeName(customerTypeCode)"
                icon="stars"
                v-else-if="customerTypeCode === VIP"
              />
              <a-icon-btn :label="getCustomerTypeName(customerTypeCode)" icon="mood" v-else />
            </div>
          </div>
          <div class="col-auto q-mt-sm text-right full-width">
            <q-btn icon="call" label="Click to Answer" @click="okClicked" color="primary" />
            <q-btn label="거절" @click="cancelClicked" color="primary" class="q-ml-sm" />
          </div>
        </div>
        <div class="col-2 full-width"></div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-body {
  width: 70%;
  height: 70%;
  background-color: rgba(0, 0, 0, 0.3);
  background-image: url("/src/assets/images/call/flipped_image.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: overlay;
}

.border-radius-10 {
  border-radius: 10px;
}

.name {
  font-size: 2vw;
}

.tel {
  font-size: 1.5vw;
}

.note {
  font-size: 1.4vw;
  overflow: auto;
}
</style>
