<script setup>
import { ref, onMounted, getCurrentInstance, onUnmounted, computed } from "vue";
import { useDialogPluginComponent } from "quasar";
import ATitleBar from "components/common/ATitleBar.vue";
import userApi from "src/js/api/userApi";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import { useOrganizationStore } from "src/stores/organizationStore";
import { showAlert } from "src/js/common/dialog";
import { useQuasar } from "quasar";
import { handleApiError } from "src/js/common/errorHandler";

// const props = defineProps(["channel"]);
const $q = useQuasar();
const emitter = getCurrentInstance().appContext.config.globalProperties.$emitter;
const channel = getCurrentInstance().appContext.config.globalProperties.$channel;
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const orgStore = useOrganizationStore();
const title = "호전환";
const userName = ref();
const rows = ref([]);
const ctiExtension = ref("");
const isConsultCallActive = ref(false);
const connectBtnLabel = ref("연결");

const columns = [
  {
    title: "사용자명",
    field: "entityId",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    formatter: function (row) {
      const data = row.getData();
      return data.name + ` [${data.id}]`;
    },
  },
  {
    title: "내선",
    field: "ctiExtension",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
  },
  {
    title: "조직(대)",
    field: "organization",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    formatter: function (cell) {
      const path = cell.getValue()?.path || null;
      if (!path) return null;
      const pathArray = path.split(".");
      return orgStore.organizations.get(pathArray[0])?.name ?? pathArray[0];
    },
  },
  {
    title: "조직(중)",
    field: "organization",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    formatter: function (cell) {
      const path = cell.getValue()?.path || null;
      if (!path) return null;
      const pathArray = path.split(".");
      if (pathArray.length < 2) return null;
      return orgStore.organizations.get(pathArray[1])?.name ?? pathArray[1];
    },
  },
  {
    title: "조직(소)",
    field: "organization",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    formatter: function (cell) {
      const path = cell.getValue()?.path || null;
      if (!path) return null;
      const pathArray = path.split(".");
      if (pathArray.length < 3) return null;
      return orgStore.organizations.get(pathArray[2])?.name ?? pathArray[2];
    },
  },
];

const page = ref(0);
const SIZE = 100;
const isLast = ref(false);
const searchParams = ref({});
const state = ref(computed(() => channel?.channelInfo?.state || null));
const callType = ref(computed(() => channel?.channelInfo?.callInfo?.callType || null));

onMounted(() => {
  getUsers();
  checkConsultCallStatus();
  emitter.on("consultCallRequested", handleConsultCallRequested);
  emitter.on("consultCallResponse", checkConsultCallResponse);
});

onUnmounted(() => {
  emitter.off("consultCallRequested", handleConsultCallRequested);
  emitter.off("consultCallResponse", checkConsultCallResponse);
});

// 협의전화중일 경우에 상태 반영
function checkConsultCallStatus() {
  if (
    state.value === CounselFlowHubVoiceCode.ChannelState.ACTIVE &&
    callType.value === CounselFlowHubVoiceCode.CallType.CONSULT
  ) {
    checkConsultCallResponse(true);
  }
}

function getUsers(userName) {
  page.value = 0;

  searchParams.value = {
    page: page.value,
    size: SIZE,
  };

  if (userName) searchParams.value["entity.name"] = userName.trim();

  userApi
    .getUsers(searchParams.value)
    .then((response) => {
      if (response.status === 200) {
        rows.value = response.data.content;
        isLast.value = response.data.last;
        page.value += 1;
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function searchUser() {
  getUsers(userName.value);
}

function resetSearch() {
  userName.value = null;
  getUsers();
}

async function infiniteScroll() {
  if (isLast.value) return;

  searchParams.value = {
    ...searchParams.value,
    page: page.value,
  };

  try {
    const response = await userApi.getUsers(searchParams.value);

    if (response.status === 200) {
      rows.value = [...rows.value, ...response.data.content];
      isLast.value = response.data.last;
      page.value += 1;
    }
  } catch (error) {
    handleApiError(error);
  }
}

function rowClicked(data) {
  ctiExtension.value = data.ctiExtension;
}

function consult() {
  if (!ctiExtension.value) {
    showAlert("내선번호를 선택 또는 입력해주세요.");
    return;
  }

  if (/^\d+$/.test(ctiExtension.value)) {
    emitter.emit("makeConsultCall", ctiExtension.value);
  } else {
    showAlert("내선번호는 숫자만 포함해야 합니다.");
  }
}

function transfer() {
  if (!ctiExtension.value) {
    showAlert("내선번호를 선택 또는 입력해주세요.");
    return;
  }
  const payload = {
    callType: CounselFlowHubVoiceCode.CallType.TRANSFER,
    dial: ctiExtension.value,
  };
  onDialogOK(payload);
}

function retrieve() {
  const payload = { callType: "retrieve" };
  onDialogOK(payload);
}

function conference() {
  if (!ctiExtension.value) {
    showAlert("내선번호를 선택 또는 입력해주세요.");
    return;
  }
  const payload = {
    callType: CounselFlowHubVoiceCode.CallType.CONFERENCE,
    dial: ctiExtension.value,
  };
  onDialogOK(payload);
}

function handleConsultCallRequested() {
  connectBtnLabel.value = "연결중";
  showLoading();
}

function checkConsultCallResponse(response) {
  isConsultCallActive.value = response;
  if (response) connectBtnLabel.value = "협의통화중";
  else connectBtnLabel.value = "연결";
  hideLoading();
}

function showLoading() {
  $q.loading.show({
    message: "협의전화 요청중입니다.",
    boxClass: "bg-grey-2 text-grey-9",
    spinnerColor: "primary",
  });
}

function hideLoading() {
  if ($q.loading.isActive) $q.loading.hide();
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large column full-width">
      <a-title-bar :close="true" :title="title" class="col-auto full-width" />

      <div class="q-pa-xs col column">
        <div class="a-border q-pa-xs column full-width col">
          <div class="row justify-between col-auto q-mb-xs flex-center">
            <div class="row">
              <div class="t-column q-pa-xs text-center">사용자명</div>
              <div class="q-pa-xs t-border"><a-input v-model="userName" @keyup.enter="searchUser" /></div>
            </div>
            <div class="text-right">
              <a-btn label="조회" @click="searchUser" />
              <a-btn label="초기화" @click="resetSearch" class="q-ml-xs" />
            </div>
          </div>
          <TabulatorGrid
            :rows="rows"
            :columns="columns"
            :selectable-rows="1"
            class="full-width"
            height="450px"
            :infinite-scroll="infiniteScroll"
            @row-click="rowClicked"
          />
        </div>
        <div class="row justify-between full-width col-auto q-pa-xs">
          <div class="row flex-center">
            <a-input v-model="ctiExtension" class="col" placeholder="내선번호" @keyup.enter="consult" />
            <a-btn
              :label="connectBtnLabel"
              class="q-ml-xs"
              color="primary"
              @click="consult"
              :disable="isConsultCallActive"
            />
          </div>
          <div class="row">
            <a-btn label="3자 통화" color="primary" @click="conference" :disable="!isConsultCallActive" />
            <a-btn label="호전환" class="q-ml-xs" color="primary" @click="transfer" :disable="!isConsultCallActive" />
            <a-btn label="재연결" class="q-ml-xs" color="primary" @click="retrieve" />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-large {
  min-width: 700px;
  min-height: 300px;
}
.t-column {
  background-color: $grey-2;
}
.t-border {
  border: 1px solid $grey-2;
}
</style>
