import { showAlert } from "./dialog";
import { Router } from "src/router/index";
import { useAuthStore } from "src/stores/authStore";
import { useMainTabStore } from "src/stores/mainTab";
import { counselHub, channel } from "src/boot/counsel-hub";

const mainTabStore = useMainTabStore();
const authStore = useAuthStore();

let isAlertShown = false;

export async function handleApiError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        showAlert(error.response.data.message || "잘못된 요청입니다.");
        break;
      case 401:
        if (!isAlertShown) {
          isAlertShown = true;
          await showAlert("로그인 토큰이 만료되었습니다. 다시 로그인해주세요.");
          if (channel.connected) {
            let code = "";
            counselHub
              .logout([CounselFlowHubVoiceType.IPRON_V5], code)
              .then(() => {
                console.log("[SoftPhone] #로그아웃 성공");
                counselHub.disconnect(code).then(() => {
                  console.log("[SoftPhone] #접속해제 성공");
                });
              })
              .catch((error) => {
                console.log("[SoftPhone] #오류 발생 : ", error);
                showAlert(VoiceCommonCode.GetCounselFlowHubErrorMessage(error));
              })
              .finally(() => {
                authStore.logout();
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

                Router.push({ name: "login" });
                setTimeout(() => {
                  isAlertShown = false;
                }, 5000);
              });
          } else {
            authStore.logout();
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

            Router.push({ name: "login" });
            setTimeout(() => {
              isAlertShown = false;
            }, 5000);
          }
        }
        break;
      case 403:
        showAlert("접근 권한이 없습니다.");
        break;
      default:
        showAlert("예상치 못한 오류가 발생했습니다.");
    }
  } else {
    showAlert("서버와 연결할 수 없습니다. 네트워크 상태를 확인하세요.");
  }

  console.log(error);
}
