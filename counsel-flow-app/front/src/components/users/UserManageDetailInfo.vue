<script setup>
import { ref, watch, computed, onMounted, nextTick, watchEffect } from "vue";
import { useQuasar } from "quasar";
import AInput from "components/common/AInput.vue";
import ASelect from "components/common/ASelect.vue";
import ABtn from "components/common/ABtn.vue";
import ATitle from "components/common/ATitleBar.vue";
import userApi from "src/js/api/userApi";
import CryptoJS from "crypto-js";
import permissionPopup from "./PermissionPopup.vue";
import { useOrganizationStore } from "src/stores/organizationStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert, showConfirm } from "src/js/common/dialog.js";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import FlowRoleCode from "src/js/common/FlowRoleCode";

const USE = FlowSystemCode.USE_CD.USE;
const UNUSE = FlowSystemCode.USE_CD.UNUSE;

const organizationStore = useOrganizationStore();
const permissionRoleStore = usePermissionRoleStore();
const $q = useQuasar();

function openCodePopup() {
  return new Promise((resolve) => {
    $q.dialog({
      component: permissionPopup,
    })
      .onOk((payload) => {
        permissionName.value = payload.payload.name;
        permissionId.value = payload.payload.entityId;
      })
      .onCancel(() => {
        resolve(null); // 취소 시에도 Promise를 해결
      });
  });
}

const props = defineProps({
  userData: {
    type: Object,
    required: false,
    defalut: () => ({}),
  },
});

const emit = defineEmits(["close", "fetchData"]);

const title = computed(() => {
  return entityId.value ? "사용자 상세정보" : "사용자 생성";
});

const entityId = ref(null);
const userId = ref("");
const userName = ref("");

const userStateList = [
  { label: "사용", value: USE },
  { label: "사용 안함", value: UNUSE },
];
const userState = ref(USE);
const permissionId = ref("");
const permissionName = ref("");
const email = ref("");
const ctiId = ref("");
const extentionNumber = ref("");
const skill = ref("");
const registerDate = ref("");
const registerName = ref("");
const updateDate = ref("");
const updateName = ref("");

const orgDepth1 = ref(["선택"]);
const orgDepth2 = ref(["선택"]);
const orgDepth3 = ref(["선택"]);
const org1 = ref("선택");
const org2 = ref("선택");
const org3 = ref("선택");
const orgs = ref([]);

const isOrgDataLoaded = ref(false);

const isUserDataLoaded = ref(false);

const canRemoveUser = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.USER_ROLE.DELETE));
const canSaveUser = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.USER_ROLE.SAVE));
const canAddUser = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.USER_ROLE.ADD));

