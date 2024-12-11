<script setup>
import { ref, computed } from "vue";
import noticeApi from "src/js/api/noticeApi";
import fileApi from "src/js/api/fileApi";
import utils from "src/js/common/utils";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import FileUploadManage from "components/common/FileUploadManage.vue";
import ATitleBar from "components/common/ATitleBar.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ATextEditor from "../common/ATextEditor.vue";

const permissionRoleStore = usePermissionRoleStore();

const emit = defineEmits(["refreshNotice", "refreshTabulatorRow"]);
defineExpose({ resetInfo, getNotice });

const canSaveNotice = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.NOTICE_ROLE.SAVE));
const canAddNotice = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.NOTICE_ROLE.ADD));
const fileInput = ref(""); // input file ref변수
const entityId = ref("");
const title = ref("");
// const content = ref(""); // html태그를 포함한 내용.
const contentInput = ref();
const contentOutput = ref();
const rawContent = computed(() => {
  // 순수내용.
  // return utils.removeHtmlTagsIncludingImg(content.value);
  return utils.removeHtmlTagsIncludingImg(contentOutput.value);
});
const createdBy = ref("");
const createdDate = ref("");
const lastModifiedBy = ref("");
const lastModifiedDate = ref("");
const createdByUserId = ref("");
const createdByUserName = ref("");
const lastModifiedByUserId = ref("");
const lastModifiedByUserName = ref("");

const filesFromServer = ref([]); // 서버에서 받은 파일
const tempLocalFiles = ref([]); // 로컬에서 올리기 전에 임시 저장된 파일
const filesForServer = ref([]); // 서버에 올릴 파일
const filesToRemoved = ref([]); // 서버에서 받은 파일중에서 삭제될 파일
const fileMap = new Map(); // 중복을 검사하기 위한 객체

const editorRef = ref(null);

