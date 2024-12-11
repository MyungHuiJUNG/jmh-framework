<script setup>
import { ref, onMounted } from "vue";
const model = defineModel();
const inputRef = ref();

function onInput(event) {
  model.value = event.target.value;
}

onMounted(() => {
  const el = inputRef.value.nativeEl;
  if (el) {
    el.addEventListener("input", onInput);
  }
});
</script>

<template>
  <q-input class="a-input" v-model="model" ref="inputRef" outlined dense>
    <slot></slot>
  </q-input>
</template>

<style lang="scss" scoped>
.a-input {
  :deep(.q-field__control) {
    height: calc($line-height - 4px);
    padding: 0 6px;
  }
  :deep(.q-field__native) {
    padding: 0;
  }
  :deep(.q-field__marginal) {
    height: 100%;
  }
  :deep(.q-field__label) {
    display: none;
  }
}

.a-input {
  :deep(.q-field__control) {
    &::before {
      border-style: solid !important;
    }
  }
}
</style>
