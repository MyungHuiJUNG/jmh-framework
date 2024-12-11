<script setup>
import { ref, onMounted, computed } from "vue";
import boardApi from "src/js/api/boardApi";
import categoryApi from "src/js/api/categoryApi";
import fileApi from "src/js/api/fileApi";
import ATitleBar from "components/common/ATitleBar.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import BoardCategoryRegist from "src/components/board/BoardCategoryRegist.vue";
import utils from "src/js/common/utils";
import FileUploadManage from "components/common/FileUploadManage.vue";
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useCategoryStore } from "src/stores/categoryStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ATextEditor from "../common/ATextEditor.vue";

const $q = useQuasar();
const categoryStore = useCategoryStore();
const permissionRoleStore = usePermissionRoleStore();

const props = defineProps({
  propData: Object,
});

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const isModify = ref(false);
const fileInput = ref("");
const title = ref("");
const categoryEntityId = ref("");
const category = ref("");
const content = ref("");
const createUser = ref("");
const createdDate = ref("");
const lastModifiedUser = ref("");
const lastModifiedDate = ref("");
//댓글
const replyContent = ref("");
const replies = ref("");

const titleModify = ref("");
// const contentModify = ref("");
const contentInputModify = ref();
const contentOutputModify = ref();
const rawContent = computed(() => {
  // 순수내용.
  return utils.removeHtmlTagsIncludingImg(contentOutputModify.value);
});
const callBackResult = ref({});

const fileMap = new Map(); // 중복을 검사하기 위한 객체
const filesFromServer = ref([]); // 서버에서 받은 파일
const tempLocalFiles = ref([]); // 로컬에서 올리기 전에 임시 저장된 파일
const filesForServer = ref([]); // 서버에 올릴 파일
const removeFiles = ref([]);

const canSaveBoard = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.BOARD_ROLE.SAVE));

const isFullscreen = ref(false);

// 데이터 넣어주는 로직
function setBoardDatas(data) {
  title.value = data.title;
  if (data.category && data.category.path) {
    const categoryPath = data.category.path.split(".");
    const categoryNames = categoryPath.map((code) => {
      const category = categoryStore.categories.get(code);
      return category ? category.name : code;
    });

    category.value = categoryNames.join(" > ");
  } else {
    category.value = "전체";
  }
  content.value = data.content;
  createUser.value = data.createdByUser.name;
  createdDate.value = data.createdDate;
  lastModifiedUser.value = data.modifiedByUser.name;
  lastModifiedDate.value = data.lastModifiedDate;

  console.log("게시판상세정보", data);
  if (data.files && data.files.length > 0) {
    for (const file of data.files) filesFromServer.value.push(file);
  }
}

function catagoryManagement() {
  $q.dialog({
    component: BoardCategoryRegist,
  }).onOk((result) => {
    categoryEntityId.value = result;
    categoryApi
      .getCategory(result)
      .then((response) => {
        const categoryPath = response.data.path.split(".");
        const categoryNames = categoryPath.map((code) => {
          const category = categoryStore.categories.get(code);
          return category ? category.name : code;
        });

        category.value = categoryNames.join(" > ");
      })
      .catch((error) => {
        handleApiError(error);
      });
  });
}

function changeModify() {
  titleModify.value = title.value;
  contentInputModify.value = content.value;
  contentOutputModify.value = content.value;
  isModify.value = true;
  removeFiles.value = [];
}

function cancelModify() {
  isModify.value = false;
}

