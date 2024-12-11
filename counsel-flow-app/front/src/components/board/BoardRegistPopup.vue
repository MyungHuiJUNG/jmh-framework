<script setup>
import { ref, onMounted, computed } from "vue";
import { useCategoryStore } from "src/stores/categoryStore";
import { useDialogPluginComponent, useQuasar } from "quasar";
import { showAlert, showConfirm } from "src/js/common/dialog";
import ATextEditor from "../common/ATextEditor.vue";
import boardApi from "src/js/api/boardApi";
import categoryApi from "src/js/api/categoryApi";
import fileApi from "src/js/api/fileApi";
import ATitleBar from "components/common/ATitleBar.vue";
import AInput from "components/common/AInput.vue";
import ABtn from "components/common/ABtn.vue";
import utils from "src/js/common/utils";
import FileUploadManage from "components/common/FileUploadManage.vue";
import BoardCategoryRegist from "src/components/board/BoardCategoryRegist.vue";
import { handleApiError } from "src/js/common/errorHandler";

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const $q = useQuasar();
const categoryStore = useCategoryStore();

const props = defineProps({
  propCategoryData: Object,
});

const fileInput = ref("");
const title = ref("");
// const content = ref("");
const contentInput = ref();
const contentOutput = ref();
const rawContent = computed(() => {
  // 순수내용.
  return utils.removeHtmlTagsIncludingImg(contentOutput.value);
});
const categoryEntityId = ref("");
const category = ref("");

const tempLocalFiles = ref([]); // 로컬에서 올리기 전에 임시 저장된 파일
const filesForServer = ref([]); // 서버에 올릴 파일
const fileMap = new Map(); // 중복을 검사하기 위한 객체

const isFullscreen = ref(false);

function fetchCategory(categoryId) {
  categoryApi
    .getCategory(categoryId)
    .then((response) => {
      const categoryPath = response.data.path.split(".");
      const categoryNames = categoryPath.map((code) => {
        const categoryItem = categoryStore.categories.get(code);
        return categoryItem ? categoryItem.name : code;
      });

      category.value = categoryNames.join(" > ");
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function categoryManagement() {
  $q.dialog({
    component: BoardCategoryRegist,
  }).onOk((result) => {
    categoryEntityId.value = result;
    fetchCategory(result);
  });
}

function addBoard() {
  if (!title.value) {
    showAlert("제목을 입력하세요.");
    return;
  }
  if (!category.value) {
    showAlert("카테고리를 선택하세요.");
    return;
  }
  if (!contentOutput.value) {
    showAlert("내용을 입력하세요");
    return;
  }

  const params = {
    title: title.value,
    content: encodeURIComponent(contentOutput.value),
    rawContent: encodeURIComponent(rawContent.value),
    readCount: 0,
    categoryId: categoryEntityId.value,
  };

  boardApi
    .addBoard(params)
    .then((response) => {
      if (response.status === 200) {
        uploadFileToServer(response.data.entityId);
        showAlert("등록되었습니다.");
        onDialogOK();
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function removeDuplicateFiles() {
  fileMap.clear();
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

function uploadFileToServer(entityId) {
  if (filesForServer.value?.length) {
    fileApi
      .uploadFile("board", entityId, uploadFiles()) // 생성된 공지사항에 파일 업로드.
      .then((response) => {
        console.log("파일업로드", response);
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
  filesForServer.value = tempLocalFiles.value;
  fileInput.value.value = null;
}

function uploadFiles() {
  const formData = new FormData();
  filesForServer.value.forEach((file) => {
    formData.append("file", file);
  });
  return formData;
}

function removeFile(index) {
  showConfirm("해당 파일을 삭제하시겠습니까?").then((res) => {
    if (res) {
      tempLocalFiles.value.splice(index, 1);
      removeDuplicateFiles();
    }
  });
}

const handleMaximize = () => {
  const dialogElement = document.querySelector(".dialog-large");
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
  if (props.propCategoryData && props.propCategoryData.categoryId) {
    categoryEntityId.value = props.propCategoryData.categoryId;
    fetchCategory(categoryEntityId.value);
  }
});

function setContentOutput(newVal) {
  contentOutput.value = newVal;
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
    <q-card class="dialog-large column no-wrap fit">
      <a-title-bar
        title="게시글등록"
        :maximize="true"
        :close="true"
        class="col-auto full-width"
        @maximize="handleMaximize"
      />
      <div class="col column full-width q-pa-xs">
        <div class="col-auto row full-width fixed-height">
          <div class="col-auto t-column text-left top-border-left q-px-xs column justify-center">
            <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>제목</div>
          </div>
          <div class="col top-border-right justify-center column q-px-xs"><a-input v-model="title" /></div>
        </div>
        <div class="col-auto row fixed-height full-width">
          <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center">
            <div class="row">
              <q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>카테고리
            </div>
          </div>
          <div class="col body-border-left justify-center text-center column">
            <div class="row justify-between items-center">
              <span class="q-ml-xs">{{ category }}</span>
              <a-btn label="선택" class="q-mx-xs" @click="categoryManagement" />
            </div>
          </div>
        </div>
        <div class="col row full-width">
          <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center full-height">
            <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>내용</div>
          </div>
          <div class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height">
            <ATextEditor class="fit column no-wrap" :content-input="contentInput" @content-output="setContentOutput" />
          </div>
        </div>
        <div class="col-auto row full-width">
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
            <FileUploadManage :tempLocalFiles="tempLocalFiles" @removeFile="removeFile" />
          </div>
        </div>
        <div class="col-auto full-width text-right bg-grey-5 a-border q-pa-xs no-wrap">
          <a-btn label="저장" class="q-ml-xs" @click="addBoard" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-large {
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
</style>
