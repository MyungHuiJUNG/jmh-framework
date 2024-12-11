<script setup>
import { watch } from "vue";
const model = defineModel();
const props = defineProps({
  height: String,
});
const emit = defineEmits(["input"]);

watch(model, () => {
  emit("input");
});
</script>

<template>
  <q-input type="textarea" class="a-textarea" v-model="model" outlined dense />
</template>

<style lang="scss" scoped>
.a-textarea {
  :deep(.q-field__native) {
    resize: none;
    min-height: 0px !important;
  }
  :deep(.q-field__control) {
    height: v-bind(height);
    min-height: 0px !important;
  }
}

.a-textarea {
  :deep(.q-field__control) {
    &::before {
      border-style: solid !important;
    }
  }
}
</style>
