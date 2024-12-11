<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import authApi from "src/js/api/authApi";
import CryptoJS from "crypto-js";
import taskRequestApi from "src/js/api/taskRequestApi";
import { showAlert, showConfirm } from "src/js/common/dialog";
import ALoadingSpinner from "src/components/common/ALoadingSpinner.vue";
import { setInitialDatas } from "src/js/common/initialSetup";
import { handleApiError } from "src/js/common/errorHandler";
import packageInfo from "../../package.json";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);

const userId = ref("");
const password = ref("");
const name = ref("");
const extensionNumber = ref("");
const saveId = ref(false);
const saveCTI = ref(false);
const savedUserId = ref("");
const showPassword = ref(false);
const isNameDialogOpen = ref(false);

onMounted(() => {
  saveId.value = localStorage.getItem("saveId") === "true";
  saveCTI.value = localStorage.getItem("saveCTI") === "true";
  if (saveId.value) {
    savedUserId.value = localStorage.getItem("savedUserId");
    if (savedUserId.value) {
      userId.value = savedUserId.value;
    }
  }
});

function handleSaveIdWithCtiAutoLogin() {
  if (saveId.value) {
    localStorage.setItem("saveId", true);
    localStorage.setItem("savedUserId", userId.value);
  } else {
    localStorage.setItem("saveId", false);
    localStorage.removeItem("savedUserId");
  }

  if (saveCTI.value) {
    localStorage.setItem("saveCTI", true);
  } else {
    localStorage.setItem("saveCTI", false);
  }
}

function handleLogin() {
  if (!userId.value?.trim() || !password.value?.trim()) {
    showAlert("아이디와 비밀번호를 모두 입력해야 합니다.");
    return;
  }
  loading.value = true;
  authApi
    .login(userId.value, CryptoJS.SHA256(password.value).toString())
    .then((response) => {
      if (response.status === 200) {
        console.log(response);
        if (saveId.value) {
          savedUserId.value = localStorage.getItem("savedUserId");
        }

        localStorage.clear();
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("accessExpirationTime", response.data.accessExpirationTime);
        localStorage.setItem("accessTokenExpiresIn", response.data.accessTokenExpiresIn);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("refreshExpirationTime", response.data.refreshExpirationTime);
        localStorage.setItem("refreshTokenExpiresIn", response.data.refreshTokenExpiresIn);
        localStorage.setItem("saveId", saveId.value);
        localStorage.setItem("savedUserId", savedUserId.value);
        if (extensionNumber.value) localStorage.setItem("ctiExtension", extensionNumber.value);

        getUserInfo().then((param) => {
          authStore.login(param).then(() => {
            handleSaveIdWithCtiAutoLogin();
            setInitialDatas()
              .then(() => {
                loading.value = false;
                router.push({ name: "main" });
              })
              .catch((error) => {
                handleApiError(error);
              });
          });
        });
      }
    })
    .catch((error) => {
      if (error.response.status === 500 && error.response.data.code === "1000") {
        loading.value = false;
        showAlert("아이디 또는 비밀번호를 확인해주세요.");
        return;
      }
      console.log(error);
    });
}

async function getUserInfo() {
  try {
    const response = await authApi.getUserInfo();
    let param = {
      entityId: response.data.entityId,
      useTypeCode: response.data.useTypeCode,
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      roleGroup: response.data.roleGroup,
      organization: response.data.organization,
      ctiLoginId: response.data.ctiLoginId,
      ctiLoginPassword: response.data.ctiLoginPassword,
      ctiExtension: extensionNumber.value ? extensionNumber.value : response.data.ctiExtension,
      ctiAutoLogin: saveCTI.value,
    };
    return Promise.resolve(param);
  } catch (error) {
    console.log(error);
  }
}

function openNameDialog() {
  if (!userId.value?.trim()) {
    showAlert("아이디를 입력하세요.");
    return;
  }
  isNameDialogOpen.value = true;
}

function confirmName() {
  if (!name.value?.trim()) {
    showAlert("사용자명을 입력하세요.");
    return;
  }
  isNameDialogOpen.value = false;
  handleResetPasswordRequest();
}

function nowTime() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function handleResetPasswordRequest() {
  const userConfirmed = await showConfirm("비밀번호 초기화 요청 하시겠습니까?");

  if (userConfirmed) {
    const param = {
      "entity.requestType": "INIT_PASSWORD",
      "entity.stateType": "IN_PROGRESS",
      "entity.requestor.id": userId.value,
      "entity.requestor.name": name.value,
      "entity.responseDate": nowTime(),
    };

    taskRequestApi
      .postPasswordReset(param)
      .then((response) => {
        if (response.status === 200) {
          showAlert("비밀번호 초기화 요청을 보냈습니다.");
          name.value = "";
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          if (error.response.data.code === "1007") {
            showAlert("아이디 또는 사용자명을 확인 해주세요.");
            name.value = "";
          } else {
            showAlert(error.response.data.message);
            name.value = "";
          }
        } else {
          showAlert("오류가 발생했습니다. 다시 시도해 주세요.");
          name.value = "";
        }
      });
  }
}
</script>

<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md row" style="width: 700px">
      <div class="col-6 flex flex-center">
        <img src="~assets/images/logo.png" class="full-width" alt="Logo" />
        <div class="absolute-bottom-left on-right" style="bottom: 10px; color: gray; font-weight: bold">
          ver. {{ packageInfo.version }}
        </div>
      </div>

      <div class="col-6 q-pl-md q-gutter-y-md">
        <form>
          <q-input v-model="userId" label="아이디" @keyup.enter="handleLogin" />

          <q-input
            v-model="password"
            label="비밀번호"
            :type="showPassword ? 'text' : 'password'"
            @keyup.enter="handleLogin"
            autoComplete="off"
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
                @keyup.enter="handleLogin"
              />
            </template>
          </q-input>
          <q-input v-model="extensionNumber" label="내선번호" @keyup.enter="handleLogin" />
        </form>

        <div class="row">
          <div class="col-6 row q-gutter-sm">
            <q-checkbox v-model="saveId" label="아이디 저장" dense />
            <q-checkbox v-model="saveCTI" label="CTI 로그인" dense />
            <q-btn dense flat color="primary" size="sm" @click="openNameDialog">
              <div class="text-left">비밀번호 초기화 요청</div>
            </q-btn>
          </div>
          <div class="col-6 flex flex-center">
            <q-btn class="full-width" label="로그인" color="primary" size="lg" @click="handleLogin" />
          </div>
        </div>
      </div>
    </q-card>

    <q-dialog v-model="isNameDialogOpen">
      <q-card class="q-dialog-plugin">
        <q-card-section class="q-mt-md text-center q-pt-none">
          <div>사용자명을 입력하세요</div>
          <q-input v-model="name" label="사용자명" />
        </q-card-section>

        <q-card-actions class="row q-gutter-md" align="center">
          <q-btn label="예" color="primary" @click="confirmName" />
          <q-btn label="아니요" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <a-loading-spinner v-model="loading" />
  </q-page>
</template>

<style lang="scss" scoped></style>
