<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useQuasar } from "quasar";
import categoryApi from "src/js/api/categoryApi";
import boardApi from "src/js/api/boardApi";
import ABtn from "components/common/ABtn.vue";
import BoardCatagoryManagePopup from "src/components/board/BoardCatagoryManagePopup.vue";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import FlowRoleCode from "src/js/common/FlowRoleCode";

const $q = useQuasar();
const permissionRoleStore = usePermissionRoleStore();

const props = defineProps({
  addAdjustTreeButton: {
    type: Boolean,
    defalut: false,
  },
  addChooseButton: {
    type: Boolean,
    defalut: false,
  },
  addCategoryManageComponent: {
    type: Boolean,
    defalut: false,
  },
});

const emit = defineEmits(["rowClick", "chooseCategory"]);
defineExpose({ getAllCategories });

let isPopupOpen = false;
const qtree = ref(null);
const originalCategoryData = ref("");
const formattedTreeData = ref([]);
const selected = ref("");
const expanded = ref([]);
const selectedRow = ref("");

const canManageCategory = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.BOARD_ROLE.CATEGORY_MANAGE));

const noButton = computed(() => {
  return !props.addAdjustTreeButton && !props.addChooseButton && !props.addCategoryManageComponent;
});

function treeCollapse() {
  qtree.value.collapseAll();
}

function treeExpand() {
  qtree.value.expandAll();
}

function chooseCategory() {
  if (!selectedRow.value) {
    showAlert("카테고리를 선택하세요.");
    return;
  }
  emit("chooseCategory", selectedRow.value);
}

function catagoryManagement() {
  if (isPopupOpen) return;
  isPopupOpen = true;
  try {
    openCategoryManagementPopup();
  } finally {
    isPopupOpen = false;
  }
}

function openCategoryManagementPopup() {
  return new Promise(() => {
    $q.dialog({
      component: BoardCatagoryManagePopup,
    })
      .onOk(() => {
        getAllCategories().then(() => {
          const selectedNode = findNodeByNodeKey(selectedRow.value, originalCategoryData.value);
          emit("rowClick", selectedNode);
        });
      })
      .onCancel(() => {
        isPopupOpen = false;
        getAllCategories();
      })
      .onDismiss(() => {
        isPopupOpen = false;
        getAllCategories();
      });
  });
}

function handleSelected(nodeKey) {
  selectedRow.value = nodeKey;
  const selectedNode = findNodeByNodeKey(nodeKey, originalCategoryData.value);
  emit("rowClick", selectedNode);
}

function findNodeByNodeKey(key, nodes) {
  for (const node of nodes) {
    if (node.entityId === key) {
      return node;
    }
    if (node.children) {
      const foundNode = findNodeByNodeKey(key, node.children);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
}

// 빈 자식 노드 속성 자체를 삭제
function filterChildrenField(data) {
  return data.map((item) => {
    item.displayName = `${item.name} (${item.boardCount})`;
    if (item.children && !item.children.length) {
      delete item.children;
    }
    if (item.children) item.children = filterChildrenField(item.children);
    return item;
  });
}

// 트리에 id값을 code값으로 대입해서 추가한다.
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

// filterChildrenFiled로 속성삭제 후 "전체"항목 추가한다.
function transformTreeData(data, totalCount) {
  const clonedData = JSON.parse(JSON.stringify(data));
  // 최상단에 "전체" 항목을 추가
  const root = [
    {
      entityId: "",
      name: "전체",
      code: "",
      boardCount: totalCount ? totalCount : 0,
      path: null,
      orderNumber: 0,
      children: clonedData,
    },
  ];
  filterChildrenField(root); // 최상단 노드부터 시작
  return addIdField(root);
}

// orderNumber순으로 정렬
function sortWithChildren(array) {
  return (
    array
      .map((item) => {
        // children이 있는 경우 재귀적으로 정렬
        if (item.children?.length) item.children = sortWithChildren(item.children);
        return item;
      })
      // 부모가 같은 형제 노드간의 비교
      .sort((a, b) => a.orderNumber - b.orderNumber)
  );
}

async function getAllCategories() {
  await categoryApi
    .getCategory()
    .then(async (response) => {
      await boardApi
        .getBoardsTotalCount()
        .then((res) => {
          originalCategoryData.value = response.data;
          const sortedData = sortWithChildren(response.data);
          formattedTreeData.value = transformTreeData(sortedData, res.data);
        })
        .catch((error) => {
          handleApiError(error);
        });
    })
    .catch((error) => {
      handleApiError(error);
    });
}

watch(formattedTreeData, () => {
  nextTick(() => {
    qtree.value.expandAll();
  });
});

onMounted(() => {
  getAllCategories();
});
</script>

<template>
  <div class="fit column no-wrap">
    <div class="col full-width">
      <q-tree
        ref="qtree"
        default-expand-all
        no-transition
        :nodes="formattedTreeData"
        node-key="entityId"
        label-key="displayName"
        selected-color="primary"
        v-model:selected="selected"
        v-model:expanded="expanded"
        @update:selected="handleSelected"
        no-nodes-label="목록이 없습니다."
        class="fit"
      />
    </div>
    <div class="bg-grey-5 q-pa-xs col-auto justify-end row no-wrap" v-if="!noButton">
      <a-btn icon="list" @click="treeCollapse" v-if="addAdjustTreeButton">
        <q-tooltip anchor="top middle" self="bottom middle">모두접기</q-tooltip>
      </a-btn>
      <a-btn icon="account_tree" @click="treeExpand" class="q-ml-xs" v-if="addAdjustTreeButton">
        <q-tooltip anchor="top middle" self="bottom middle">모두펼치기</q-tooltip>
      </a-btn>

      <a-btn
        label="카테고리관리"
        @click="catagoryManagement"
        class="q-ml-xs"
        v-if="addCategoryManageComponent && canManageCategory"
      />
      <a-btn label="선택" @click="chooseCategory" class="q-ml-xs" v-if="addChooseButton" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.t-column {
  background-color: $grey-2;
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

.q-tree {
  overflow: auto;

  :deep(.q-tree__node--selected) {
    background-color: $grey-2;
    font-weight: bold;
  }
}
</style>
