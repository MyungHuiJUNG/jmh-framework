<script setup>
import TabulatorGrid from "components/common/TabulatorGrid.vue";
import { ref } from "vue";

const rows = ref([]);
const columns = [
  { title: "제품구분", field: "var1", headerHozAlign: "center", hozAlign: "center" },
  { title: "상태", field: "var2", headerHozAlign: "center", hozAlign: "center" },
  { title: "신고번호", field: "var3", headerHozAlign: "center", hozAlign: "center" },
  { title: "품목", field: "var4", headerHozAlign: "center", hozAlign: "center" },
  { title: "제품명", field: "var5", headerHozAlign: "center", hozAlign: "center" },
  { title: "상호", field: "var6", headerHozAlign: "center", hozAlign: "center" },
  { title: "담당자", field: "var7", headerHozAlign: "center", hozAlign: "center" },
  { title: "제출일자", field: "var8", headerHozAlign: "center", hozAlign: "center" },
  { title: "접수일자", field: "var9", headerHozAlign: "center", hozAlign: "center" },
  { title: "수정일자", field: "var10", headerHozAlign: "center", hozAlign: "center" },
  { title: "남은처리일자", field: "var11", headerHozAlign: "center", hozAlign: "center" },
];
</script>

<template>
  <TabulatorGrid :rows="rows" :columns="columns" class="fit col" />
</template>

<style lang="scss" scoped></style>
