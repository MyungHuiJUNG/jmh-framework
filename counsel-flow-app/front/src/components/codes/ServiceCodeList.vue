<script setup>
import { ref, onMounted, nextTick, watch, computed } from "vue";
import { useQuasar } from "quasar";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { useCodeStore } from "src/stores/codeStore";
import ABtn from "components/common/ABtn.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import codeApi from "src/js/api/codeApi";
import CodePopup from "./CodePopup.vue";
import { showAlert, showConfirm } from "src/js/common/dialog.js";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import ATitleBar from "../common/ATitleBar.vue";
import FlowRoleCode from "src/js/common/FlowRoleCode";

const SERVICE = FlowSystemCode.CODE_TYPE.SERVICE;

const props = defineProps({
  filteredRows: Array,
});

const codeStore = useCodeStore();
const $q = useQuasar();
const permissionRoleStore = usePermissionRoleStore();

const selectedRowId = ref(null);
const childRef = ref("");
const originalRows = ref([]);

let tempEntityIdCounter = -1;

const canGetCode = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CODE_ROLE.READ_SERVICE_CODE));
const canRemoveCode = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CODE_ROLE.DELETE));
const canSaveCode = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CODE_ROLE.SAVE));
const canAddCode = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.CODE_ROLE.ADD));

let isPopupOpen = false;

const columns = [
  {
    title: "코드명",
    field: "name",
    hozAlign: "left",
    headerHozAlign: "center",
    headerSort: false,
    editor: "input",
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData.isChanged = true;
      cell.getRow().reformat();
    },
  },
  {
    title: "코드",
    field: "code",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    editor: "input",
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData.isChanged = true;
      cell.getRow().reformat();
    },
  },
  {
    title: "상위코드",
    field: "path",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    formatter: function (cell) {
      const rowData = cell.getRow().getData();

      let pathTextValue = "";

      if (!rowData.parentEntityId) {
        pathTextValue = "";
      } else if (rowData.isNewPath) {
        pathTextValue = rowData.path || "";
      } else if (rowData.path) {
        const pathSegments = rowData.path.split(".");
        if (pathSegments.length > 1) {
          pathTextValue = pathSegments.slice(0, -1).join(".");
        } else {
          pathTextValue = rowData.path;
        }
      }

      const pathText = document.createElement("span");
      pathText.innerText = pathTextValue;

      const button = document.createElement("button");
      button.innerText = "선택";

      button.onclick = async function () {
        if (isPopupOpen) return;
        isPopupOpen = true;
        try {
          const newPath = await openCodePopup(rowData.entityId);
          if (newPath) {
            rowData.isNewPath = true;
            rowData.path = newPath;
            pathText.innerText = newPath;
            await cell.getRow().update(rowData);
          }
        } finally {
          isPopupOpen = false;
        }
      };

      const space = document.createElement("span");
      space.innerText = " ";

      const container = document.createElement("div");
      container.appendChild(pathText);
      container.appendChild(space);
      container.appendChild(button);
      return container;
    },
  },
  {
    title: "사용여부",
    field: "usable",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    editor: "list",
    editorParams: {
      values: { true: "사용", false: "사용 안함" },
    },
    formatter: function (cell) {
      const value = cell.getValue();
      return value === true || value === "true" ? "사용" : "사용 안함";
    },
    cellClick: function (e, cell) {
      const row = cell.getRow();
      row.select();
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

      const rowData = cell.getRow().getData();
      rowData.isChanged = true;
      cell.getRow().reformat();
    },
  },
  {
    title: "비고",
    field: "remarkText",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    editor: "input",
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData.isChanged = true;
      cell.getRow().reformat();
    },
  },
];

const rows = ref([]);

function getDepth(node, currentDepth = 0) {
  if (!node.parentEntityId) {
    return currentDepth;
  }
  const parentNode = findNodeByEntityId(rows.value, node.parentEntityId);
  if (parentNode) {
    return getDepth(parentNode, currentDepth + 1);
  }
  return currentDepth;
}

function setIsChangedFlag(nodes) {
  nodes.forEach((node) => {
    node.isChanged = false;
    if (node.children) {
      setIsChangedFlag(node.children);
    }
  });
}

