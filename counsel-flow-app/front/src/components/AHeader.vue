<script setup>
import { ref, onMounted, computed, onUnmounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/authStore";
import { useWebSocket } from "stores/websocket";
import { useMainTabStore } from "src/stores/mainTab";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { useOrganizationStore } from "src/stores/organizationStore";
import { useCodeStore } from "src/stores/codeStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { useSystemVariableStore } from "src/stores/systemVariableStore";
import { Menu } from "src/js/menu";
import MenuBtn from "components/MenuBtn.vue";
import SoftPhone from "components/SoftPhone.vue";
import AIconBtn from "components/AIconBtn.vue";
import NotificationAlarmMenu from "./notification/NotificationAlarmMenu.vue";
import ABtn from "./common/ABtn.vue";
import authApi from "src/js/api/authApi";
import notificationApi from "src/js/api/notificationApi";
import { showConfirm } from "src/js/common/dialog";
import useToastAlert from "src/js/toastAlarm";
import { handleApiError } from "src/js/common/errorHandler";
import NotificationMessagePopup from "./notification/NotificationMessagePopup.vue";
import { useQuasar } from "quasar";
import SiteLinkList from "./siteLink/SiteLinkList.vue";
import siteLinkApi from "src/js/api/siteLinkApi";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import { setInitialDatas, clearInitialDatas } from "src/js/common/initialSetup";

const $q = useQuasar();
const emit = defineEmits(["ticketBoard"]);
const router = useRouter();
const authStore = useAuthStore();
const mainTabStore = useMainTabStore();
const permissionRoleStore = usePermissionRoleStore();

const webSocket = useWebSocket();
const { showToast } = useToastAlert();
const userName = computed(() => authStore.name);
const userId = computed(() => authStore.id);
const userEid = computed(() => authStore.entityId);
const extension = computed(() => authStore.ctiExtension);

const softPhone = ref(null);

const notificationCount = ref(0);
const showAlarmPopup = ref(false);
const notificationData = ref([]);
const showSiteLinkList = ref(false);

const canSendMessage = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.MESSAGE_ROLE.WRITE));

function openProfile() {
  mainTabStore.addTab({
    name: Menu.PROFILE_MANAGE.name,
    label: Menu.PROFILE_MANAGE.label,
  });
}

function openHome() {
  mainTabStore.addTab({
    name: Menu.CALL_CONSULT.name,
    label: Menu.CALL_CONSULT.label,
  });
}

