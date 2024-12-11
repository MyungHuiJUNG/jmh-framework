<script setup>
import { ref } from "vue";
import ABtn from "components/common/ABtn.vue";
import ATextarea from "components/common/ATextarea.vue";

const text = ref();

function saveMeno() {}
</script>

<template>
  <div>
    <a-textarea v-model="text" height="176px" />
    <div class="text-right">
      <a-btn label="저장" @click="saveMeno" class="q-mt-xs" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
