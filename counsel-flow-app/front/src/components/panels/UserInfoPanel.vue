<script setup>
import ABtn from "components/common/ABtn.vue";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { getCurrentInstance } from "vue";
import { useQuasar } from "quasar";
import SendSmsPopup from "../chemp/SendSmsPopup.vue";
import ACallBtn from "../common/ACallBtn.vue";

const $q = useQuasar();
const emitter = getCurrentInstance().appContext.config.globalProperties.$emitter;
defineProps(["customerInfo"]);

function call(tel) {
  if (!tel) return;
  // showConfirm("전화를 거시겠습니까?").then((res) => {
  //   if (res) emitter.emit("dial", tel);
  // });
}

function openSendSmsPopup() {
  $q.dialog({
    component: SendSmsPopup,
  }).onOk(() => {
    showAlert("발송을 완료했습니다.");
  });
}
</script>

<template>
  <div class="column fit">
    <div class="col full-width">
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
          <div class="row">업체명</div>
        </div>
        <div class="col top-border-right justify-center column q-px-xs">
          <div class="row justify-between full-width">
            <span>{{ $props?.customerInfo?.name }}</span>
            <a-btn label="업체조회" />
          </div>
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">대표번호</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <div class="row justify-between full-width">
            <span>{{ $props?.customerInfo?.representativeNumber }}</span>
            <a-call-btn @click="call($props?.customerInfo?.representativeNumber)" />
          </div>
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">전화번호1</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <div class="row justify-between full-width">
            <span>{{ $props?.customerInfo?.secondaryNumber }}</span>
            <a-call-btn @click="call($props?.customerInfo?.secondaryNumber)" />
          </div>
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">전화번호2</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <div class="row justify-between full-width">
            <span>{{ $props?.customerInfo?.thirdNumber }}</span>
            <a-call-btn @click="call($props?.customerInfo?.thirdNumber)" />
          </div>
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">담당자</div>
        <div class="col body-border-right justify-center column q-px-xs">{{ $props?.customerInfo?.managerName }}</div>
      </div>
    </div>
    <div class="col-auto q-mt-xs full-width">
      <a-btn label="SMS발송" @click="openSendSmsPopup" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-border-left {
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}

.body-border-right {
  border: 1px solid $grey-5;
  border-top: none;
}

.top-border-left {
  border: 1px solid $grey-5;
  border-right: none;
}

.top-border-right {
  border: 1px solid $grey-5;
}

.t-column {
  width: 90px;
  background-color: $grey-2;
}

.fixed-height {
  height: $line-height + 2;
}

.detail {
  width: 400px;
}

.b-border {
  border-right: 1px solid $grey-5;
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}
</style>