function getCodes() {
  if (canGetCode.value) {
    const param = {
      "entity.codeType": SERVICE,
    };

    codeApi
      .getCodes(param)
      .then((response) => {
        if (response.status === 200) {
          const sortDataByOrderNumber = (data) => {
            return data
              .map((item) => {
                if (item.children && item.children.length > 0) {
                  item.children = sortDataByOrderNumber(item.children);
                } else {
                  delete item.children;
                }
                return item;
              })
              .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
          };

          const sortedData = sortDataByOrderNumber(response.data);

          setIsChangedFlag(sortedData);

          rows.value = sortedData;
          originalRows.value = JSON.parse(JSON.stringify(sortedData));

          if (childRef.value) {
            childRef.value.replaceData(sortedData);
            childRef.value.redraw(true);
          }
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  } else {
    showAlert("서비스코드 조회 권한이 없습니다.");
  }
}

function openCodePopup(rowId) {
  selectedRowId.value = rowId;

  return new Promise((resolve) => {
    $q.dialog({
      component: CodePopup,
      componentProps: {
        codeList: rows.value,
      },
    })
      .onOk((payload) => {
        const { parentEntityId, path } = payload.payload;
        const currentRow = findNodeByEntityId(rows.value, selectedRowId.value);
        if (currentRow) {
          if (currentRow.entityId === parentEntityId) {
            showAlert("자기 자신을 상위 코드로 선택할 수 없습니다.");
            resolve(null);
            return;
          }

          if (isDescendant(currentRow.children || [], parentEntityId)) {
            showAlert("자신의 하위 코드를 상위 코드로 선택할 수 없습니다.");
            resolve(null);
            return;
          }

          const parentNodeDepth = parentEntityId ? getDepth(findNodeByEntityId(rows.value, parentEntityId)) : 0;

          const currentNodeMaxDepth = getMaxDepth(currentRow);

          if (parentNodeDepth + currentNodeMaxDepth >= 3) {
            showAlert("3depth를 초과할 수 없습니다.");
            resolve(null);
            return;
          }

          const originalParentEntityId = currentRow.parentEntityId;

          if (originalParentEntityId !== parentEntityId) {
            removeNodeFromCurrentPosition(currentRow.entityId);
            addNodeToParent(parentEntityId, currentRow);

            currentRow.parentEntityId = parentEntityId;
            currentRow.path = path;
            currentRow.isChanged = true;

            rows.value = [...rows.value];

            nextTick(() => {
              refreshTabulatorTree();
            });
          }
          resolve(path);
        }
      })
      .onCancel(() => {
        isPopupOpen = false;
        resolve(null);
      })
      .onDismiss(() => {
        isPopupOpen = false;
        selectedRowId.value = null;
      });
  });
}

function getMaxDepth(node) {
  if (!node.children || node.children.length === 0) {
    return 1;
  }

  let maxDepth = 0;
  node.children.forEach((child) => {
    const childDepth = getMaxDepth(child);
    if (childDepth > maxDepth) {
      maxDepth = childDepth;
    }
  });

  return maxDepth + 1;
}

function isDescendant(nodes, entityId) {
  for (const node of nodes) {
    if (node.entityId === entityId) {
      return true;
    }
    if (node.children && node.children.length > 0) {
      const found = isDescendant(node.children, entityId);
      if (found) {
        return true;
      }
    }
  }
  return false;
}

function addNodeToParent(parentEntityId, childNode) {
  if (!parentEntityId) {
    rows.value.push(childNode);
  } else {
    const parentNode = findNodeByEntityId(rows.value, parentEntityId);
    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }

      parentNode.children.push(childNode);
    }
  }
}

function removeNodeFromCurrentPosition(entityId) {
  const parentNode = findParentNodeByEntityId(rows.value, entityId);
  if (parentNode) {
    parentNode.children = parentNode.children.filter((child) => child.entityId !== entityId);
    if (parentNode.children.length === 0) {
      delete parentNode.children;
    }
  } else {
    rows.value = rows.value.filter((node) => node.entityId !== entityId);
  }
}

function findParentNodeByEntityId(nodes, entityId) {
  for (const node of nodes) {
    if (node.children && node.children.some((child) => child.entityId === entityId)) {
      return node;
    }
    if (node.children) {
      const foundNode = findParentNodeByEntityId(node.children, entityId);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
}

function findNodeByEntityId(nodes, entityId) {
  for (const node of nodes) {
    if (node.entityId === entityId) {
      return node;
    }
    if (node.children) {
      const foundNode = findNodeByEntityId(node.children, entityId);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
}

function refreshTabulatorTree() {
  if (childRef.value) {
    nextTick(() => {
      const dataSnapshot = JSON.parse(JSON.stringify(rows.value));

      childRef.value.clearData();
      childRef.value.replaceData(dataSnapshot);
      childRef.value.redraw(true);
    });
  }
}

function addEmptyRow() {
  const newRow = {
    entityId: tempEntityIdCounter--,
    name: "",
    code: "",
    path: "",
    usable: true,
    remarkText: "",
    isNewPath: true,
    isChanged: true,
  };

  rows.value.unshift(newRow);

  if (childRef.value) {
    nextTick(() => {
      childRef.value.replaceData(rows.value);
      childRef.value.redraw(true);
    });
  }
}

function resetIsChangedFlag(nodes) {
  nodes.forEach((node) => {
    node.isChanged = false;
    if (node.children) {
      resetIsChangedFlag(node.children);
    }
  });
}

function postCode() {
  const currentData = JSON.parse(JSON.stringify(childRef.value.getData()));
  const putParams = [];
  const postParams = [];

  let isAlertShown = false;

  const originalParentMap = {};
  function mapOriginalParents(nodes, parentEntityId) {
    nodes.forEach((node) => {
      if (node.entityId) {
        originalParentMap[node.entityId] = parentEntityId || null;
      }
      if (node.children && node.children.length > 0) {
        mapOriginalParents(node.children, node.entityId);
      }
    });
  }
  mapOriginalParents(originalRows.value, null);

  const movedNodesByOriginalParent = {};

  const isValid = processNodes(currentData, null);

  if (!isValid) {
    return;
  }

  adjustOrderNumbersInOriginalParents();

  if (putParams.length > 0) {
    codeStore
      .update({ entities: putParams })
      .then((response) => {
        if (response.status === 200) {
          if (!isAlertShown) {
            showAlert("저장되었습니다.");
            isAlertShown = true;
          }
          if (canGetCode.value) {
            getCodes();
          } else {
            rows.value = [];
          }

          resetIsChangedFlag(rows.value);
          refreshTabulatorTree();
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  if (postParams.length > 0) {
    codeStore
      .save({ entities: postParams })
      .then((response) => {
        if (response.status === 200) {
          if (!isAlertShown) {
            showAlert("저장되었습니다.");
            isAlertShown = true;
          }
          if (canGetCode.value) {
            getCodes();
          } else {
            rows.value = [];
          }

          resetIsChangedFlag(rows.value);
          refreshTabulatorTree();
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  function processNodes(nodes, parentEntityId) {
    let order = 1;

    for (const node of nodes) {
      if (!node.code || !node.name) {
        showAlert("코드와 이름을 입력하지 않은 항목이 존재합니다.");
        return false;
      }

      if (node.code.includes(".")) {
        showAlert("코드명에 .을 포함할 수 없습니다.");
        return false;
      }
      if (node.remarkText.length > 1024) {
        showAlert("비고의 길이는 1024자를 초과할 수 없습니다.");
        return;
      }
      const originalParentId = node.entityId > 0 ? originalParentMap[node.entityId] : null;

      let isMoved = false;
      if (node.entityId > 0 && originalParentId !== parentEntityId) {
        isMoved = true;

        if (!movedNodesByOriginalParent[originalParentId]) {
          movedNodesByOriginalParent[originalParentId] = [];
        }
        movedNodesByOriginalParent[originalParentId].push(node);
      }

      node.orderNumber = order++;

      const param = {
        code: node.code,
        codeType: SERVICE,
        name: node.name,
        orderNumber: node.orderNumber,
        usable: node.usable,
        remarkText: node.remarkText,
      };
      if (parentEntityId) {
        param.parent = { entityId: parentEntityId };
      }

      if (node.entityId > 0) {
        param.entityId = node.entityId;

        const originalNode = findOriginalNode(node.entityId);
        const isModified =
          originalNode.name !== node.name ||
          originalNode.code !== node.code ||
          originalNode.orderNumber !== node.orderNumber ||
          originalNode.usable !== node.usable ||
          originalNode.remarkText !== node.remarkText ||
          originalParentId !== parentEntityId;

        if (isModified || isMoved) {
          putParams.push(param);
        }
      } else {
        postParams.push(param);
      }

      if (node.children && node.children.length > 0) {
        const childResult = processNodes(node.children, node.entityId);
        if (!childResult) {
          return false;
        }
      }
    }
    return true;
  }

  function adjustOrderNumbersInOriginalParents() {
    Object.keys(movedNodesByOriginalParent).forEach((originalParentId) => {
      const originalParentChildren = getCurrentChildren(originalParentId, currentData);

      let order = 1;
      originalParentChildren.forEach((node) => {
        const movedNodes = movedNodesByOriginalParent[originalParentId];
        const isMoved = movedNodes.some((movedNode) => movedNode.entityId === node.entityId);
        if (!isMoved) {
          node.orderNumber = order++;

          const originalNode = findOriginalNode(node.entityId);
          if (originalNode) {
            const isModified = originalNode.orderNumber !== node.orderNumber;

            if (isModified) {
              const param = {
                entityId: node.entityId,
                orderNumber: node.orderNumber,
              };
              if (originalParentId) {
                param.parent = { entityId: originalParentId };
              }
              putParams.push(param);
            }
          }
        }
      });
    });
  }

  function getCurrentChildren(parentEntityId, nodes) {
    let result = [];
    nodes.forEach((node) => {
      const currentParentId = node.parentEntityId || null;
      if (currentParentId === parentEntityId) {
        result.push(node);
      }
      if (node.children && node.children.length > 0) {
        result = result.concat(getCurrentChildren(parentEntityId, node.children));
      }
    });
    return result;
  }

  function findOriginalNode(entityId, nodes = originalRows.value) {
    for (const node of nodes) {
      if (node.entityId === entityId) {
        return node;
      }
      if (node.children) {
        const found = findOriginalNode(entityId, node.children);
        if (found) return found;
      }
    }
    return null;
  }
}

const selectedRows = ref([]);

function rowSelected(selected) {
  selectedRows.value = selected;
}

async function deleteCode() {
  const selectedRowsData = childRef.value.getSelectedData();

  if (!selectedRowsData || selectedRowsData.length === 0) {
    showAlert("선택된 코드가 없습니다.");
    return;
  }

  const userConfirmed = await showConfirm("삭제 하시겠습니까?");

  if (userConfirmed) {
    selectedRowsData.forEach((rowData) => {
      const rowComponent = getRowFromEntityId(rowData.entityId);

      if (rowComponent) {
        rowComponent.delete();
      }

      removeNodeByEntityId(rows.value, rowData.entityId);
      removeNodeByEntityId(originalRows.value, rowData.entityId);

      if (rowData.entityId > 0) {
        codeApi
          .deleteCode(rowData.entityId)
          .then((response) => {
            if (response.status === 200) {
            }
          })
          .catch((error) => {
            rows.value.push(rowData);
            originalRows.value.push(JSON.parse(JSON.stringify(rowData)));
            if (childRef.value) {
              childRef.value.addRow(rowData);
            }

            handleApiError(error);
          });
      }
    });

    selectedRows.value = [];
  }
}

function getRowFromEntityId(entityId) {
  const allRows = childRef.value.getRows();
  for (const row of allRows) {
    const data = row.getData();
    if (data.entityId === entityId) {
      return row;
    }
  }
  return null;
}

function removeNodeByEntityId(nodes, entityId) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.entityId === entityId) {
      nodes.splice(i, 1);
      return true;
    } else if (node.children) {
      const found = removeNodeByEntityId(node.children, entityId);
      if (found) {
        if (node.children.length === 0) {
          delete node.children;
        }
        return true;
      }
    }
  }
  return false;
}

if (canGetCode.value) {
  watch(
    () => props.filteredRows,
    (newFilteredRows) => {
      childRef.value.replaceData(newFilteredRows);
    }
  );
}

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      getCodes();
    }, 100);
  });
});
</script>

<template>
  <div class="a-border full-height fit column q-pa-xs">
    <a-title-bar title="서비스 코드 목록" class="col-auto full-width q-mb-xs" />
    <tabulator-grid
      ref="childRef"
      :rows="rows"
      :columns="columns"
      @rowSelected="rowSelected"
      :reactiveData="false"
      class="col full-width"
      :dataTree="true"
      :dataTreeStartExpanded="true"
      :selectableRows="1"
    />

    <div class="row full-width justify-end q-pa-xs q-gutter-xs bg-grey-5 a-border">
      <a-btn v-if="canAddCode" label="추가" @click="addEmptyRow"></a-btn
      ><a-btn v-if="canRemoveCode" label="삭제" @click="deleteCode"></a-btn
      ><a-btn v-if="canAddCode || canSaveCode" label="저장" @click="postCode"></a-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-table {
  border-collapse: collapse;

  td .row {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  tr,
  td {
    padding: 1px map-get($space-xs, x);
    vertical-align: middle;
    height: $line-height + 2px;
  }

  td:nth-child(1) {
    background-color: $grey-2;
    width: 7%;
  }

  td:nth-child(2) {
    width: 13%;
  }

  td:nth-child(3) {
    background-color: $grey-2;
    width: 7%;
  }

  td:nth-child(4) {
    width: 13%;
  }

  td:nth-child(5) {
    background-color: $grey-2;
    width: 9%;
  }

  td:nth-child(6) {
    width: 7%;
  }
}
</style>
