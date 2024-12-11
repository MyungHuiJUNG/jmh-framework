<script setup>
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { useQuasar } from "quasar";
import AInput from "components/common/AInput.vue";
import ASelect from "components/common/ASelect.vue";
import ABtn from "components/common/ABtn.vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import menuApi from "src/js/api/menuApi";
import ACheckbox from "components/common/ACheckbox.vue";
import MenuPopup from "./MenuPopup.vue";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert, showConfirm } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import ATitleBar from "../common/ATitleBar.vue";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import ALoadingSpinner from "../common/ALoadingSpinner.vue";

const TAB = FlowSystemCode.MENU_ACTION_TYPE.TAB;
const NONE = FlowSystemCode.MENU_ACTION_TYPE.NONE;

const $q = useQuasar();
const permissionRoleStore = usePermissionRoleStore();

const canGetMenu = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.MENU_ROLE.READ));
const canSaveMenu = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.MENU_ROLE.SAVE));

let isPopupOpen = false;

const useMenuName = ref(false);
const useUsable = ref(false);
const menuName = ref("");
const useState = ref(null);
const useStateList = [
  { label: "전체", value: null },
  { label: "사용", value: true },
  { label: "사용 안함", value: false },
];

const gridRef = ref(null);

const rows = ref([]);

const loading = ref(false);

