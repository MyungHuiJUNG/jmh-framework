<script setup>
import { ref, onMounted, watch, computed } from "vue";
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import permissionApi from "src/js/api/permissionApi";
import { usePermissionStore } from "src/stores/permissionStore";
import { showAlert } from "src/js/common/dialog.js";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import ABtn from "../common/ABtn.vue";
import AInput from "../common/AInput.vue";

const permissionStore = usePermissionStore();
const childRef = ref(null);

const permissionRoleStore = usePermissionRoleStore();
const canEditRoles = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.PERMISSION_ROLE.GROUP_SETTING));

const lastScroll = ref(null);

const emit = defineEmits(["go-menu", "go-role"]);

const columns = [
  //Define Table Columns
  {
    field: "name",
    hozAlign: "left",
    headerHozAlign: "left",
    headerSort: false,
  },
  {
    field: "toggle",
    hozAlign: "center",
    headerSort: false,
    formatter: function (cell, formatterParams, onRendered) {
      let isOn = cell.getValue();
      let toggleButton = document.createElement("div");
      toggleButton.className = `toggle-button ${isOn ? "on" : "off"}`;
      let toggleKnob = document.createElement("div");
      toggleKnob.className = "toggle-knob";
      toggleButton.innerHTML = isOn ? "ON" : "OFF";
      toggleButton.appendChild(toggleKnob);
      return toggleButton.outerHTML;
    },
    cellClick: function (e, cell) {
      if (!canEditRoles.value) {
        showAlert("수정 권한이 없습니다.");
        return;
      }
      saveScrollPosition();

      const data = cell.getRow().getData();
      let newState = !data.toggle;
      updateChildToggles(data, newState);
      updateParentToggles(cell.getRow(), newState);
      cell.getTable().redraw(true);
      postRolesByPermissions();

      restoreScrollPosition();
    },
    width: "200",
  },
];

function updateParentToggles(row, newState) {
  const parent = row.getTreeParent();
  if (parent) {
    const parentData = parent.getData();
    if (newState) {
      parentData.toggle = true;
      updateParentToggles(parent, true);
    } else {
      const siblings = parent.getTreeChildren();
      const anySiblingOn = siblings.some((sibling) => sibling.getData().toggle);
      if (!anySiblingOn) {
        parentData.toggle = false;
        updateParentToggles(parent, false);
      }
    }
  }
}

function updateChildToggles(node, newState) {
  node.toggle = newState;
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => updateChildToggles(child, newState));
  }
}

const rows = ref([]);

