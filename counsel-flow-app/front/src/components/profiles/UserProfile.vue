<script setup>
import { ref, onMounted, nextTick } from "vue";
import AInput from "components/common/AInput.vue";
import ASelect from "components/common/ASelect.vue";
import ABtn from "components/common/ABtn.vue";
import ATitle from "components/common/ATitleBar.vue";
import profileApi from "src/js/api/profileApi";
import CryptoJS from "crypto-js";
import { useAuthStore } from "src/stores/authStore";
import { useOrganizationStore } from "src/stores/organizationStore";
import { showAlert, showConfirm } from "src/js/common/dialog.js";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";

const USE = FlowSystemCode.USE_CD.USE;
const UNUSE = FlowSystemCode.USE_CD.UNUSE;

let title = "사용자 상세정보";

const authStore = useAuthStore();
const organizationStore = useOrganizationStore();

const userId = ref("");
const userName = ref("");
const password = ref("");
const checkPassword = ref("");

const userStateList = [
  { label: "사용", value: USE },
  { label: "미사용", value: UNUSE },
];
const userState = ref(USE);
const permissionName = ref("");
const email = ref("");
const ctiId = ref("");
const extentionNumber = ref("");
const permissionId = ref("");
const skill = ref("");

const orgDepth1 = ref(["선택"]);
const orgDepth2 = ref(["선택"]);
const orgDepth3 = ref(["선택"]);
const org1 = ref("선택");
const org2 = ref("선택");
const org3 = ref("선택");
const orgs = ref([]);