const columns = [
  {
    title: "#",
    field: "rownum",
    formatter: "rownum",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    resizable: false,
    width: "50",
  },
  {
    title: "메뉴명",
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
    title: "순서",
    field: "orderNumber",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    editor: "input",
    width: "50",
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },
  {
    title: "메뉴코드",
    field: "code",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
  {
    title: "상위코드",
    field: "path",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    formatter: function (cell, formatterParams, onRendered) {
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

      // 컨테이너 생성
      const container = document.createElement("div");

      const pathText = document.createElement("span");
      pathText.innerText = pathTextValue;

      const button = document.createElement("button");
      button.innerText = "선택";

      button.addEventListener("click", async function (event) {
        event.stopPropagation();
        if (isPopupOpen) return;
        isPopupOpen = true;
        try {
          const result = await openMenuPopup(rowData);
          if (result) {
            const { parentEntityId, newPath } = result;
            if (newPath) {
              moveItemToNewParent(rowData, parentEntityId);

              rowData.isNewPath = true;
              rowData.path = newPath;
              rowData.parentEntityId = parentEntityId;
              rowData._isModified = true;

              rows.value = [...rows.value];

              gridRef.value.replaceData(rows.value);

              cell.getTable().redraw(true);
            }
          }
        } finally {
          isPopupOpen = false;
        }
      });

      const space = document.createElement("span");
      space.innerText = " ";

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
    title: "액션타입",
    field: "actionType",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: "150",
    editor: "list",
    editorParams: {
      values: {
        NONE: "없음",
        TAB: "탭",
      },
    },
    formatter: function (cell) {
      const value = cell.getValue();
      if (value === null || value === "" || value == NONE) {
        return "없음";
      } else if (value === TAB) {
        return "탭";
      } else {
        return value;
      }
    },
    cellEdited: function (cell) {
      let newValue = cell.getValue();
      if (newValue === "") {
        newValue = null;
      }
      cell.setValue(newValue);
      cell.getRow().reformat();

      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },
  {
    title: "메뉴 아이콘",
    field: "iconSrc",
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
        img.src = new URL(`../../assets/default-icon-set/${rowData.code}.svg`, import.meta.url).href;
      } else if (rowData.iconImageFile && rowData.iconImageFile.downloadUrl) {
        menuApi
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
              await menuApi.deleteMenuImage("REMOVE_ICON_BASE", rowData.entityId);

              rowData.iconSrc = null;
              rowData.iconImageFile = null;

              cell.getRow().update(rowData);
              cell.getTable().redraw(true);
            } catch (error) {
              handleApiError(error);
            }
          }
        } else {
          openImageUploadDialog(rowData, "iconFile", cell);
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
    title: "퀵메뉴 사용여부",
    field: "quickUsable",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: "150",
    editor: "list",
    editorParams: {
      values: { true: "사용", false: "사용 안함" },
    },
    formatter: function (cell) {
      if (!cell.getRow().getData().parentEntityId) {
        return null;
      } else {
        const value = cell.getValue();
        return value === true || value === "true" ? "사용" : "사용 안함";
      }
    },
    editable: function (cell) {
      const rowData = cell.getRow().getData();
      return !!rowData.parentEntityId; // parentEntityId가 있을 경우에만 편집 가능
    },
    cellEdited: function (cell) {
      let newValue = cell.getValue();

      if (newValue === "true" || newValue === "사용") {
        newValue = true;
      } else if (newValue === "false" || newValue === "사용 안함") {
        newValue = false;
      }

      if (typeof newValue === "boolean") {
        cell.getRow().update({ quickUsable: newValue }); // 수정된 부분
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
    title: "퀵메뉴 순서",
    field: "quickOrderNumber",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    editor: "input",
    width: "100",
    formatter: function (cell) {
      if (!cell.getRow().getData().parentEntityId) {
        return null;
      } else {
        return cell.getValue();
      }
    },
    editable: function (cell) {
      const rowData = cell.getRow().getData();
      return !!rowData.parentEntityId; // parentEntityId가 있을 경우에만 편집 가능
    },
    cellEdited: function (cell) {
      const rowData = cell.getRow().getData();
      rowData._isModified = true;
    },
  },
  {
    title: "퀵메뉴 아이콘",
    field: "quickIconSrc",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    width: "150",
    formatter: function (cell, formatterParams, onRendered) {
      if (!cell.getRow().getData().parentEntityId) {
        return null;
      } else {
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

        const quickIconUrl =
          rowData.quickIconSrc || (rowData.quickIconImageFile ? rowData.quickIconImageFile.downloadUrl : null);

        if (rowData.quickIconSrc) {
          img.src = rowData.quickIconSrc;
        } else if (!rowData.quickIconSrc && !rowData.quickIconImageFile) {
          img.src = new URL(`../../assets/default-icon-set/${rowData.code}.svg`, import.meta.url).href;
        } else if (rowData.quickIconImageFile && rowData.quickIconImageFile.downloadUrl) {
          menuApi
            .getImageWithToken(rowData.quickIconImageFile.downloadUrl)
            .then((icon) => {
              img.src = icon;
            })
            .catch((error) => {
              handleApiError(error);
            });
        }

        container.appendChild(imgContainer);

        const button = document.createElement("button");
        button.innerText = quickIconUrl ? "삭제" : "등록";

        button.addEventListener("click", async function (event) {
          event.stopPropagation();

          if (quickIconUrl) {
            const confirmDelete = await showConfirm("이미지를 삭제 하시겠습니까?");
            if (confirmDelete) {
              try {
                await menuApi.deleteMenuImage("REMOVE_ICON_QUICK", rowData.entityId);

                rowData.quickIconSrc = null;
                rowData.quickIconImageFile = null;

                cell.getRow().update(rowData);
                cell.getTable().redraw(true);
              } catch (error) {
                handleApiError(error);
              }
            }
          } else {
            openImageUploadDialog(rowData, "quickIconFile", cell);
          }
        });

        container.appendChild(button);

        return container;
      }
    },
  },
];

function openMenuPopup(currentRowData) {
  return new Promise((resolve) => {
    $q.dialog({
      component: MenuPopup,
      componentProps: {
        menuList: rows.value,
      },
    })
      .onOk((payload) => {
        const { parentEntityId, path } = payload.payload;
        if (currentRowData) {
          if (currentRowData.entityId === parentEntityId) {
            showAlert("자기 자신을 상위 코드로 선택할 수 없습니다.");
            resolve(null);
            return;
          }

          if (isDescendant(currentRowData.children || [], parentEntityId)) {
            showAlert("자신의 하위 코드를 상위 코드로 선택할 수 없습니다.");
            resolve(null);
            return;
          }

          resolve({ parentEntityId, newPath: path });
        } else {
          resolve(null);
        }
      })
      .onCancel(() => {
        resolve(null);
      })
      .onDismiss(() => {
        resolve(null);
      });
  });
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

function moveItemToNewParent(item, newParentEntityId) {
  // 기존 부모에서 아이템 제거
  removeItemFromParent(item, rows.value);

  // 새로운 부모에 아이템 추가
  addItemToNewParent(item, newParentEntityId, rows.value);
}

function removeItemFromParent(item, dataArray) {
  for (let i = 0; i < dataArray.length; i++) {
    const currentItem = dataArray[i];
    if (currentItem.entityId === item.entityId) {
      dataArray.splice(i, 1);
      return true;
    } else if (currentItem.children && currentItem.children.length > 0) {
      const found = removeItemFromParent(item, currentItem.children);
      if (found) return true;
    }
  }
  return false;
}

function addItemToNewParent(item, newParentEntityId, dataArray) {
  if (!newParentEntityId) {
    // 최상위 노드로 이동
    dataArray.push(item);
    return true;
  }
  for (const currentItem of dataArray) {
    if (currentItem.entityId === newParentEntityId) {
      if (!currentItem.children) currentItem.children = [];
      currentItem.children.push(item);
      return true;
    } else if (currentItem.children && currentItem.children.length > 0) {
      const found = addItemToNewParent(item, newParentEntityId, currentItem.children);
      if (found) return true;
    }
  }
  return false;
}

// 이미지 업로드
function openImageUploadDialog(rowData, field, cell) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (file) {
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "image/bmp",
        "image/x-icon",
        "image/tiff",
        "image/avif",
      ];
      if (!validImageTypes.includes(file.type)) {
        showAlert("이미지 파일만 업로드 가능합니다.");
        fileInput.value = ""; // 선택된 파일 초기화
        return;
      }
      // field 값에 따라 파일 객체를 저장할 속성 이름 결정 (iconFile or quickIconFile)
      const fileFieldName = field === "iconFile" ? "iconFile" : "quickIconFile";
      rowData[fileFieldName] = file;
      rowData._isModified = true;

      // 미리보기를 위해 Base64로 변환하여 표시
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageDataUrl = e.target.result;

        // 메뉴 아이콘일 경우 iconSrc, 퀵메뉴 아이콘일 경우 quickIconSrc에 미리보기 저장
        if (field === "iconFile") {
          rowData["iconSrc"] = imageDataUrl;
        } else if (field === "quickIconFile") {
          rowData["quickIconSrc"] = imageDataUrl;
        }

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

async function getMenus() {
  if (canGetMenu.value) {
    try {
      const response = await menuApi.getMenus();
      if (response.status === 200) {
        const sortDataByOrderNumber = (data) => {
          return data
            .map((item) => {
              const { children, ...rest } = item;
              const transformedItem = {
                ...rest,
              };

              if (children && children.length > 0) {
                transformedItem.children = sortDataByOrderNumber(children);
              }
              return transformedItem;
            })
            .sort((a, b) => a.orderNumber - b.orderNumber);
        };

        const sortedData = sortDataByOrderNumber(response.data);
        rows.value = sortedData;

        applyFilters();
      }
    } catch (error) {
      handleApiError(error);
    }
  } else {
    showAlert("메뉴 조회 권한이 없습니다.");
  }
}

function putMenus() {
  const allRows = gridRef.value.getData();
  const modifiedRows = [];

  if (!validateOrderNumbers(allRows)) {
    return;
  }

  if (!validateQuickOrderNumbers(allRows)) {
    return; // 퀵메뉴 순서 중복 시 저장 중단
  }

  if (!validateQuickMenuFields(allRows)) {
    return; // 필수 항목 누락 시 저장 중단
  }

  // 수정된 행 수집
  function collectModifiedRows(dataArray) {
    dataArray.forEach((item) => {
      if (item._isModified) {
        modifiedRows.push(item);
      }
      if (item.children && item.children.length > 0) {
        collectModifiedRows(item.children);
      }
    });
  }

  collectModifiedRows(allRows);

  if (modifiedRows.length === 0) {
    showAlert("수정된 메뉴가 없습니다.");
    return;
  }

  const updatePromises = modifiedRows.map((rowData) => {
    const menuId = rowData.entityId;
    if (!menuId) {
      return Promise.resolve();
    }

    const formData = new FormData();

    formData.append("entity.code", rowData.code);
    formData.append("entity.name", rowData.name);
    formData.append("entity.orderNumber", rowData.orderNumber);
    formData.append("entity.actionType", rowData.actionType || "NONE");
    formData.append("entity.quickUsable", rowData.quickUsable || false);
    formData.append("entity.usable", rowData.usable || false);

    if (rowData.quickOrderNumber) {
      formData.append("entity.quickOrderNumber", rowData.quickOrderNumber);
    }

    // 파일 추가 (파일 필드가 존재하는 경우만)
    if (rowData.iconFile) {
      formData.append("iconFile", rowData.iconFile);
    }
    if (rowData.quickIconFile) {
      formData.append("quickIconFile", rowData.quickIconFile);
    }
    // 부모 엔티티 ID 처리
    if (rowData.parentEntityId) {
      formData.append("entity.parent.entityId", rowData.parentEntityId);
    }

    return menuApi
      .putMenu(formData, menuId)
      .then(() => {
        rowData._isModified = false;
      })
      .catch((error) => {
        showAlert(`메뉴 '${rowData.name}' 업데이트 중 오류가 발생했습니다.`);
        throw error;
      });
  });

  Promise.all(updatePromises)
    .then(() => {
      showAlert("메뉴가 성공적으로 저장되었습니다.");
      getMenus();
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function validateOrderNumbers(dataArray) {
  let isValid = true;
  const duplicateMessages = [];

  function checkDuplicates(items, parentName) {
    const orderNumbers = {};
    for (const item of items) {
      if (orderNumbers[item.orderNumber]) {
        duplicateMessages.push(`'${parentName || "최상위 노드"}'에서 순서 번호 '${item.orderNumber}'가 중복됩니다.`);
        isValid = false;
      } else {
        orderNumbers[item.orderNumber] = true;
      }
      if (item.children && item.children.length > 0) {
        checkDuplicates(item.children, item.name);
      }
    }
  }

  checkDuplicates(dataArray, null);

  if (!isValid) {
    showAlert(duplicateMessages.join("\n"));
  }

  return isValid;
}

function validateQuickMenuFields(dataArray) {
  let isValid = true;
  const errorMessages = [];
  let quickMenuUsageWarningShown = false;

  function checkRows(items) {
    items.forEach((item) => {
      if (item.quickUsable === true || item.quickUsable === "true") {
        if (!quickMenuUsageWarningShown) {
          errorMessages.push(`퀵메뉴 사용여부가 '사용'인 경우,`);
          quickMenuUsageWarningShown = true;
        }

        if (!item.quickOrderNumber && item.quickOrderNumber !== 0) {
          errorMessages.push(`'${item.name}'의 퀵메뉴 순서를 입력해야 합니다.`);
          isValid = false;
        }

        // const hasQuickIcon =
        //   item.quickIconFile || item.quickIconSrc || (item.quickIconImageFile && item.quickIconImageFile.downloadUrl);

        // if (!hasQuickIcon) {
        //   errorMessages.push(`'${item.name}'의 퀵메뉴 아이콘을 등록해야 합니다.`);
        //   isValid = false;
        // }
      }

      if (item.children && item.children.length > 0) {
        checkRows(item.children);
      }
    });
  }

  checkRows(dataArray);

  if (!isValid) {
    showAlert(errorMessages.join("\n"));
  }

  return isValid;
}

function validateQuickOrderNumbers(dataArray) {
  let isValid = true;
  const duplicateMessages = [];
  const quickOrderNumbers = {};

  function checkDuplicates(items) {
    items.forEach((item) => {
      if (item.quickUsable === true || item.quickUsable === "true") {
        const orderNumber = item.quickOrderNumber;
        if (orderNumber === null || orderNumber === undefined || orderNumber === "") {
          return;
        }

        if (quickOrderNumbers[orderNumber]) {
          duplicateMessages.push(`퀵메뉴 순서 번호 '${orderNumber}'가 중복됩니다.`);
          isValid = false;
        } else {
          quickOrderNumbers[orderNumber] = item.name;
        }
      }

      if (item.children && item.children.length > 0) {
        checkDuplicates(item.children);
      }
    });
  }

  checkDuplicates(dataArray);

  if (!isValid) {
    showAlert(duplicateMessages.join("\n"));
  }

  return isValid;
}

async function search() {
  loading.value = true;

  await getMenus();

  applyFilters();

  nextTick(() => {
    loading.value = false;
  });
}

function applyFilters() {
  let filteredData = JSON.parse(JSON.stringify(rows.value));

  if (useMenuName.value && menuName.value?.trim()) {
    filteredData = recursiveSearch(filteredData, menuName.value.trim(), "name");
  }

  if (useUsable.value && useState.value !== null) {
    filteredData = recursiveFilterByUsable(filteredData, useState.value);
  }

  rows.value = filteredData;

  gridRef.value.replaceData(filteredData);
}

function recursiveSearch(data, searchTerm, field) {
  return data.reduce((acc, item) => {
    const currentItem = { ...item };
    let match = false;

    if (currentItem[field] && currentItem[field].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
      match = true;
    }

    if (currentItem.children && currentItem.children.length > 0) {
      const childResults = recursiveSearch(currentItem.children, searchTerm, field);
      if (childResults.length > 0) {
        match = true;
        currentItem.children = childResults;
      } else if (match) {
        currentItem.children = item.children;
      } else {
        delete currentItem.children;
      }
    }

    if (match) {
      acc.push(currentItem);
    }

    return acc;
  }, []);
}

function recursiveFilterByUsable(data, usable) {
  return data.reduce((acc, item) => {
    const currentItem = { ...item };
    let match = currentItem.usable === usable;

    if (currentItem.children && currentItem.children.length > 0) {
      const childResults = recursiveFilterByUsable(currentItem.children, usable);
      if (childResults.length > 0) {
        match = true;
        currentItem.children = childResults;
      } else if (match) {
        currentItem.children = item.children;
      } else {
        delete currentItem.children;
      }
    }

    if (match) {
      acc.push(currentItem);
    }

    return acc;
  }, []);
}

async function reset() {
  useMenuName.value = false;
  useUsable.value = false;
  menuName.value = "";
  useState.value = null;
}

function setInitialIcons() {
  const hasIcons = [];
  const hasQuickIcons = [];

  function findHasImg(datas, icons, quickIcons) {
    for (const row of datas) {
      if (row.iconImageFile?.downloadUrl) {
        icons.push(row.entityId);
      }
      if (row.quickIconImageFile?.downloadUrl) {
        quickIcons.push(row.entityId);
      }

      if (Array.isArray(row.children)) {
        findHasImg(row.children, icons, quickIcons);
      }
    }
  }

  findHasImg(rows.value, hasIcons, hasQuickIcons);

  if (!hasIcons.length && !hasQuickIcons.length) {
    showAlert("등록된 아이콘이 없습니다.");
    return;
  }

  showConfirm("등록된 아이콘이 모두 기본 아이콘으로 대체됩니다. 초기화 하시겠습니까?").then((res) => {
    if (res) {
      const iconPromises = hasIcons.map((entityId) => menuApi.deleteMenuImage("REMOVE_ICON_BASE", entityId));
      const quickIconPromises = hasQuickIcons.map((entityId) => menuApi.deleteMenuImage("REMOVE_ICON_QUICK", entityId));

      Promise.all([...iconPromises, ...quickIconPromises])
        .then(() => {
          getMenus();
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  });
}

watch(menuName, (newValue) => {
  if (newValue) useMenuName.value = true;
  else useMenuName.value = false;
});

watch(useState, (newValue) => {
  if (newValue) useUsable.value = true;
  else useUsable.value = false;
});

onMounted(async () => {
  loading.value = true;
  await getMenus();
  loading.value = false;
});
</script>

<template>
  <div class="fit column">
    <table class="a-table a-border q-mb-xs full-width col-auto">
      <colgroup>
        <col class="t-column" width="120px" />
        <col width="200px" />
        <col class="t-column" width="120px" />
        <col width="120px" />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <td class="a-border">
            <div class="row">
              <a-checkbox v-model="useMenuName" label="메뉴명" />
            </div>
          </td>
          <td>
            <div class="row">
              <a-input v-model="menuName" @keyup.enter="search" class="full-width"></a-input>
            </div>
          </td>
          <td class="a-border">
            <div class="row">
              <a-checkbox v-model="useUsable" label="사용여부" />
            </div>
          </td>
          <td>
            <div class="row">
              <a-select class="select-width" v-model="useState" :options="useStateList"></a-select>
            </div>
          </td>

          <td>
            <div class="text-right">
              <a-btn label="조회" @click="search"></a-btn><a-btn label="초기화" @click="reset" class="q-ml-xs"></a-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="col column full-width a-border q-pa-xs">
      <a-title-bar title="메뉴 목록" class="col-auto full-width q-mb-xs" />
      <tabulator-grid
        ref="gridRef"
        :rows="rows"
        :columns="columns"
        :reactiveData="false"
        class="col full-width"
        :dataTree="true"
        :dataTreeStartExpanded="true"
        :dataTreeElementColumn="'name'"
        :selectableRows="1"
      />

      <div class="row full-width justify-end q-pa-xs q-gutter-xs bg-grey-5 a-border">
        <a-btn v-if="canSaveMenu" label="아이콘 초기화" @click="setInitialIcons"></a-btn>
        <a-btn v-if="canSaveMenu" label="저장" @click="putMenus" class="q-ml-xs"></a-btn>
      </div>
    </div>
    <a-loading-spinner v-model="loading" />
  </div>
</template>

<style lang="scss" scoped>
.t-column {
  background-color: $grey-2;
}

.select-width {
  flex: 1 1 100px;
}

.a-table,
.a-table tr,
.a-table td {
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
</style>