function getRoles() {
  permissionApi
    .getRoles()
    .then((response) => {
      if (response.status === 200) {
        const sortDataByOrderNumber = (data) => {
          return data
            .map((item) => {
              const { children, entityId, ...rest } = item;
              const isActive = permissionStore.roleIds.includes(entityId);
              const transformedItem = {
                ...rest,
                id: entityId,
                toggle: isActive,
              };

              if (children && children.length > 0) {
                transformedItem.children = sortDataByOrderNumber(children);
              }
              return transformedItem;
            })
            .sort((a, b) => a.orderNumber - b.orderNumber);
        };

        const transformedData = sortDataByOrderNumber(response.data);
        rows.value = transformedData;
        clearKeyword();
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function saveScrollPosition() {
  lastScroll.value = childRef.value.getScrollPosition();
}

function restoreScrollPosition() {
  childRef.value.scrollMove(lastScroll.value);
}

function rowSelected(selected) {
  selectedRows.value = selected;
}

const selectedRows = ref([]);

function postRolesByPermissions() {
  if (permissionStore.entityId == null) {
    showAlert("선택된 권한이 없습니다.");
    return;
  }

  const allRows = childRef.value.getData();

  const activeEntities = [];

  function findActiveEntities(row) {
    if (row.toggle) {
      activeEntities.push({ entityId: row.id });
    }

    if (row.children && row.children.length > 0) {
      row.children.forEach((childRow) => findActiveEntities(childRow));
    }
  }

  allRows.forEach((row) => findActiveEntities(row));

  const param = {
    entities: activeEntities,
  };

  permissionApi
    .postRolesByPermission(param, permissionStore.entityId)
    .then(() => {})
    .catch((error) => {
      handleApiError(error);
    });
}

watch(
  () => permissionStore.roleIds,
  () => {
    getRoles();
  },
  { immediate: true }
);

onMounted(() => getRoles());

const searchResults = ref([]); // 검색 결과 목록
const currentResultIndex = ref(-1); // 현재 결과 인덱스
const searchKeyword = ref(""); // 검색 키워드
const lastSearchKeyword = ref(""); // 마지막 검색 키워드

function searchRows() {
  if (!searchKeyword.value) {
    return;
  }

  // 키워드가 변경되었거나 첫 검색인 경우
  if (
    searchResults.value.length === 0 ||
    currentResultIndex.value === -1 ||
    searchKeyword.value !== lastSearchKeyword.value
  ) {
    const allRows = childRef.value.getRows(); // Tabulator row 객체 배열

    // 모든 검색 결과 찾기
    function findAllMatchingRows(rows, keyword) {
      const results = [];
      for (let row of rows) {
        const rowData = row.getData();
        if (
          Object.values(rowData).some(
            (value) => value && value.toString().toLowerCase().includes(keyword.toLowerCase())
          )
        ) {
          results.push(row); // 매칭된 row 추가
        }

        // children 검색
        const children = row.getTreeChildren();
        if (children && children.length > 0) {
          results.push(...findAllMatchingRows(children, keyword));
        }
      }
      return results;
    }

    // 새로운 검색 수행
    const results = findAllMatchingRows(allRows, searchKeyword.value);

    if (results.length > 0) {
      searchResults.value = results; // 검색 결과 저장
      currentResultIndex.value = 0; // 첫 번째 결과로 초기화
      lastSearchKeyword.value = searchKeyword.value; // 마지막 키워드 업데이트
      scrollToCurrentResult(); // 첫 번째 결과로 이동
    } else {
      searchResults.value = [];
      currentResultIndex.value = -1;
      showAlert("검색 결과가 없습니다.");
    }
  } else {
    // 이미 검색된 결과에서 다음 결과로 이동
    nextSearchResult();
  }
}

function nextSearchResult() {
  if (searchResults.value.length === 0) {
    showAlert("검색 결과가 없습니다.");
    return;
  }

  // 다음 인덱스 계산
  currentResultIndex.value = (currentResultIndex.value + 1) % searchResults.value.length;
  scrollToCurrentResult(); // 다음 결과로 이동
}

function scrollToCurrentResult() {
  childRef.value.deselectAllRows();
  if (searchResults.value.length === 0 || currentResultIndex.value === -1) return;

  const currentRow = searchResults.value[currentResultIndex.value];
  childRef.value.scrollToRow(currentRow, "top"); // 현재 결과로 스크롤
  currentRow.select();
}

function clearKeyword() {
  searchKeyword.value = "";
  currentResultIndex.value = -1;
  lastSearchKeyword.value = "";
  searchResults.value = [];
}
</script>

<template>
  <div class="column col fit no-wrap">
    <div class="col-auto row fixed-height q-mb-xs">
      <div class="col-auto t-column text-left top-border-left justify-center column q-px-xs">권한명</div>
      <div class="col-auto top-border-left row flex-center q-px-xs" style="width: 200px">
        <a-input class="text-no-wrap col" v-model="searchKeyword" @keyup.enter="searchRows" />
      </div>
      <div class="col top-border-right justify-center column q-px-xs">
        <div class="row">
          <div class="col"></div>
          <div class="col-auto q-ml-xs text-right">
            <a-btn label="조회" @click="searchRows" />
            <a-btn label="초기화" class="q-ml-xs" @click="clearKeyword" />
          </div>
        </div>
      </div>
    </div>
    <tabulator-grid
      :rows="rows"
      :columns="columns"
      @rowSelected="rowSelected"
      @rowDeselected="rowSelected"
      class="full-width col"
      :dataTree="true"
      :dataTreeStartExpanded="true"
      :selectableRows="1"
      ref="childRef"
    />
  </div>
</template>

<style lang="scss" scoped>
.fixed-height {
  height: $line-height + 2;
}
.t-column {
  background-color: $grey-2;
  width: 120px;
}
.top-border-left {
  border: 1px solid $grey-5;
  border-right: none;
}

.top-border-right {
  border: 1px solid $grey-5;
  border-left: none;
}
</style>