function getReply(entityId) {
  boardApi
    .getReply(entityId)
    .then((response) => {
      replies.value = response.data.map((reply) => ({
        ...reply,
        isEditing: false,
        originalContents: reply.contents,
      }));
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function addReply() {
  if (!replyContent.value || replyContent.value.trim() === "") {
    showAlert("댓글을 입력해주세요.");
    return;
  }

  const param = {
    "entity.board.entityId": props.propData.entityId,
    "entity.contents": replyContent.value,
  };

  boardApi
    .addReply(param)
    .then((response) => {
      replyContent.value = "";
      getReply(props.propData.entityId);
    })
    .catch((error) => {
      handleApiError(error);
    });
}

async function removeReply(entityId) {
  const confirm = await showConfirm("댓글을 삭제 하시겠습니까?");

  if (confirm) {
    boardApi
      .removeReply(entityId)
      .then((response) => {
        getReply(props.propData.entityId);
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}

function openReplyEditor(reply) {
  reply.isEditing = true;
}

function updateReply(reply) {
  if (!reply.contents || reply.contents.trim() === "") {
    showAlert("댓글을 입력해주세요.");
    return;
  }

  const params = {
    "entity.contents": reply.contents,
  };

  boardApi
    .updateReply(params, reply.entityId)
    .then((response) => {
      reply.isEditing = false;
      reply.originalContents = reply.contents;
      getReply(props.propData.entityId);
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function cancelEdit(reply) {
  reply.contents = reply.originalContents;
  reply.isEditing = false;
}

function resetReply() {
  replyContent.value = "";
}

function modifyBoard() {
  if (!titleModify.value || titleModify.value.trim() === "") {
    showAlert("제목을 입력해주세요.");
    return;
  }

  if (!contentOutputModify.value || contentOutputModify.value.trim() === "") {
    showAlert("내용을 입력해주세요.");
    return;
  }

  const params = {
    title: titleModify.value,
    content: encodeURIComponent(contentOutputModify.value),
    rawContent: encodeURIComponent(rawContent.value),
    categoryId: categoryEntityId.value,
  };

  boardApi
    .updateBoard(props.propData.entityId, params)
    .then((response) => {
      uploadFileToServer(props.propData.entityId);
      callBackResult.value.type = "update";
      onDialogOK(callBackResult.value);
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function deleteBoard() {
  showConfirm("해당 게시글을 삭제하시겠습니까?").then((res) => {
    if (res) {
      boardApi
        .deleteBoard(props.propData.entityId)
        .then((response) => {
          const result = {
            type: "delete",
          };
          onDialogOK(result);
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  });
}

function handleFileUpload(event) {
  const selectedFiles = event.target.files;
  tempLocalFiles.value.push(...selectedFiles);
  removeDuplicateFiles();
  fileInput.value.value = null;
}

function uploadFileToServer(entityId) {
  if (filesForServer.value?.length) {
    fileApi
      .uploadFile("board", entityId, uploadFiles())
      .then((response) => {
        console.log("파일업로드", response);
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  if (removeFiles.value) {
    let entityIds = "";
    for (const idx in removeFiles.value) {
      if (idx > 0) entityIds += ",";

      entityIds += removeFiles.value[idx].entityId;
    }

    fileApi
      .removeFiles(entityIds)
      .then((response) => {
        console.log("removefiles", response);
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
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
  console.log("업로드할 파일은?", filesForServer.value);
  const formData = new FormData();
  filesForServer.value.forEach((file) => {
    formData.append("file", file);
  });
  return formData;
}

function removeFile(index) {
  showConfirm("해당 파일을 삭제하시겠습니까?").then((res) => {
    if (res) tempLocalFiles.value.splice(index, 1);
  });
}

function removeServerFile(file, index) {
  showConfirm("해당 파일을 삭제하시겠습니까?").then((res) => {
    if (res) {
      console.log("삭제할 파일", file);
      removeFiles.value.push(file);
      filesFromServer.value.splice(index, 1);
    }
  });
}

const handleMaximize = () => {
  const dialogElement = document.querySelector(".dialog-body");
  if (!isFullscreen.value) {
    if (dialogElement.requestFullscreen) {
      dialogElement.requestFullscreen();
    } else if (dialogElement.mozRequestFullScreen) {
      dialogElement.mozRequestFullScreen();
    } else if (dialogElement.webkitRequestFullscreen) {
      dialogElement.webkitRequestFullscreen();
    } else if (dialogElement.msRequestFullscreen) {
      dialogElement.msRequestFullscreen();
    }
    isFullscreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    isFullscreen.value = false;
  }
};

onMounted(() => {
  boardApi
    .getBoard(props.propData.entityId)
    .then((response) => {
      setBoardDatas(response.data);
      getReply(props.propData.entityId);
    })
    .catch((error) => {
      handleApiError(error);
    });
});

function setContentOutput(newVal) {
  contentOutputModify.value = newVal;
}
</script>

<template>
  <q-dialog
    ref="dialogRef"
    no-backdrop-dismiss
    transition-show="fade"
    transition-hide="fade"
    class="column no-wrap"
    allow-focus-outside
  >
    <q-card class="dialog-body column no-wrap fit">
      <a-title-bar
        class="col-auto full-width"
        title="게시글 상세내용"
        :maximize="true"
        :close="true"
        @maximize="handleMaximize"
      />
      <div class="col column full-width q-pa-xs">
        <div class="col-auto row full-width fixed-height">
          <div class="col-auto t-column text-left top-border-left q-px-xs column justify-center">
            <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>제목</div>
          </div>
          <div v-if="!isModify" class="col top-border-right justify-center column q-px-xs">
            <span class="full-width text-ellipsis">{{ title }}</span>
          </div>
          <div v-if="isModify" class="col top-border-right justify-center column q-px-xs">
            <a-input v-model="titleModify" />
          </div>
        </div>
        <div class="col-auto row fixed-height full-width">
          <div class="col-auto t-column bottom-border-left text-left q-px-xs column justify-center">
            <div class="row">
              <q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>카테고리
            </div>
          </div>
          <div v-if="!isModify" class="col bottom-border-left body-border-right justify-center column q-px-xs">
            <span class="full-width text-ellipsis">{{ category }}</span>
          </div>
          <div v-if="isModify" class="col body-border-left body-border-right justify-center text-center column">
            <div class="row justify-between items-center">
              <span class="q-ml-xs">{{ category }}</span>
              <a-btn label="선택" class="q-mx-xs" @click="catagoryManagement" />
            </div>
          </div>
        </div>
        <div class="col row full-width">
          <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">
            <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>내용</div>
          </div>
          <div v-if="!isModify" class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height">
            <ATextEditor class="fit column no-wrap" :content-input="content" :readOnly="true" />
          </div>

          <div v-else class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height">
            <ATextEditor
              class="fit column no-wrap"
              :content-input="contentInputModify"
              @content-output="setContentOutput"
            />
          </div>
        </div>
        <div class="col-2 row full-width">
          <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center full-height">
            <div class="row">댓글</div>
          </div>
          <div class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height column">
            <div class="row items-center col-auto full-width">
              <a-input class="col full-width" v-model="replyContent" @keyup.enter="addReply" />
              <a-btn class="col-auto reply-btn q-ml-xs" icon="edit" @click="addReply" />
              <a-btn class="col-auto reply-btn q-ml-xs" icon="delete" @click="resetReply" />
            </div>
            <div class="col full-width" style="overflow-y: auto">
              <div v-for="(reply, index) in replies" :key="index" class="row justify-between items-center">
                <div class="col column">
                  <span class="full-width text-ellipsis text-bold"
                    >{{ reply.createdByUserName }} [{{ reply.createdByUserId }}] - {{ reply.createdDate }}</span
                  >
                  <div v-if="reply.isEditing">
                    <a-input class="full-width" v-model="reply.contents" @keyup.enter="updateReply(reply)" />
                  </div>
                  <div v-else>
                    <span class="full-width text-ellipsis" style="word-break: break-word; white-space: normal">{{
                      reply.contents
                    }}</span>
                  </div>
                </div>
                <div class="col-auto">
                  <a-btn
                    class="col-auto reply-btn q-ml-xs"
                    icon="save"
                    v-if="reply.isEditing"
                    @click="updateReply(reply)"
                  />
                  <a-btn
                    class="col-auto reply-btn q-ml-xs"
                    icon="cancel"
                    v-if="reply.isEditing"
                    @click="cancelEdit(reply)"
                  />
                  <a-btn class="col-auto reply-btn q-ml-xs" icon="edit" v-else @click="openReplyEditor(reply)" />
                  <a-btn
                    icon="delete"
                    color="primary"
                    @click="removeReply(reply.entityId)"
                    class="col-auto reply-btn q-ml-xs"
                  />
                </div>
                <div
                  v-if="index < replies.length - 1"
                  class="col-auto full-width q-my-xs"
                  style="border-top: 1px solid #ddd"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isModify" class="col-auto row full-width">
          <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">첨부파일</div>
          <div class="col body-border-right justify-center column q-pa-xs">
            <input type="file" @change="handleFileUpload" multiple ref="fileInput" />
          </div>
        </div>
        <div class="col-2 row">
          <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center full-height">
            파일목록
          </div>
          <div class="col body-border-right justify-center no-wrap text-no-wrap overflow-auto full-height">
            <div v-if="!isModify && !filesFromServer.length">
              <span> 등록된 파일이 없습니다. </span>
            </div>
            <FileUploadManage
              v-if="isModify || filesFromServer.length"
              :filesFromServer="filesFromServer"
              :tempLocalFiles="tempLocalFiles"
              resourceType="Board"
              :isModify="isModify"
              @removeFile="removeFile"
              @removeServerFile="removeServerFile"
            />
          </div>
        </div>
        <div v-if="!isModify">
          <div class="col-auto row fixed-height">
            <div class="col-auto t-column text-center body-border-left q-px-xs column justify-center">등록자</div>
            <div class="col body-border-left text-center justify-center column">
              {{ createUser }}
            </div>
            <div class="col-auto t-column text-center body-border-left q-px-xs column justify-center">등록일자</div>
            <div class="col body-border-right text-center justify-center column">
              {{ createdDate }}
            </div>
          </div>
          <div class="col-auto row fixed-height">
            <div class="col-auto t-column text-center body-border-left q-px-xs column justify-center">수정자</div>
            <div class="col body-border-left text-center justify-center column">
              {{ lastModifiedUser }}
            </div>
            <div class="col-auto t-column text-center body-border-left q-px-xs column justify-center">수정일자</div>
            <div class="col body-border-right text-center justify-center column">
              {{ lastModifiedDate }}
            </div>
          </div>
        </div>
        <div class="col-auto full-width text-right bg-grey-5 a-border q-pa-xs">
          <a-btn v-if="!isModify && canSaveBoard" label="수정" class="q-ml-xs" @click="changeModify" />
          <a-btn v-if="isModify" label="취소" class="q-ml-xs" @click="cancelModify" />
          <a-btn v-if="isModify" label="삭제" class="q-ml-xs" @click="deleteBoard" />
          <a-btn v-if="isModify" label="저장" class="q-ml-xs" @click="modifyBoard" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-body {
  min-width: 1400px;
  max-height: 850px;
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

.bottom-border-left {
  border-bottom: 1px solid $grey-5;
  border-left: 1px solid $grey-5;
}

.bottom-border-right {
  border-bottom: 1px solid $grey-5;
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

.file-table {
  border-collapse: collapse;
  width: 100%;
  border: none;
  border-spacing: 0;
}

.file-table td {
  border: 1px solid $grey-5;
  padding: 4px;
}

.file-table tr:first-child td {
  border-top: 1px solid white;
}

.file-table tr:last-child td {
  border-bottom: 1px solid white;
}

.file-table td:first-child {
  border-left: 1px solid white;
}

.file-table td:last-child {
  border-right: 1px solid white;
}

.text-ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.reply-btn {
  height: calc($line-height - 5px);
  padding: 0px;
  min-height: 0;
}

:deep(.table) {
  border-collapse: collapse;
}

:deep(.table td),
:deep(.table th) {
  border: 1px solid #ddd;
}
</style>
