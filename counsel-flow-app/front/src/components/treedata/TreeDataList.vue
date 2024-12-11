<script setup>
import ABtn from "components/common/ABtn.vue";
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps(["data", "columns", "filter"]);
const emit = defineEmits(["rowClick"]);

const grid = ref(null);
const selected = ref("");
const expanded = ref([]);

function treeExpand() {
  grid.value.expandAll();
}

function treeCollapse() {
  // grid.value.collapseAll();
  const topNode = props.data.find((node) => node.name === "전체");
  if (topNode && topNode.children) {
    expanded.value = expanded.value.filter((key) => key === null);
  }
}

function handleSelected(path) {
  emit("rowClick", path);
}

// 컴퓨티드 속성: 필터링된 노드 반환
const filteredNodes = computed(() => {
  if (!props.filter?.name && !props.filter?.code) {
    return props.data;
  }
  return props.data.map((node) => filterNode(node)).filter((node) => node !== null);
});

// 재귀적으로 노드를 필터링하는 함수
const filterNode = (node) => {
  const hasNameFilter = props.filter.name && props.filter.name.trim() !== "";
  const hasCodeFilter = props.filter.code && props.filter.code.trim() !== "";

  const matchesName = hasNameFilter ? node.name.toLowerCase().includes(props.filter.name.trim().toLowerCase()) : true; // 필터가 없으면 true
  const matchesCode = hasCodeFilter ? node.code.toLowerCase().includes(props.filter.code.trim().toLowerCase()) : true; // 필터가 없으면 true

  // AND 조건 적용
  const isMatch = (hasNameFilter ? matchesName : true) && (hasCodeFilter ? matchesCode : true);

  // 자식 노드 필터링
  let children = [];
  if (node.children && node.children.length > 0) {
    children = node.children.map((child) => filterNode(child)).filter((child) => child !== null);
  }

  // 필터에 맞는 경우: 노드 포함 및 모든 자식 노드 표시
  if (isMatch) {
    return {
      ...node,
      children: node.children ? node.children : null, // 모든 자식 노드 표시
    };
  }

  // 필터에 맞지 않지만, 자식 노드 중 일부가 맞는 경우: 매칭된 자식 노드만 포함
  if (children.length > 0) {
    return {
      ...node,
      children: children,
    };
  }

  // 필터에 맞지 않고 자식 노드도 없으면 제외
  return null;
};

watch(filteredNodes, () => {
  nextTick(() => {
    grid.value.expandAll();
  });
});
</script>

<template>
  <div class="fit column">
    <div class="col full-width">
      <q-tree
        class="fit"
        default-expand-all
        no-transition
        :nodes="filteredNodes"
        node-key="path"
        label-key="name"
        ref="grid"
        selected-color="primary"
        v-model:selected="selected"
        v-model:expanded="expanded"
        @update:selected="handleSelected"
        no-nodes-label="목록이 없습니다."
      />
    </div>
    <div class="full-width col-auto bg-grey-5 q-pa-xs">
      <a-btn icon="list" @click="treeCollapse">
        <q-tooltip anchor="top middle" self="bottom middle">접기</q-tooltip>
      </a-btn>
      <a-btn icon="account_tree" @click="treeExpand" class="q-ml-xs">
        <q-tooltip anchor="top middle" self="bottom middle">펼치기</q-tooltip>
      </a-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-tree {
  overflow: auto;
  :deep(.q-tree__node--selected) {
    background-color: $grey-2;
    font-weight: bold;
  }
}
</style>