async function getNotice(id) {
  noticeApi
    .getNotice(id)
    .then(async (response) => {
      const { data } = response;
      entityId.value = data.entityId;
      title.value = data.title;
      // content.value = data.content;
      contentInput.value = data.content;
      contentOutput.value = data.content;
      createdBy.value = data.createdBy;
      createdDate.value = data.createdDate;
      lastModifiedBy.value = data.lastModifiedBy;
      lastModifiedDate.value = data.lastModifiedDate;
      createdByUserId.value = data.createdByUserId;
      createdByUserName.value = data.createdByUserName;
      lastModifiedByUserId.value = data.lastModifiedByUserId;
      lastModifiedByUserName.value = data.lastModifiedByUserName;

      filesFromServer.value = [];
      tempLocalFiles.value = [];
      filesForServer.value = [];

      if (data.files && data.files.length > 0) {
        for (const file of data.files) {
          const fileData = await fileApi.getFileDetail(file.entityId);
          filesFromServer.value.push(fileData.data);
        }
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

// 신규인지 수정인지?
async function checkNotice() {
  if (!validateNotice()) {
    return false;
  }

  const param = {
    entity: {
      title: title.value,
      // content: content.value,
      content: contentOutput.value,
      rawContent: rawContent.value,
    },
  };
  if (entityId.value) {
    await noticeApi
      .updateNotice(entityId.value, param) // 수정
      .then((response) => {
        const entityId = response.data.entityId;

        if (filesToRemoved.value.length > 0) {
          filesToRemoved.value.forEach((fileId) => {
            fileApi.removeFile(fileId).catch((error) => {
              handleApiError(error);
            });
          });
        }

        if (filesForServer.value.length > 0) {
          fileApi.uploadFile("notice", entityId, uploadFiles()).catch((error) => {
            handleApiError(error);
          });
        }

        showAlert("저장 되었습니다.");
        resetInfo();
        emit("refreshNotice");
      })
      .catch((error) => {
        handleApiError(error);
      });
  } else {
    await noticeApi
      .saveNotice(param) // 신규생성
      .then((response) => {
        const entityId = response.data.entityId;
        if (filesForServer.value.length !== 0) {
          fileApi
            .uploadFile("notice", entityId, uploadFiles()) // 생성된 공지사항에 파일 업로드.
            .catch((error) => {
              handleApiError(error);
            });
        }

        showAlert("저장 되었습니다.");
        resetInfo();
        emit("refreshNotice");
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}

function handleFileUpload(event) {
  const selectedFiles = event.target.files;
  tempLocalFiles.value.push(...selectedFiles);
  removeDuplicateFiles();
  fileInput.value.value = null;
}

function removeDuplicateFiles() {
  fileMap.clear();
  filesFromServer.value.forEach((file) => {
    const key = `${file.fileName}-${file.fileSize}`;
    fileMap.set(key, file);
  });

  // tempLocalFiles변수에 filesFromServer에 없는 파일만 추가.
  tempLocalFiles.value = tempLocalFiles.value.filter((file) => {
    const key = `${file.name}-${file.size}`;
    if (fileMap.has(key)) {
      return false;
    } else {
      fileMap.set(key, file);
      return true;
    }
  });

  filesForServer.value = [];
  filesForServer.value = tempLocalFiles.value;
}

function uploadFiles() {
  const formData = new FormData();
  filesForServer.value.forEach((file) => {
    formData.append("file", file);
  });
  return formData;
}

// 임시 저장된 파일 삭제
async function removeFile(index) {
  const result = await showConfirm("파일을 삭제하시겠습니까?");
  if (result) {
    tempLocalFiles.value.splice(index, 1);
    removeDuplicateFiles();
  }
}

// 서버에서 받아온 파일 삭제
async function removeServerFile(file, index) {
  const result = await showConfirm("파일을 삭제하시겠습니까?");
  if (result) {
    filesToRemoved.value.push(file.entityId);
    filesFromServer.value.splice(index, 1);
    removeDuplicateFiles();
  }
}

function resetInfo() {
  entityId.value = null;
  title.value = null;
  // content.value = "";
  contentInput.value = null;
  editorRef.value.clearContent(); // contentInput이 이미 빈 상태에서 다시 비우려면 필요
  createdBy.value = null;
  createdDate.value = null;
  lastModifiedBy.value = null;
  lastModifiedDate.value = null;
  createdByUserId.value = null;
  createdByUserName.value = null;
  lastModifiedByUserId.value = null;
  lastModifiedByUserName.value = null;
  filesFromServer.value = [];
  tempLocalFiles.value = [];
  filesForServer.value = [];
  filesToRemoved.value = [];
  fileMap.clear();

  emit("refreshTabulatorRow");
  fileInput.value.value = null;
}

function validateNotice() {
  if (!title.value) {
    showAlert("제목을 입력해주세요.");
    return false;
  } else if (!contentOutput.value) {
    showAlert("내용을 입력해주세요.");
    return false;
  }

  return true;
}

function setContentOutput(newVal) {
  contentOutput.value = newVal;
}
</script>

<template>
  <div class="column no-wrap fit">
    <a-title-bar class="col-auto full-width q-mb-xs" title="공지사항 세부정보" />
    <div class="col column full-width">
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left top-border-left q-px-xs column justify-center">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>제목</div>
        </div>
        <div class="col top-border-right justify-center column q-px-xs"><a-input v-model="title" /></div>
      </div>
      <div class="col row full-width">
        <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center full-height">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>내용</div>
        </div>
        <div class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height">
          <!-- <ATextEditor v-model="content" class="no-wrap" /> -->
          <ATextEditor
            :content-input="contentInput"
            @content-output="setContentOutput"
            class="no-wrap"
            ref="editorRef"
          />
        </div>
      </div>
      <div class="col-auto row full-width">
        <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">첨부파일</div>
        <div class="col body-border-right justify-center column q-pa-xs">
          <input type="file" @change="handleFileUpload" multiple ref="fileInput" />
        </div>
      </div>
      <div class="col-2 row full-width">
        <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">파일목록</div>
        <div
          class="col body-border-right justify-center no-wrap text-no-wrap overflow-auto"
          style="max-height: 100%; overflow-y: auto"
        >
          <FileUploadManage
            :filesFromServer="filesFromServer"
            :tempLocalFiles="tempLocalFiles"
            @removeFile="removeFile"
            @removeServerFile="removeServerFile"
          />
        </div>
      </div>
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">등록자</div>
        <div class="col body-border-left justify-center text-center column">
          {{ entityId ? createdByUserName + ` [${createdByUserId}]` : "" }}
        </div>
        <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">등록일자</div>
        <div class="col body-border-right justify-center text-center column">
          {{ createdDate }}
        </div>
      </div>
      <div class="col-auto row fixed-height">
        <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">수정자</div>
        <div class="col body-border-left justify-center text-center column">
          {{ entityId ? lastModifiedByUserName + ` [${lastModifiedByUserId}]` : "" }}
        </div>
        <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">수정일자</div>
        <div class="col body-border-right justify-center text-center column">
          {{ lastModifiedDate }}
        </div>
      </div>
      <div class="col-auto full-width text-right bg-grey-5 a-border q-pa-xs">
        <a-btn v-if="canAddNotice" label="신규" @click="resetInfo" />
        <a-btn v-if="(canAddNotice && !entityId) || canSaveNotice" label="저장" class="q-ml-xs" @click="checkNotice" />
      </div>
    </div>
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
