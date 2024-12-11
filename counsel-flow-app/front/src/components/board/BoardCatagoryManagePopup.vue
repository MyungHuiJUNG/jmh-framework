<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useQuasar } from "quasar";
import ATitleBar from "components/common/ATitleBar.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import categoryApi from "src/js/api/categoryApi";
import ABtn from "src/components/common/ABtn.vue";
import BoardCategoryMovePopup from "./BoardCategoryMovePopup.vue";
import { useDialogPluginComponent } from "quasar";
import { useCategoryStore } from "src/stores/categoryStore";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";

const categoryStore = useCategoryStore();
const $q = useQuasar();

const emit = defineEmits(["close", "callback", ...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const columns = [
  {
    title: "카테고리명",
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
];

const rows = ref([]);
const gridRef = ref([]);
const selectedRow = ref([]);

onMounted(() => getAllCategory());

function openCategoryPopup() {
  if (!selectedRow.value.length) {
    showAlert("카테고리를 선택해주세요.");
    return;
  }
  const selectedRowItem = selectedRow.value[0];
  $q.dialog({
    component: BoardCategoryMovePopup,
    componentProps: {
      categoryList: rows.value,
    },
  })
    .onOk((payload) => {
      const parentEntityId = payload.parentEntityId;
      if (selectedRowItem.entityId === parentEntityId) {
        showAlert("자기 자신을 상위 코드로 선택할 수 없습니다.");
        return;
      }

      if (isDescendant(selectedRowItem.children || [], parentEntityId)) {
        showAlert("자신의 하위 코드를 상위 코드로 선택할 수 없습니다.");
        return;
      }

      selectedRowItem.parentEntityId = parentEntityId;
      selectedRowItem._isModified = true;
      moveItemToNewParent(selectedRowItem, parentEntityId);
    })
    .onCancel(() => {})
    .onDismiss(() => {});
}

function moveItemToNewParent(item, newParentEntityId) {
  // 기존 부모에서 아이템 제거
  removeItemFromParent(item, rows.value);

  // 새로운 부모에 아이템 추가
  addItemToNewParent(item, newParentEntityId, rows.value);
}

function removeItemFromParent(item, dataArray) {
  for (let i = 0; i < dataArray.length; i++) {
    const currentItem = dataArray[i];
    if (currentItem.code === item.code) {
      dataArray.splice(i, 1);
      if (dataArray.length) recalculateOrderNumber(dataArray);
      return true;
    } else if (currentItem.children && currentItem.children.length > 0) {
      const found = removeItemFromParent(item, currentItem.children);
      if (found) return true;
    }
  }
  return false;
}

function addItemToNewParent(item, newParentEntityId, dataArray) {
  for (const currentItem of dataArray) {
    if (currentItem.entityId === newParentEntityId) {
      if (!currentItem.children) currentItem.children = [];
      currentItem.children.push(item);
      recalculateOrderNumber(currentItem.children);
      return true;
    } else if (currentItem.children && currentItem.children.length > 0) {
      const found = addItemToNewParent(item, newParentEntityId, currentItem.children);
      if (found) return true;
    }
  }
  return false;
}

function isDescendant(childrenArray, entityId) {
  for (const child of childrenArray) {
    if (child.entityId === entityId) {
      return true;
    } else if (child.children && child.children.length > 0) {
      const found = isDescendant(child.children, entityId);
      if (found) return true;
    }
  }
  return false;
}

function sortWithChildren(array) {
  return array
    .map((item) => {
      if (item.children?.length) item.children = sortWithChildren(item.children);
      return item;
    })

    .sort((a, b) => a.orderNumber - b.orderNumber);
}

function transformTreeData(data) {
  const clonedData = JSON.parse(JSON.stringify(data));
  // 최상단에 "전체" 항목을 추가
  const root = [
    {
      entityId: "",
      name: "전체",
      code: "",
      path: null,
      orderNumber: 0,
      children: clonedData,
    },
  ];
  filterChildrenField(root); // 최상단 노드부터 시작
  return addIdField(root);
}

function filterChildrenField(data) {
  return data.map((item) => {
    if (item.children && !item.children.length) {
      delete item.children;
    }
    if (item.children) item.children = filterChildrenField(item.children);
    return item;
  });
}

function addIdField(data) {
  return data.map((item) => {
    const newItem = {
      ...item,
      id: item.code,
    };

    if (newItem.children?.length) newItem.children = addIdField(newItem.children);

    return newItem;
  });
}

function getAllCategory() {
  categoryApi
    .getCategory()
    .then((response) => {
      const sortedData = sortWithChildren(response.data);
      rows.value = transformTreeData(sortedData);
    })
    .catch((error) => {
      handleApiError(error);
    });
}

async function saveCategry() {
  const allRows = gridRef.value.getData();
  const postParams = [];
  const putParams = [];
  const invalidRows = [];

  function traverseData(dataArray) {
    dataArray.forEach((item, index) => {
      let parent = null;
      if (item.parentEntityId) {
        parent = { entityId: item.parentEntityId };
      }

      const entityData = {
        code: item.code,
        name: item.name,
        orderNumber: index + 1,
        parent: parent,
      };

      if (item.name?.length > 1024) {
        invalidRows.push(item);
        return;
      }

      if ((!item.entityId || item.entityId === "") && item.name !== "전체") {
        postParams.push(entityData);
      } else if (item.entityId && item._isModified) {
        entityData.entityId = item.entityId;
        putParams.push(entityData);
      }

      if (item.children && item.children.length > 0) {
        traverseData(item.children);
      }
    });
  }

  traverseData(allRows);

  if (invalidRows.length > 0) {
    showAlert("카테고리 이름은 1024자를 초과할 수 없습니다.");
    return;
  }

  try {
    if (putParams.length > 0) {
      await categoryStore.update(putParams);
    }
    if (postParams.length > 0) {
      await categoryStore.save(postParams);
    }

    onDialogOK();
    // getAllCategory();
    showAlert("카테고리가 성공적으로 저장되었습니다.");
  } catch (error) {
    handleApiError(error);
  }
}

function generateUniqueCode() {
  return "CT_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

function generateCategoryName() {
  const baseName = "새 카테고리";
  let maxNumber = 0;

  function traverseCategories(categories) {
    categories.forEach((category) => {
      const match = category.name.match(new RegExp(`^${baseName} (\\d+)$`));
      if (match && match[1]) {
        const number = parseInt(match[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }

      if (category.children && category.children.length > 0) {
        traverseCategories(category.children);
      }
    });
  }

  traverseCategories(rows.value);

  return `${baseName} ${maxNumber + 1}`;
}

function getNextOrderNumberAtLevel(nodes) {
  let maxOrderNumber = 0;
  if (nodes && nodes.length > 0) {
    nodes.forEach((node) => {
      if (node.orderNumber != null) {
        maxOrderNumber = Math.max(maxOrderNumber, node.orderNumber);
      }
    });
  }
  return maxOrderNumber + 1;
}

function recalculateOrderNumber(nodes) {
  if (nodes && nodes.length > 0) {
    // orderNumber 순으로 오름차순 정렬
    nodes.sort((a, b) => a.orderNumber - b.orderNumber);

    // 새로운 순서대로 번호를 재부여하고, 변경된 노드에 _isModified 추가
    nodes.forEach((node, index) => {
      const newOrderNumber = index + 1;
      // 기존 orderNumber가 달라졌다면 _isModified를 true로 설정
      if (node.orderNumber !== newOrderNumber) node._isModified = true;
      node.orderNumber = newOrderNumber;
    });
  }
}

function addRow() {
  const item = { code: generateUniqueCode(), name: generateCategoryName() };

  if (!selectedRow.value.length || selectedRow.value[0].name === "전체") {
    const topNode = rows.value[0];
    if (!topNode.children) topNode.children = [];
    item.orderNumber = getNextOrderNumberAtLevel(topNode.children);
    topNode.children.push(item);
    nextTick(() => selectRowByManually(""));
  } else {
    const selectedRowItem = selectedRow.value[0];
    if (!selectedRowItem.entityId) {
      showAlert("등록되지 않은 카테고리 하위에 추가할 수 없습니다.");
      return;
    }
    if (!selectedRowItem.children) selectedRowItem.children = [];

    item.orderNumber = getNextOrderNumberAtLevel(selectedRowItem.children);

    let parentEntityId = selectedRowItem.entityId;
    item.parentEntityId = parentEntityId; // 부모 entityId 추가
    selectedRowItem.children.push(item);
    nextTick(() => selectRowByManually(selectedRowItem.code));
  }
}

function rowSelected(row) {
  selectedRow.value = row;
}

function findNodeByEntityId(tree, entityId) {
  for (const node of tree) {
    // 현재 노드가 entityId와 일치하면 반환
    if (node.entityId === entityId) {
      return node;
    }

    // 하위 노드(children)가 있는 경우 재귀 호출
    if (node.children && node.children.length > 0) {
      const foundNode = findNodeByEntityId(node.children, entityId);
      if (foundNode) {
        return foundNode; // 발견 시 반환
      }
    }
  }
  return null; // 탐색 후 발견하지 못하면 null 반환
}

function deleteRow() {
  // 미선택시
  if (!selectedRow.value?.length) {
    showAlert("삭제할 카테고리를 선택해주세요.");
    return;
  }

  const selectedRowItem = selectedRow.value[0];

  if (selectedRowItem.entityId === "" && selectedRowItem.name === "전체") {
    showAlert("전체는 삭제할 수 없습니다.");
    return;
  }

  // 미등록 카테고리 삭제
  if (!selectedRowItem.entityId) {
    if (selectedRowItem.parentEntityId) {
      const parentNode = findNodeByEntityId(rows.value, selectedRowItem.parentEntityId);
      const rowIndex = parentNode.children.findIndex((r) => r === selectedRowItem);
      if (rowIndex !== -1) {
        parentNode.children.splice(rowIndex, 1);
        recalculateOrderNumber(parentNode.children);
        selectedRow.value = [];
        return;
      }
    } else {
      const topNode = rows.value[0];
      const rowIndex = topNode.children.findIndex((r) => r === selectedRowItem);
      if (rowIndex !== -1) {
        topNode.children.splice(rowIndex, 1);
        recalculateOrderNumber(topNode.children);
        selectedRow.value = [];
        return;
      }
    }
  } else {
    // 삭제 api 호출
    showConfirm("선택한 카테고리를 삭제하시겠습니까?").then((res) => {
      if (res) {
        categoryStore
          .remove(selectedRowItem.entityId)
          .then(() => {
            selectedRow.value = [];
            getAllCategory();
          })
          .catch((error) => {
            handleApiError(error);
          });
      }
    });
  }

  // entityId가 있는 경우 추가 처리 필요 (API 요청 등)
}
const rowComponent = ref();

function selectRowByManually(id) {
  gridRef.value.selectRowByManually(id);
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large column no-wrap">
      <a-title-bar title="카테고리 관리" :close="true" class="col-auto full-width" />
      <div class="q-pa-xs column col full-width no-wrap">
        <tabulator-grid
          ref="gridRef"
          :rows="rows"
          :columns="columns"
          class="col full-width"
          :dataTree="true"
          :dataTreeStartExpanded="true"
          :header-visible="false"
          :reactiveData="false"
          :selectableRows="1"
          @row-selected="rowSelected"
          @row-deselected="rowSelected"
        />
        <div class="col-auto full-width text-right bg-grey-5 a-border q-pa-xs no-wrap">
          <a-btn label="추가" @click="addRow" />
          <a-btn label="이동" class="q-ml-xs" @click="openCategoryPopup" />
          <a-btn label="삭제" class="q-ml-xs" @click="deleteRow" />
          <a-btn label="저장" @click="saveCategry" class="q-ml-xs" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-large {
  min-width: 700px;
  height: 700px;
}
</style>