async function handleUserData(newValue) {
  isUserDataLoaded.value = true;

  entityId.value = newValue.entityId || null;
  userId.value = newValue.id || "";
  userName.value = newValue.name || "";

  if (newValue.organization && newValue.organization.path) {
    const pathParts = newValue.organization.path.split(".");

    await setOrgSelection(pathParts);
  } else {
    resetOrgSelection();
  }

  const state = userStateList.find((item) => item.value === newValue.useTypeCode);
  userState.value = state ? state.value : USE;
  permissionId.value = (newValue.roleGroup && newValue.roleGroup.entityId) || null;
  permissionName.value = newValue.roleGroup?.name || "";
  email.value = newValue.email || "";
  ctiId.value = newValue.ctiLoginId || "";
  extentionNumber.value = newValue.ctiExtension || "";
  skill.value = "보험상품";
  registerDate.value = newValue.createdDate || "";
  registerName.value = newValue.createdByUserName
    ? newValue.createdByUserName + " [" + (newValue.createdByUserId || "") + "]"
    : "";

  updateDate.value = newValue.lastModifiedDate || "";

  updateName.value = newValue.lastModifiedByUserName
    ? newValue.lastModifiedByUserName + " [" + (newValue.lastModifiedByUserId || "") + "]"
    : "";
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

// 조직의 `code` 값으로 `name`을 가져오는 함수
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

// 조직 데이터를 불러온 후 플래그 업데이트
async function getOrgs() {
  orgs.value = Array.from(organizationStore.organizations.values());
  orgDepth1.value = ["선택", ...orgs.value.filter((org) => org.parentEntityId === null).map((org) => org.name)];
  isOrgDataLoaded.value = true;

  if (props.userData) {
    await handleUserData(props.userData);
  }
}

function resetOrgSelection() {
  org1.value = "선택";
  org2.value = "선택";
  org3.value = "선택";
  orgDepth2.value = ["선택"];
  orgDepth3.value = ["선택"];
}

watch(org1, (newVal) => {
  if (newVal !== "선택") {
    const selectedOrg = orgs.value.find((org) => org.name === newVal);
    if (selectedOrg && selectedOrg.children) {
      orgDepth2.value = ["선택", ...selectedOrg.children.map((org) => org.name)];
      org2.value = "선택";
      org3.value = "선택";
      orgDepth3.value = ["선택"];
    } else {
      orgDepth2.value = ["선택"];
      orgDepth3.value = ["선택"];
      org2.value = "선택";
      org3.value = "선택";
    }
  } else {
    orgDepth2.value = ["선택"];
    orgDepth3.value = ["선택"];
    org2.value = "선택";
    org3.value = "선택";
  }
});

watch(org2, (newVal) => {
  if (newVal !== "선택") {
    const selectedOrg = orgs.value.find((org) => org.name === org1.value);
    const selectedOrg2 = selectedOrg?.children?.find((org) => org.name === newVal);
    if (selectedOrg2 && selectedOrg2.children) {
      orgDepth3.value = ["선택", ...selectedOrg2.children.map((org) => org.name)];
      org3.value = "선택";
    } else {
      orgDepth3.value = ["선택"];
      org3.value = "선택";
    }
  } else {
    orgDepth3.value = ["선택"];
    org3.value = "선택";
  }
});

async function postUser() {
  const validIdRegex = /^[a-zA-Z0-9]+$/; // 영문 대소문자와 숫자만 허용
  const validNameRegex = /^[가-힣a-zA-Z0-9]+$/; // 한글, 영문 대소문자, 숫자만 허용
  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!userId.value || !userName.value) {
    showAlert("아이디와 이름은 필수 입력 입니다.");
    return;
  }

  // userId 유효성 검사
  if (!validIdRegex.test(userId.value)) {
    showAlert("아이디는 영문 대소문자와 숫자만 사용할 수 있습니다.");
    return;
  }

  // userName 유효성 검사
  if (!validNameRegex.test(userName.value)) {
    showAlert("이름은 한글, 영문 대소문자와 숫자만 사용할 수 있습니다.");
    return;
  }

  // 이메일 유효성 검사 (입력된 경우에만)
  if (email.value && !validEmailRegex.test(email.value)) {
    showAlert("올바른 이메일 형식을 입력해 주세요.");
    return;
  }

  const selectedOrgId = getSelectedOrgId();

  const param = {
    entity: {
      id: userId.value,
      name: userName.value,
      password: CryptoJS.SHA256("12345678").toString(),
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
  try {
    const userResponse = await userApi.postUser(param);

    if (userResponse.status === 200) {
      const userdata = await userApi.getUser(userResponse.data.entityId);
      await handleUserData(userdata.data);
      emit("fetchData");
      showAlert("저장 되었습니다.");
    }
  } catch (error) {
    handleApiError(error);
  }
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

async function showPutConfirm() {
  const validIdRegex = /^[a-zA-Z0-9]+$/;
  const validNameRegex = /^[가-힣a-zA-Z0-9]+$/;
  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!userId.value || !userName.value) {
    showAlert("이름은 필수 입력 입니다.");
    return;
  }

  // userId 유효성 검사
  if (!validIdRegex.test(userId.value)) {
    showAlert("아이디는 영문 대소문자와 숫자만 사용할 수 있습니다.");
    return;
  }

  // userName 유효성 검사
  if (!validNameRegex.test(userName.value)) {
    showAlert("이름은 한글, 영문 대소문자와 숫자만 사용할 수 있습니다.");
    return;
  }

  // 이메일 유효성 검사 (입력된 경우에만)
  if (email.value && !validEmailRegex.test(email.value)) {
    showAlert("올바른 이메일 형식을 입력해 주세요.");
    return;
  }

  const selectedOrgId = getSelectedOrgId();

  const param = {
    entity: {
      name: userName.value,
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

  try {
    const userResponse = await userApi.putUser(entityId.value, param);

    if (userResponse.status === 200) {
      const userdata = await userApi.getUser(userResponse.data.entityId);
      await handleUserData(userdata.data);
      emit("fetchData");
      showAlert("저장 되었습니다.");
    }
  } catch (error) {
    handleApiError(error);
  }
}

async function showDeleteConfirm() {
  const userConfirmed = await showConfirm("삭제 하시겠습니까?");

  if (userConfirmed) {
    if (userId.value === "admin") {
      showAlert("admin 계정은 삭제 할 수 없습니다.");
      return;
    }

    userApi
      .deleteUser(entityId.value)
      .then((response) => {
        if (response.status === 200) {
          emit("fetchData");
          emit("close");
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}

watch(
  () => props.userData,
  async (newValue) => {
    if (newValue && isOrgDataLoaded.value) {
      await handleUserData(newValue);
    }
  },
  { immediate: true }
);

watchEffect(() => {
  orgs.value = organizationStore.organizationArray;
  orgDepth1.value = ["선택", ...orgs.value.filter((org) => org.parentEntityId === null).map((org) => org.name)];

  if (org1.value !== "선택") {
    const selectedOrg = orgs.value.find((org) => org.name === org1.value);
    orgDepth2.value = selectedOrg?.children ? ["선택", ...selectedOrg.children.map((org) => org.name)] : ["선택"];
  }

  if (org2.value !== "선택") {
    const selectedOrg2 = orgs.value
      .find((org) => org.name === org1.value)
      ?.children?.find((org) => org.name === org2.value);
    orgDepth3.value = selectedOrg2?.children ? ["선택", ...selectedOrg2.children.map((org) => org.name)] : ["선택"];
  }
});

onMounted(() => {
  getOrgs();
});
</script>

<template>
  <div class="detail q-ml-xs column">
    <a-title :title="title" :close="true" @close="$emit('close')" class="col-auto" />

    <div class="col q-pa-xs b-border column table-container full-width">
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">
          <div>
            <q-badge class="q-pa-none vertical-top" color="grey-2" text-color="red">*</q-badge>
            아이디
          </div>
        </div>
        <div class="col top-border-right justify-center column q-px-xs">
          <template v-if="entityId">
            {{ userId }}
          </template>
          <template v-else>
            <a-input v-model="userId" />
          </template>
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
          <div>
            <q-badge class="q-pa-none vertical-top" color="grey-2" text-color="red">*</q-badge>
            사용자명
          </div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs"><a-input v-model="userName" /></div>
      </div>
      <div class="col-auto row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">조직(부서)</div>
        <div class="col body-border-right justify-center column q-pa-xs full-width">
          <a-select class="col q-pb-xs full-width" v-model="org1" :options="orgDepth1" />
          <a-select class="col q-pb-xs full-width" v-model="org2" :options="orgDepth2" />
          <a-select class="col full-width" v-model="org3" :options="orgDepth3" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">
          <div>
            <q-badge class="q-pa-none vertical-top" color="grey-2" text-color="red">*</q-badge>
            사용여부
          </div>
        </div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-select v-model="userState" :options="userStateList" />
        </div>
      </div>
      <div class="col row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">권한명</div>
        <div class="col body-border-right justify-center q-px-xs">
          <div class="q-pa-xs">
            <a-btn label="권한설정" @click="openCodePopup" />
          </div>
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
            >
            </q-chip>
          </div>
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">이메일</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-input v-model="email" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">CTI ID</div>
        <div class="col body-border-right justify-center column q-px-xs">
          <a-input v-model="ctiId" maxlength="50" />
        </div>
      </div>
      <div class="col-auto row full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">내선번호</div>
        <div class="col body-border-right justify-center column q-pa-xs">
          <a-input v-model="extentionNumber" maxlength="50" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">보유스킬</div>
        <div class="col body-border-right justify-center column q-px-xs"></div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">등록일시</div>
        <div class="col body-border-right justify-center column q-px-xs">
          {{ registerDate }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">등록자명</div>
        <div class="col body-border-right justify-center column q-px-xs">
          {{ registerName }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">변경일시</div>
        <div class="col body-border-right justify-center column q-px-xs">
          {{ updateDate }}
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left justify-center column q-px-xs">변경자명</div>
        <div class="col body-border-right justify-center column q-px-xs">
          {{ updateName }}
        </div>
      </div>

      <div class="row q-pt-xs justify-end q-gutter-xs no-wrap full-width">
        <a-btn v-if="entityId && entityId !== '' && canRemoveUser" label="삭제" @click="showDeleteConfirm" />
        <a-btn v-if="entityId && entityId !== '' && canSaveUser" label="저장" @click="showPutConfirm" />
        <a-btn v-if="!entityId && canAddUser" label="저장" @click="postUser" />
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

.select-box-row {
  height: 80px;
}

.chip {
  :deep(.q-chip__content) {
    justify-content: center;
  }
}
</style>
