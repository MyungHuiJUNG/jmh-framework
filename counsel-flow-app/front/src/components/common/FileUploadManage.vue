<script setup>
import fileApi from "src/js/api/fileApi";
import { showAlert } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";

const props = defineProps({
  filesFromServer: {
    type: Array,
    default() {
      return [];
    },
  },
  tempLocalFiles: {
    type: Array,
    default() {
      return [];
    },
  },
  isModify: {
    type: Boolean,
  },
  resourceType: {
    type: String,
  },
});

const emit = defineEmits(["removeFile", "removeServerFile"]);

async function downloadFile(file) {
  try {
    const response = await fileApi.downloadFile(file.entityId);
    const blob = response.data;
    const a = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    handleApiError(error);
  }
}

function removeFile(index) {
  emit("removeFile", index);
}

function removeServerFile(file, index) {
  emit("removeServerFile", file, index);
}

function truncateFileName(fileName) {
  if (!fileName) return null;
  // 파일명에서 확장자 추출
  const lastDotIndex = fileName.lastIndexOf(".");
  const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : "";

  // 확장자를 제외한 파일명 추출
  const nameWithoutExtension = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;

  // 파일명이 15자를 넘으면 자르고 확장자 붙이기
  const truncatedName =
    nameWithoutExtension.length > 15 ? nameWithoutExtension.slice(0, 15) + "..." : nameWithoutExtension;

  // 자른 이름과 확장자를 합쳐서 반환
  return truncatedName + extension;
}
</script>

<template>
  <table class="file-table">
    <colgroup>
      <col width="6%" class="first-td" />
      <col width="70%" class="second-td" />
      <col width="12%" class="third-td" />
      <col width="12%" class="fourth-td" />
    </colgroup>
    <tbody>
      <tr>
        <td class="text-center">#</td>
        <td class="text-center">파일명</td>
        <td class="text-center">다운로드</td>
        <td class="text-center">삭제</td>
      </tr>
      <tr class="body-border-bottom" v-if="filesFromServer.length === 0 && tempLocalFiles.length === 0">
        <td v-for="n in 4" :key="n" class="text-center no-wrap body-border-bottom"></td>
      </tr>
      <tr v-for="(file, index) in filesFromServer" :key="index">
        <td class="text-center no-wrap body-border-bottom">{{ index + 1 }}</td>
        <td class="body-border-bottom">{{ truncateFileName(file?.fileName) }}</td>
        <td class="text-center no-wrap body-border-bottom">
          <q-btn class="notice-btn" icon="download" color="primary" dense unelevated @click="downloadFile(file)" />
        </td>
        <td class="text-center no-wrap body-border-bottom">
          <q-btn
            class="notice-btn"
            icon="delete"
            color="primary"
            dense
            unelevated
            @click="removeServerFile(file, index)"
            v-if="!(resourceType === 'Board' && !isModify)"
          />
        </td>
      </tr>
      <tr v-for="(file, index) in tempLocalFiles" :key="index">
        <td class="text-center no-wrap body-border-bottom">{{ index + 1 + filesFromServer.length }}</td>
        <td class="body-border-bottom">{{ truncateFileName(file?.name) }}</td>
        <td class="text-center no-wrap body-border-bottom"></td>
        <td class="text-center no-wrap body-border-bottom">
          <q-btn
            class="notice-btn"
            icon="delete"
            color="primary"
            dense
            unelevated
            @click="removeFile(index)"
            v-if="!(resourceType === 'Board' && !isModify)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.file-table {
  border-collapse: collapse;
  width: 100%;
  border: none;
  border-spacing: 0;
}

.file-table td {
  border: 1px solid $grey-5;
  padding: 0px 8px;
}

.file-table tr {
  height: 26px;
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

.body-border-bottom {
  border-bottom: 1px solid $grey-5 !important;
}

.notice-btn {
  height: calc($line-height - 5px);
  padding: 0px 6px;
  min-height: 0;
}
</style>
