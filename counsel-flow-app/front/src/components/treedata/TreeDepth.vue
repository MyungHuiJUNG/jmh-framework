<script setup>
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import ABtn from "components/common/ABtn.vue";
import ATitleBar from "components/common/ATitleBar.vue";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { ref, watch, computed } from "vue";
import { showAlert } from "src/js/common/dialog";
import FlowRoleCode from "src/js/common/FlowRoleCode";

const permissionRoleStore = usePermissionRoleStore();

const model = defineModel();
const props = defineProps({
  title: { type: String },
  data: { type: Array },
  typeName: { type: String },
  isTop: { type: Boolean, default: false },
  parentEntity: { type: Object },
  viewType: { type: String, required: true },
});
const emit = defineEmits(["rowSelected", "deleteRow", "saveRows", "rowClick"]);
defineExpose({ selectRow });

const rows = ref([]);
const grid = ref(null);

const permissionCodes = {
  organization: {
    add: FlowRoleCode.ORGANIZATION_ROLE.ADD,
    remove: FlowRoleCode.ORGANIZATION_ROLE.DELETE,
    save: FlowRoleCode.ORGANIZATION_ROLE.SAVE,
  },
  counselType: {
    add: FlowRoleCode.COUNSEL_TYPE_ROLE.ADD,
    remove: FlowRoleCode.COUNSEL_TYPE_ROLE.DELETE,
    save: FlowRoleCode.COUNSEL_TYPE_ROLE.SAVE,
  },
};

const canAdd = props.viewType && computed(() => permissionRoleStore.hasPermission(permissionCodes[props.viewType].add));
const canRemove =
  props.viewType && computed(() => permissionRoleStore.hasPermission(permissionCodes[props.viewType].remove));
const canSave =
  props.viewType && computed(() => permissionRoleStore.hasPermission(permissionCodes[props.viewType].save));

const rowHeader = {
  headerSort: false,
  resizable: false,
  minWidth: 30,
  width: 30,
  rowHandle: true,
  formatter: "handle",
};

const columns = [
  // {
  //   formatter: "rowSelection",
  //   titleFormatter: null,
  //   hozAlign: "center",
  //   headerHozAlign: "center",
  //   headerSort: false,
  //   width: 20,
  //   resizable: false,
  // },
  {
    title: "#",
    field: "rownum",
    formatter: "rownum",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    resizable: false,
    width: 50,
  },
  {
    title: "코드",
    field: "code",
    editor: "input",
    headerSort: false,
    headerHozAlign: "center",
    hozAlign: "center",
    resizable: false,
  },
  {
    title: props.typeName,
    field: "name",
    editor: "input",
    headerSort: false,
    headerHozAlign: "center",
    hozAlign: "left",
    resizable: false,
  },
];

watch(
  () => props.data,
  (newVal) => {
    rows.value = JSON.parse(JSON.stringify(newVal));
    model.value = null; // model 초기화
  }
);

function emitRowClick(row) {
  emit("rowClick", row);
}

function addRow() {
  if (!props.isTop && !props.parentEntity?.entityId) {
    showAlert("상위유형을 선택해주세요.");
    return;
  }

  rows.value.unshift({ code: "", name: "" }); // 값을 아예 안주면 맨 처음 생성되고 grid가 바로 select를 못함
  let index = 0;

  rows.value.forEach((row) => {
    row.orderNumber = index + 1;
    index++;
  });
}

function deleteRow() {
  const selectedRow = grid.value.getSelectedData();

  // 미선택시
  if (!selectedRow?.length) {
    emit("deleteRow", null);
    return;
  }

  // 추가된 빈 row 삭제시
  for (const row of selectedRow) {
    if (!row.entityId) {
      const rowIndex = rows.value.findIndex((r) => r === row);
      if (rowIndex !== -1) {
        rows.value.splice(rowIndex, 1); // 해당 row 삭제
        return;
      }
    }
  }
  // 데이터 있는 row 삭제
  emit("deleteRow", model.value.entityId);
}

function updateSelectedRow(row) {
  row.map((item) => {
    model.value = {
      entityId: item.entityId,
      code: item.code,
    }; // model에 entityId 추가
    emit("rowSelected", item);
  });
}

function selectRow(id) {
  grid.value.deselectAllRows();
  grid.value.selectRows(id);
}

function handleDeselected(row) {
  row.map((item) => {
    emit("rowSelected", item);
  });
  model.value = null; // 선택 해제 시 model 초기화
}

function handleRowMoved(data) {
  // 바뀐 rows를 반영한 orderNumber 재부여
  data.forEach((item, index) => {
    item.orderNumber = index + 1;
  });
  rows.value = data;
}

// EntityId를 기준으로 신규와 수정을 구분

function saveRows() {
  const originalData = JSON.parse(JSON.stringify(props.data));
  const currentData = grid.value.getData();

  const { newRows, modifiedRows } = getNewAndModifiedRows(originalData, currentData);
  const invalidRows = [...newRows, ...modifiedRows].filter((row) => row.name?.length > 1024);
  if (invalidRows.length) {
    showAlert("이름은 1024자를 초과할 수 없습니다.");
    return;
  }

  if (newRows?.length || modifiedRows?.length) emit("saveRows", { newRows, modifiedRows });
}

function getNewAndModifiedRows(original, current) {
  const newRows = [];
  const modifiedRows = [];

  for (const currentRow of current) {
    const originalRow = original.find((row) => row.entityId === currentRow.entityId);

    if (!originalRow) newRows.push(currentRow); // 신규 항목으로 분류
    else if (JSON.stringify(currentRow) !== JSON.stringify(originalRow)) modifiedRows.push(currentRow); // 수정된 항목으로 분류
  }

  return { newRows, modifiedRows };
}
</script>

<template>
  <div class="fit column">
    <a-title-bar :title="title" class="col-auto full-width q-mb-xs" />
    <TabulatorGrid
      :rows="rows"
      :columns="columns"
      :selectable-rows="1"
      movable-rows
      :row-header="rowHeader"
      @row-selected="updateSelectedRow"
      @row-deselected="handleDeselected"
      @row-moved="handleRowMoved"
      @row-click="emitRowClick"
      class="full-width col"
      ref="grid"
    />
    <div class="text-right bg-grey-5 a-border q-pa-xs col-auto" v-if="canAdd || canRemove || canSave">
      <a-btn v-if="canAdd" label="추가" @click="addRow" />
      <a-btn v-if="canRemove" label="삭제" class="q-ml-xs" @click="deleteRow" />
      <a-btn v-if="canAdd || canSave" label="저장" class="q-ml-xs" @click="saveRows" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
