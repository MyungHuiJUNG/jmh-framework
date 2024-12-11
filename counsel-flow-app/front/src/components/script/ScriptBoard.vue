<script setup>
import ATextarea from "../common/ATextarea.vue";
import AInput from "../common/AInput.vue";
import ABtn from "../common/ABtn.vue";
import utils from "src/js/common/utils";
import { ref, watch, computed } from "vue";
import scriptApi from "src/js/api/scriptApi";
import { handleApiError } from "src/js/common/errorHandler";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { showAlert } from "src/js/common/dialog";
import ATextEditor from "../common/ATextEditor.vue";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";

const loading = ref(false);

const props = defineProps(["counselType"]);

const counselTypeStore = useCounselTypeStore();
const permissionRoleStore = usePermissionRoleStore();
const counselTypeNameWithPath = ref();
const counselTypeEid = ref();

const canGetScript = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.SCRIPT_ROLE.READ));
const canSaveScript = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.SCRIPT_ROLE.SAVE));

const title = ref();
// const contents = ref("");
const contentInput = ref();
const contentOutput = ref();
const rawContent = computed(() => {
  // 순수내용.
  return utils.removeHtmlTagsIncludingImg(contentOutput.value);
});
const entityId = ref();

watch(
  () => props.counselType,
  (newVal) => {
    if (newVal) {
      counselTypeEid.value = newVal.entityId;
      setCounselTypeNameWithPath(newVal.path);
    } else {
      counselTypeEid.value = null;
      counselTypeNameWithPath.value = null;
    }
  },
  { deep: true }
);

watch(
  counselTypeEid,
  (newVal) => {
    if (newVal) {
      getScript(newVal);
    } else {
      resetDatas();
    }
  },
  { immediate: true }
);

function setCounselTypeNameWithPath(path) {
  if (!path) {
    counselTypeNameWithPath.value = null;
    return;
  }
  let pathArray = path.split(".");
  let nameWithPath = "";
  if (pathArray.length > 0) nameWithPath = counselTypeStore.counselTypes.get(pathArray[0])?.name;
  if (pathArray.length > 1) nameWithPath += ` > ${counselTypeStore.counselTypes.get(pathArray[1])?.name}`;
  if (pathArray.length > 2) nameWithPath += ` > ${counselTypeStore.counselTypes.get(pathArray[2])?.name}`;

  counselTypeNameWithPath.value = nameWithPath;
}

function resetDatas() {
  title.value = null;
  contentInput.value = null;
  entityId.value = null;
}

function getScript(counselTypeEid) {
  if (!canGetScript.value) {
    showAlert("스크립트 조회 권한이 없습니다.");
    return;
  }
  if (!counselTypeEid) return;
  loading.value = true;
  const params = {};
  params["entity.counselType.entityId"] = counselTypeEid;
  scriptApi
    .getScript(params)
    .then((response) => {
      if (response.status === 200) {
        if (response.data.length) {
          const result = response.data[0];
          title.value = result.title;
          contentInput.value = result.contents;
          contentOutput.value = result.contents;
          entityId.value = result.entityId;
        } else {
          resetDatas();
        }
      }
    })
    .catch((error) => {
      handleApiError(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

function saveScript() {
  if (counselTypeEid.value) {
    if (!title.value) {
      showAlert("제목을 입력해주세요.");
      return;
    }
    if (!contentOutput.value) {
      showAlert("내용을 입력해주세요.");
      return;
    }

    if (!entityId.value) {
      const param = {
        entity: {
          counselType: {
            entityId: counselTypeEid.value,
          },
          title: title.value,
          contents: contentOutput.value,
          rawContent: rawContent.value,
        },
      };
      scriptApi
        .saveScript(param)
        .then((response) => {
          if (response.status === 200) {
            showAlert("저장이 완료되었습니다.");
            entityId.value = response.data.entityId;
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    } else {
      const param = {
        entity: {
          title: title.value,
          contents: contentOutput.value,
          rawContent: rawContent.value,
        },
      };
      scriptApi
        .updateScript(entityId.value, param)
        .then((response) => {
          if (response.status === 200) {
            showAlert("수정이 완료되었습니다.");
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  } else {
    showAlert("상담유형을 선택해주세요.");
  }
}

function setContentOutput(newVal) {
  contentOutput.value = newVal;
}
</script>

<template>
  <div class="column fit">
    <div class="col-auto row fixed-height full-width">
      <div class="col-auto t-column text-left top-border-left q-px-xs column justify-center">상담유형</div>
      <div class="col top-border-right justify-center column q-px-xs">
        <a-input v-model="counselTypeNameWithPath" readonly />
      </div>
    </div>
    <div class="col-auto row fixed-height full-width">
      <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center full-height">
        <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>제목</div>
      </div>
      <div class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height justify-center column">
        <a-input v-model="title" />
      </div>
    </div>
    <div class="col row full-width">
      <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center full-height">
        <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>내용</div>
      </div>
      <div class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height">
        <ATextEditor class="col fit no-wrap" :content-input="contentInput" @content-output="setContentOutput" />
      </div>
    </div>
    <div class="col-auto full-width text-right bg-grey-5 a-border q-pa-xs" v-if="canSaveScript">
      <a-btn label="저장" class="q-ml-xs" @click="saveScript" />
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped>
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
  width: 10%;
  background-color: $grey-2;
}
</style>