async function logout() {
  const logoutConfirm = await showConfirm("로그아웃 하시겠습니까?");
  if (logoutConfirm) {
    softPhone.value.logoutAndDisconnectWhenUserLogOut().then(() => {
      authApi
        .logout()
        .then((response) => {
          if (response.status === 200) {
            authStore.logout();
            clearInitialDatas();
            const saveId = localStorage.getItem("saveId");
            const savedUserId = localStorage.getItem("savedUserId");
            const saveCTI = localStorage.getItem("saveCTI");
            localStorage.clear();
            mainTabStore.closeAll();
            if (saveId === "true") {
              localStorage.setItem("saveId", saveId);
              localStorage.setItem("savedUserId", savedUserId);
            }

            if (saveCTI === "true") {
              localStorage.setItem("saveCTI", saveCTI);
            }
            router.push("/login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}

function toggleAlarmPopup() {
  showAlarmPopup.value = !showAlarmPopup.value;
  if (showAlarmPopup.value) {
    getNotifications();
  }
}

function getNotifications() {
  const param = {
    "entity.receiver.entityId": userEid.value,
    "entity.isRead": false,
  };

  notificationApi
    .getNotifications(param)
    .then((response) => {
      if (response.status === 200) {
        notificationData.value = response.data;
        notificationCount.value = notificationData.value.length;
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

const reconnectInterval = ref(null);
const retryDelay = 5000; // 5초 간격으로 재시도
const maxRetries = -1; // -1 : 무제한, 1~N : 시도 횟수
let retryCount = 0;

function startReconnect() {
  if (reconnectInterval.value) {
    clearInterval(reconnectInterval.value); // 이전의 재시도 간격을 클리어
  }

  reconnectInterval.value = setInterval(() => {
    console.log("웹소켓 재연결 시도 중...");
    connectWebSocket();
  }, retryDelay);
}

function connectWebSocket() {
  if (retryCount >= maxRetries && maxRetries !== -1) {
    console.error("웹소켓 재연결 시도 횟수를 초과했습니다.");
    clearInterval(reconnectInterval.value);
    reconnectInterval.value = null;
    return;
  }

  webSocket.connect(
    null,
    localStorage.getItem("accessToken"),
    () => {
      retryCount = 0; // 성공 시 재시도 횟수 초기화
      console.log("WebSocket 성공적으로 연결되었습니다.");
      clearInterval(reconnectInterval.value);
      reconnectInterval.value = null;

      // 웹소켓 구독 설정
      webSocket.addsubscribe(
        "/topic/regist-notice",
        (message, subscribeId) => {
          //TODO 웹소켓 알림 (공지사항 등록 시)
          if (message.sender.entityId !== userEid.value) showToast(message.message);
          setTimeout(() => {
            getNotifications();
          }, 200);
        },
        null,
        false
      );

      webSocket.addsubscribe(
        "/topic/ticket-board",
        (message, subscribeId) => {
          //TODO 웹소켓 알림 (Footer 로그인계정의 티켓현황 10초마다 옴 > Footer Component에 보내어 셋팅하면 됨)
          console.log("[웹소켓] Message 티켓: ", JSON.parse(message.jsonStringContent));
          emit("ticketBoard", JSON.parse(message.jsonStringContent));
        },
        null,
        true
      );

      webSocket.addsubscribe(
        "/topic/transmit-ticket",
        (message, subscribeId) => {
          //TODO 웹소켓 알림 (로그인 계정에게 티켓이관 시)
          showToast(message.message);
          setTimeout(() => {
            getNotifications();
          }, 200);
        },
        null,
        true
      );

      webSocket.addsubscribe(
        "/topic/ticket-reservation",
        (message, subscribeId) => {
          //TODO 웹소켓 알림 (로그인 계정의 티켓 중 예약시간이 5분전인 티켓이 있을 때)
          showToast(message.message);
          setTimeout(() => {
            getNotifications();
          }, 200);
        },
        null,
        true
      );

      webSocket.addsubscribe(
        "/topic/send-message",
        (message, subscribeId) => {
          //TODO 웹소켓 알림 (로그인 계정에게 메세지 전송 시)
          showToast(`[쪽지] ${message.title}`);
          setTimeout(() => {
            getNotifications();
          }, 200);
        },
        null,
        true
      );

      webSocket.addsubscribe(
        "/topic/callback-ticket",
        (message, subscribeId) => {
          //TODO 웹소켓 알림 (로그인 계정의 콜백 티켓이 할당되었을 때)
          showToast(message.message);
          setTimeout(() => {
            getNotifications();
          }, 200);
        },
        null,
        true
      );

      webSocket.addsubscribe(
        "/topic/request/init-password",
        (message, subscribeId) => {
          //TODO 웹소켓 알림 (로그인 계정이 비밀번호 초기화 요청승인 권한을 가지고있고, 실제 요청이 들어왔을 때)
          showToast(message.message);
          setTimeout(() => {
            getNotifications();
          }, 200);
        },
        null,
        true
      );
    },
    () => {
      console.error("웹소켓 연결 실패. 재연결을 시도합니다...");
      retryCount++;
      startReconnect();
    }
  );
}

onMounted(() => {
  setInitialDatas();
  getNotifications();
  connectWebSocket();
});

function reproduceToken() {
  showConfirm("로그인을 연장하시겠습니까?").then((res) => {
    if (res) {
      authApi
        .reproduceToken()
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("accessExpirationTime", response.data.accessExpirationTime);
            localStorage.setItem("accessTokenExpiresIn", response.data.accessTokenExpiresIn);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("refreshExpirationTime", response.data.refreshExpirationTime);
            localStorage.setItem("refreshTokenExpiresIn", response.data.refreshTokenExpiresIn);
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  });
}

// 남은 시간을 계산하는 함수
function calculateTimeRemaining() {
  const expiresIn = localStorage.getItem("accessTokenExpiresIn");
  if (!expiresIn) return 0;

  // yyyy-MM-dd HH:mm:ss 형식을 ISO 형식으로 변환
  const expirationTime = Date.parse(expiresIn.replace(" ", "T"));
  const currentTime = new Date().getTime();

  // 남은 시간을 초 단위로 계산
  return Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
}

// 남은 시간을 형식화하여 표시하는 함수
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

const timeRemaining = ref(calculateTimeRemaining());

// 남은 시간을 형식화된 문자열로 제공하는 계산 속성
const formattedTimeRemaining = computed(() => formatTime(timeRemaining.value));

// 주기적으로 남은 시간을 업데이트
let timer = null;
onMounted(() => {
  timer = setInterval(() => {
    timeRemaining.value = calculateTimeRemaining();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);

  if (reconnectInterval.value) {
    clearInterval(reconnectInterval.value);
    reconnectInterval.value = null;
  }
});

function openMessagePopup() {
  $q.dialog({
    component: NotificationMessagePopup,
  });
}

function toggleSiteLinkList() {
  showSiteLinkList.value = !showSiteLinkList.value;
  getSiteLinkList();
}

const siteLinkList = ref([]);

function getSiteLinkList() {
  siteLinkApi.getSiteLinksUsable().then((response) => {
    if (response.status === 200) {
      const sortedData = response.data.sort((a, b) => a.orderNumber - b.orderNumber);
      siteLinkList.value = sortedData.map((link) => ({
        ...link,
        iconUrl: null, // 초기값
      }));

      // 각 링크의 아이콘 URL 로드
      siteLinkList.value.forEach(async (link) => {
        if (link.iconImageFile && link.iconImageFile.downloadUrl) {
          try {
            link.iconUrl = await siteLinkApi.getImageWithToken(link.iconImageFile.downloadUrl);
          } catch (error) {
            handleApiError(error);
          }
        }
      });
    }
  });
}
</script>

<template>
  <q-header class="shadow-2">
    <div class="a-header q-px-sm row items-center no-wrap">
      <menu-btn flat round :offset="[10, 15]" />

      <img
        class="q-ml-sm col-auto cursor-pointer"
        src="~assets/images/logo.png"
        style="width: 140px; object-fit: fill"
        @click="openHome"
      />
      <div class="q-mx-sm column col-auto">
        <q-banner v-if="timeRemaining > 0" dense class="col-auto">세션 만료까지: {{ formattedTimeRemaining }}</q-banner>
        <q-banner v-else class="col-auto" dense>세션이 만료되었습니다.</q-banner>
        <a-btn class="col full-width q-mt-xs" label="로그인 연장" color="primary" @click="reproduceToken" />
      </div>

      <q-space />
      <SoftPhone ref="softPhone" />
      <q-space />

      <a-icon-btn class="notification-button col-auto q-ml-md" label="사이트" icon="public" @click="toggleSiteLinkList">
        <SiteLinkList v-model="showSiteLinkList" :links="siteLinkList" />
      </a-icon-btn>

      <a-icon-btn
        class="notification-button col-auto q-ml-md"
        label="쪽지"
        icon="forum"
        @click="openMessagePopup"
        v-if="canSendMessage"
      >
      </a-icon-btn>

      <a-icon-btn
        class="notification-button col-auto q-mx-md"
        label="알림"
        icon="notification_important"
        :data-count="notificationCount"
        @click="toggleAlarmPopup"
      >
        <NotificationAlarmMenu
          v-model="showAlarmPopup"
          @notificatioUpdate="getNotifications"
          :rows="notificationData"
        />
      </a-icon-btn>

      <q-banner class="col-auto cursor-pointer" @click="openProfile" v-if="extension" dense>
        {{ userName }} / {{ userId }} / {{ extension }}
      </q-banner>

      <q-banner class="col-auto cursor-pointer" @click="openProfile" v-else dense>
        {{ userName }} / {{ userId }}
      </q-banner>

      <q-btn class="col-auto q-ml-sm" label="로그아웃" color="primary" dense @click="logout" />
    </div>
  </q-header>
</template>

<style lang="scss" scoped>
.a-header {
  background-color: white;
  color: black;
  height: 70px;
}

.notification-button[data-count="0"]::after {
  display: none;
}

.notification-button[data-count]:not([data-count="0"])::after {
  content: attr(data-count);
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 1;
  min-width: 20px;
  text-align: center;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
}
</style>
