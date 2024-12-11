<script setup>
import TabulatorGrid from "src/components/common/TabulatorGrid.vue";
import { handleApiError } from "src/js/common/errorHandler";
import { ref, onMounted, computed } from "vue";
import { showAlert, showConfirm } from "src/js/common/dialog";
import ABtn from "src/components/common/ABtn.vue";
import siteLinkApi from "src/js/api/siteLinkApi";
import ATitleBar from "src/components/common/ATitleBar.vue";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import ALoadingSpinner from "src/components/common/ALoadingSpinner.vue";

const loading = ref(false);

const permissionRoleStore = usePermissionRoleStore();
const canAddSiteLinks = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.SITE_LINK_ROLE.ADD));
const canDeleteSiteLinks = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.SITE_LINK_ROLE.DELETE));
const canSaveSiteLinks = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.SITE_LINK_ROLE.SAVE));

const grid = ref(null);
const rowHeader = {
  headerSort: false,
  resizable: false,
  minWidth: 30,
  width: 30,
  rowHandle: true,
  formatter: "handle",
};
const rows = ref([]);
const columns = [
  {
    formatter: "rowSelection",
    titleFormatter: "rowSelection",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: 20,
  },
  { title: "#", formatter: "rownum", headerHozAlign: "center", hozAlign: "center", headerSort: false, width: 50 },
  {
    title: "링크명",
    field: "name",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: false,
    editor: "input",
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },

  {
    title: "링크Url",
    field: "linkUrl",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: false,
    editor: "input",
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },
  {
    title: "사용여부",
    field: "usable",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: "150",
    editor: "list",
    editorParams: {
      values: { true: "사용", false: "사용 안함" },
    },
    formatter: function (cell) {
      const value = cell.getValue();
      return value === true || value === "true" ? "사용" : "사용 안함";
    },
    cellEdited: function (cell) {
      let newValue = cell.getValue();

      if (newValue === "true" || newValue === "사용") {
        newValue = true;
      } else if (newValue === "false" || newValue === "사용 안함") {
        newValue = false;
      }

      if (typeof newValue === "boolean") {
        cell.getRow().update({ usable: newValue });
      } else {
        const oldValue = cell.getOldValue();
        cell.setValue(oldValue);
      }

      cell.getRow().reformat();

      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },
  {
    title: "아이콘이미지",
    field: "iconFile",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: "150",
    formatter: function (cell, formatterParams, onRendered) {
      const rowData = cell.getRow().getData();

      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.justifyContent = "space-between";
      container.style.width = "100%";
      container.title = "가로와 세로의 해상도가 비슷한 크기의 이미지여야 합니다.";

      const imgContainer = document.createElement("div");
      imgContainer.style.display = "flex";
      imgContainer.style.alignItems = "center";

      const img = document.createElement("img");
      img.style.width = "30px";
      img.style.height = "30px";
      img.style.marginRight = "5px";
      imgContainer.appendChild(img);

      const iconUrl = rowData.iconSrc || (rowData.iconImageFile ? rowData.iconImageFile.downloadUrl : null);

      if (rowData.iconSrc) {
        img.src = rowData.iconSrc;
      } else if (!rowData.iconSrc && !rowData.iconImageFile) {
        img.src = new URL(`../../assets/globe.svg`, import.meta.url).href;
      } else if (rowData.iconImageFile && rowData.iconImageFile.downloadUrl) {
        siteLinkApi
          .getImageWithToken(rowData.iconImageFile.downloadUrl)
          .then((icon) => {
            img.src = icon;
          })
          .catch((error) => {
            handleApiError(error);
          });
      }

      container.appendChild(imgContainer);

      const button = document.createElement("button");
      button.innerText = iconUrl ? "삭제" : "등록";

      // 버튼 생성
      button.addEventListener("click", async function (event) {
        event.stopPropagation();

        if (iconUrl) {
          const confirmDelete = await showConfirm("이미지를 삭제 하시겠습니까?");
          if (confirmDelete) {
            try {
              await siteLinkApi.deleteIconImg(rowData.entityId);

              rowData.iconSrc = null;
              rowData.iconImageFile = null;

              cell.getRow().update(rowData);
              cell.getTable().redraw(true);
            } catch (error) {
              handleApiError(error);
            }
          }
        } else {
          openImageUploadDialog(rowData, cell);
        }
      });

      container.appendChild(button);

      return container;
    },
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },
  {
    title: "설명",
    field: "description",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: false,
    editor: "input",
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },
];

const selectedRows = ref([]);

onMounted(() => {
  loadInitialData();
});

function openImageUploadDialog(rowData, cell) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validImageTypes.includes(file.type)) {
        showAlert("이미지 파일만 업로드 가능합니다.");
        fileInput.value = ""; // 선택된 파일 초기화
        return;
      }
      rowData["iconFile"] = file;
      rowData._isModified = true;

      // 미리보기를 위해 Base64로 변환하여 표시
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageDataUrl = e.target.result;

        // 메뉴 아이콘일 경우 iconSrc, 퀵메뉴 아이콘일 경우 quickIconSrc에 미리보기 저장
        rowData["iconSrc"] = imageDataUrl;

        // UI 업데이트
        cell.getRow().update(rowData);
        cell.getTable().redraw(true);
      };
      reader.readAsDataURL(file);
    }
  });

  // 파일 입력 요소를 클릭하여 파일 선택 창 열기
  document.body.appendChild(fileInput);
  fileInput.click();

  // 파일 입력 요소 제거
  document.body.removeChild(fileInput);
}

