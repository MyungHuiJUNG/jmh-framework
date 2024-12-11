<script setup>
import ATitleBar from "../common/ATitleBar.vue";
import ABtn from "../common/ABtn.vue";
import AInput from "../common/AInput.vue";
import ATextarea from "../common/ATextarea.vue";
import { ref } from "vue";
import { useQuasar, useDialogPluginComponent } from "quasar";
import notificationApi from "src/js/api/notificationApi";
import { handleApiError } from "src/js/common/errorHandler";
import UserPopup from "../common/UserPopup.vue";
import { showAlert } from "src/js/common/dialog";

const props = defineProps({
  componentType: {
    type: String,
    default: "write", // "read", "write"
  },
  data: {},
});

const emit = defineEmits(["close", "callback", ...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const $q = useQuasar();
const type = ref(props.componentType);
const title = ref(props.data?.title || null);
const message = ref(props.data?.message || null);
const receiverEntityIds = ref([]);
const receivers = ref();
const sender = ref(`${props.data?.sender?.name} [${props.data?.sender?.id}]` || null);

function clear() {
  title.value = null;
  message.value = null;
  receiverEntityIds.value = [];
  receivers.value = null;
}

function send() {
  if (!receiverEntityIds.value.length) {
    showAlert("받는사람을 지정해주세요.");
    return;
  }
  if (!title.value) {
    showAlert("제목을 입력해주세요.");
    return;
  }
  if (!message.value) {
    showAlert("내용을 입력해주세요.");
    return;
  }
  const param = {
    receiverEntityIds: receiverEntityIds.value,
    entity: {
      title: title.value,
      message: message.value,
    },
  };

  notificationApi
    .sendMessage(param)
    .then((response) => {
      if (response.status === 200) {
        showAlert("발송을 완료했습니다.");
        clear();
        onDialogOK();
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function openUserPopup() {
  $q.dialog({
    component: UserPopup,
    componentProps: {
      selectableRows: true,
      selectableRowsRangeMode: "click",
      enableRowDblClick: true,
    },
  }).onOk((payload) => {
    receivers.value = [];
    receiverEntityIds.value = [];
    let receiversNames = [];
    payload.payload.forEach((user) => {
      receiverEntityIds.value.push(user.entityId);
      receiversNames.push(user.name + ` [${user.id}]`);
    });
    receivers.value = receiversNames.toString();
  });
}

function changeToWrite() {
  type.value = "write";
  receivers.value = `${props.data?.sender?.name} [${props.data?.sender?.id}]`;
  receiverEntityIds.value = [`${props.data?.sender?.entityId}`];
  title.value = null;
  message.value = null;
}
</script>

<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss transition-show="fade" transition-hide="fade" class="column no-wrap">
    <q-card class="dialog-large column no-wrap fit">
      <a-title-bar :title="type === 'write' ? '쪽지 보내기' : '받은 쪽지'" :close="true" class="col-auto full-width" />
      <div class="col column full-width q-pa-xs">
        <div class="col-auto row full-width fixed-height">
          <div class="col-auto t-column text-left top-border-left q-px-xs column justify-center">
            <div class="row" v-if="type === 'write'">
              <q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>받는사람
            </div>
            <div class="row" v-else>보낸사람</div>
          </div>
          <div class="col top-border-right justify-center column q-px-xs">
            <div class="row justify-between" v-if="type === 'write'">
              <a-input v-model="receivers" readonly class="col" />
              <a-btn icon="search" @click="openUserPopup" class="col-auto q-ml-xs" />
            </div>
            <div class="row" v-else>
              <a-input v-model="sender" readonly class="col" />
            </div>
          </div>
        </div>
        <div class="col-auto row fixed-height full-width">
          <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">
            <div class="row">
              <q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red" v-if="type === 'write'">*</q-badge>제목
            </div>
          </div>
          <div class="col body-border-right justify-center text-center column q-px-xs">
            <a-input v-model="title" :readonly="type === 'read' ? true : false" />
          </div>
        </div>
        <div class="col row full-width">
          <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center full-height">
            <div class="row">
              <q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red" v-if="type === 'write'">*</q-badge>내용
              <br /><span>({{ message?.length || 0 }} / 5000자)</span>
            </div>
          </div>
          <div class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height">
            <a-textarea
              v-model="message"
              class="col fit"
              height="100%"
              :readonly="type === 'read' ? true : false"
              maxlength="5000"
            />
          </div>
        </div>

        <div class="col-auto full-width text-right bg-grey-5 a-border q-pa-xs no-wrap q-mt-xs">
          <a-btn label="전송" class="q-ml-xs" @click="send" v-if="type === 'write'" />
          <a-btn label="답장" class="q-ml-xs" @click="changeToWrite" v-else />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-large {
  min-width: 700px;
  max-height: 500px;
}

.a-table,
.a-table tr,
.a-table td {
  border: 1px solid $grey-5;
  border-collapse: collapse;
}

.a-table td {
  padding: 1px map-get($space-xs, x);
  vertical-align: middle;
}

.a-table tr,
.a-table td {
  height: $line-height + 2;
}

.no-underline {
  :deep(.q-field__control:before) {
    border-bottom: none;
  }
}

.fixed-height {
  height: $line-height + 2;
}

.top-border-left {
  border: 1px solid $grey-5;
  border-right: none;
}

.top-border-right {
  border: 1px solid $grey-5;
}

.body-border-left {
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}

.body-border-right {
  border: 1px solid $grey-5;
  border-top: none;
}

.t-column {
  width: 120px;
  background-color: $grey-2;
}
</style>