function getUser() {
  profileApi
    .getUser(authStore.entityId)
    .then((response) => {
      if (response.status === 200) {
        userId.value = response.data.id;
        userName.value = response.data.name;
        if (response.data.organization && response.data.organization.path) {
          const pathParts = response.data.organization.path.split(".");

          setOrgSelection(pathParts);
        } else {
          resetOrgSelection();
        }
        if (response.data.roleGroup) {
          permissionName.value = response.data.roleGroup.name;
          permissionId.value = response.data.roleGroup.entityId;
        } else {
          permissionName.value = null;
          permissionId.value = null;
        }
        ctiId.value = response.data.ctiLoginId;
        email.value = response.data.email;
        extentionNumber.value = response.data.ctiExtension;
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function resetOrgSelection() {
  org1.value = "선택";
  org2.value = "선택";
  org3.value = "선택";
  orgDepth2.value = ["선택"];
  orgDepth3.value = ["선택"];
}

function passwordValidate(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;

  return regex.test(password);
}

function isPasswordMatch() {
  return password.value === checkPassword.value;
}

async function showPutConfirm() {
  if (!passwordValidate(password.value)) {
    showAlert("영문과 숫자를 조합하여 8~16 자리로 설정하세요.");
    return;
  }

  if (!isPasswordMatch()) {
    showAlert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const userConfirmed = await showConfirm("수정 하시겠습니까?");

  if (userConfirmed) {
    const selectedOrgId = getSelectedOrgId();

    const param = {
      entity: {
        name: userName.value,
        password: CryptoJS.SHA256(password.value).toString(),
        email: email.value,
        useTypeCode: userState.value,
        ctiLoginId: ctiId.value,
        ctiExtension: extentionNumber.value,
        ...(permissionId.value && {
          roleGroup: {
            entityId: permissionId.value,
          },
        }),
        ...(selectedOrgId && { organization: { entityId: selectedOrgId } }),
      },
    };

    profileApi
      .putUser(authStore.entityId, param)
      .then((response) => {
        if (response.status === 200) {
          getUser();
          showAlert("수정 되었습니다.");
          password.value = "";
          checkPassword.value = "";
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}

async function getOrgs() {
  orgs.value = Array.from(organizationStore.organizations.values());
  orgDepth1.value = ["선택", ...orgs.value.filter((org) => org.parentEntityId === null).map((org) => org.name)];
}

async function setOrgSelection(pathParts) {
  try {
    if (pathParts[0]) {
      const org1Code = pathParts[0];
      org1.value = getOrgNameFromCode(org1Code); // code로 name을 가져옴
      await updateOrgDepths(1, org1Code);
      await nextTick();
    }

    if (pathParts[1]) {
      const org2Code = pathParts[1];
      org2.value = getOrgNameFromCode(org2Code);
      await updateOrgDepths(2, org2Code);
      await nextTick();
    }

    if (pathParts[2]) {
      const org3Code = pathParts[2];
      org3.value = getOrgNameFromCode(org3Code);
    }
  } catch (error) {
    resetOrgSelection();
  }
}

function getOrgNameFromCode(code) {
  const organization = organizationStore.organizations.get(code);
  return organization ? organization.name : "선택";
}

async function updateOrgDepths(level) {
  return new Promise((resolve) => {
    if (level === 1) {
      const selectedOrg1 = orgs.value.find((org) => org.name === org1.value);
      if (selectedOrg1 && selectedOrg1.children) {
        orgDepth2.value = ["선택", ...selectedOrg1.children.map((org) => org.name)];
        org2.value = "선택";
        orgDepth3.value = ["선택"];
        org3.value = "선택";
      } else {
        resetOrgSelection();
      }
    } else if (level === 2) {
      const selectedOrg1 = orgs.value.find((org) => org.name === org1.value);
      const selectedOrg2 = selectedOrg1?.children?.find((org) => org.name === org2.value);
      if (selectedOrg2 && selectedOrg2.children) {
        orgDepth3.value = ["선택", ...selectedOrg2.children.map((org) => org.name)];
        org3.value = "선택";
      } else {
        orgDepth3.value = ["선택"];
        org3.value = "선택";
      }
    }
    resolve();
  });
}

function getSelectedOrgId() {
  let selectedOrg = null;

  if (org1.value !== "선택") {
    selectedOrg = orgs.value.find((org) => org.name === org1.value);
  }

  if (selectedOrg && org2.value !== "선택") {
    const selectedOrg2 = selectedOrg.children?.find((org) => org.name === org2.value);
    if (selectedOrg2) {
      selectedOrg = selectedOrg2;
    } else {
      return selectedOrg ? selectedOrg.entityId : null;
    }
  }

  if (selectedOrg && org3.value !== "선택") {
    const selectedOrg3 = selectedOrg.children?.find((org) => org.name === org3.value);
    if (selectedOrg3) {
      selectedOrg = selectedOrg3;
    } else {
      return selectedOrg ? selectedOrg.entityId : null;
    }
  }

  return selectedOrg ? selectedOrg.entityId : null;
}

onMounted(() => {
  getUser();
  getOrgs();
});
</script>

<template>
  <div class="detail column">
    <a-title :title="title" class="col-auto" />

    <div class="col q-pa-xs b-border column table-container">
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
          <div>아이디</div>
        </div>
        <div class="col top-border-right justify-center column q-px-xs">
          <a-input v-model="userId" disable />
        </div>
      </div>
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
          <div>비밀번호</div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-input type="password" v-model="password" />
        </div>
      </div>
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
          <div>비밀번호 확인</div>
        </div>
        <div class="col column body-border-right justify-center q-px-xs">
          <a-input type="password" v-model="checkPassword" />
        </div>
      </div>
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
          <div>사용자명</div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs"><a-input v-model="userName" disable /></div>
      </div>
      <div class="col-auto row">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs text-center">
          조직(부서)
        </div>
        <div class="col body-border-right justify-center column q-pa-xs">
          <a-select class="text-no-wrap q-pb-xs" v-model="org1" disable />
          <a-select class="text-no-wrap q-pb-xs" v-model="org2" disable />
          <a-select class="text-no-wrap" v-model="org3" disable />
        </div>
      </div>
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
          <div>사용여부</div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-select v-model="userState" :options="userStateList" disable />
        </div>
      </div>
      <div class="col row">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">권한명</div>
        <div class="col body-border-right justify-center q-px-xs">
          <div class="full-height column no-wrap text-no-wrap full-width items-center overflow-auto">
            <q-chip
              v-if="permissionName && permissionName !== ''"
              class="chip q-ma-xs"
              color="primary"
              :label="permissionName"
              text-color="white"
              size="md"
              style="width: 80%"
              clickable
              disable
            >
            </q-chip>
          </div>
        </div>
      </div>
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">이메일</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-input v-model="email" disable />
        </div>
      </div>
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">CTI ID</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-input v-model="ctiId" disable />
        </div>
      </div>
      <div class="col-auto row">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">내선번호</div>
        <div class="col body-border-right justify-center column q-pa-xs">
          <a-input v-model="extentionNumber" disable />
        </div>
      </div>
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">보유스킬</div>
        <div class="col body-border-right justify-center column q-px-xs"></div>
      </div>

      <div class="col-auto text-right q-pt-xs">
        <a-btn label="저장" @click="showPutConfirm" />
      </div>
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
  width: 100px;
  background-color: $grey-2;
}

.fixed-height {
  height: $line-height + 2;
}

// .detail {
//   // width: 400px;
// }

.b-border {
  border-right: 1px solid $grey-5;
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}

.select-box-row {
  height: 80px;
}

.chip {
  :deep(.q-chip__content) {
    justify-content: center;
  }
}
</style>