function addRow() {
  rows.value.unshift({ name: null, linkUrl: null, usable: true });
  let index = 0;

  rows.value.forEach((row) => {
    const newOrderNumber = index + 1;
    if (row.orderNumber !== newOrderNumber) row._isModified = true;
    row.orderNumber = newOrderNumber;
    index++;
  });
}

function handleRowMoved(data) {
  data.forEach((item, index) => {
    const newOrderNumber = index + 1;
    if (item.orderNumber !== newOrderNumber) item._isModified = true;
    // 새로운 orderNumber를 할당
    item.orderNumber = newOrderNumber;
  });

  rows.value = data;
}

function isRowValid(rows) {
  return rows.every((row) => row.name && row.linkUrl);
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

function save() {
  const allRows = grid.value.getData();
  const newRows = [];
  const modifiedRows = [];

  if (!isRowValid(allRows)) {
    showAlert("링크명과 링크Url은 필수값입니다.");
    return;
  }

  allRows.forEach((row) => {
    if (!row.entityId) {
      newRows.push(row);
    } else if (row.entityId && row._isModified) {
      modifiedRows.push(row);
    }
  });

  if (!newRows.length && !modifiedRows.length) return;

  const invalidUrls = [];
  [...newRows, ...modifiedRows].forEach((row) => {
    if (!isValidUrl(row.linkUrl)) {
      invalidUrls.push(row.linkUrl || "알 수 없는 항목");
    }
  });

  if (invalidUrls.length) {
    showAlert(`다음 항목의 링크 URL이 유효하지 않습니다:\n${invalidUrls.join(", ")}`);
    return;
  }

  const promises = [];

  newRows.forEach((row) => {
    const formData = new FormData();
    formData.append("entity.name", row.name);
    formData.append("entity.linkUrl", row.linkUrl);
    formData.append("entity.orderNumber", row.orderNumber);
    formData.append("entity.usable", row.usable);
    if (row.description) formData.append("entity.description", row.description);

    if (row.iconFile) formData.append("iconFile", row.iconFile);

    promises.push(siteLinkApi.saveSiteLink(formData)); // 저장 요청 추가
  });

  modifiedRows.forEach((row) => {
    const formData = new FormData();
    formData.append("entity.name", row.name);
    formData.append("entity.linkUrl", row.linkUrl);
    formData.append("entity.orderNumber", row.orderNumber);
    formData.append("entity.usable", row.usable);
    if (row.description) formData.append("entity.description", row.description);

    if (row.iconFile) formData.append("iconFile", row.iconFile);

    promises.push(siteLinkApi.updateSiteLink(row.entityId, formData)); // 수정 요청 추가
  });

  Promise.all(promises)
    .then(() => {
      showAlert("저장이 완료되었습니다.");
      loadInitialData();
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function loadInitialData() {
  loading.value = true;
  siteLinkApi
    .getSiteLinks()
    .then((response) => {
      if (response.status === 200) {
        const sortedData = response.data.sort((a, b) => a.orderNumber - b.orderNumber);
        rows.value = sortedData;
      }
    })
    .catch((error) => {
      handleApiError(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

function rowSelected(row) {
  selectedRows.value = row;
}

function deleteSiteLinks() {
  if (!selectedRows.value.length) {
    showAlert("삭제할 항목을 선택하세요.");
    return;
  }
  let entityIds = "";
  for (const idx in selectedRows.value) {
    if (idx > 0) entityIds += ",";
    entityIds += selectedRows.value[idx].entityId;
  }

  showConfirm("선택한 항목을 삭제하시겠습니까?").then((res) => {
    if (res) {
      siteLinkApi
        .deleteSiteLinks(entityIds)
        .then((response) => {
          if (response.status === 200) {
            selectedRows.value = [];
            loadInitialData();
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  });
}
</script>

<template>
  <div class="column no-wrap fit a-border q-pa-xs" style="min-height: 730px">
    <a-title-bar title="사이트링크 목록" class="col-auto full-width q-mb-xs" />
    <TabulatorGrid
      :rows="rows"
      :columns="columns"
      movable-rows
      :row-header="rowHeader"
      class="full-width col"
      ref="grid"
      :selectable-rows="true"
      selectableRowsRangeMode="click"
      @rowSelected="rowSelected"
      @rowDeselected="rowSelected"
      @row-moved="handleRowMoved"
    />
    <div class="col-auto bg-grey-5 text-right q-pa-xs" v-if="canAddSiteLinks || canDeleteSiteLinks || canSaveSiteLinks">
      <a-btn label="추가" @click="addRow" v-if="canAddSiteLinks" />
      <a-btn label="삭제" class="q-ml-xs" @click="deleteSiteLinks" v-if="canDeleteSiteLinks" />
      <a-btn label="저장" class="q-ml-xs" @click="save" v-if="canAddSiteLinks || canSaveSiteLinks" />
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
