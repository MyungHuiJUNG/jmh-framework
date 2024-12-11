<script setup>
const model = defineModel();
defineProps({
  options: Array,
  optionLabel: {
    type: String,
    default: "label",
  },
  optionValue: {
    type: String,
    default: "value",
  },
});

function isClick() {
  // console.log(model.value);
}
</script>

<template>
  <q-select
    class="a-select"
    v-model="model"
    :options="options"
    options-dense
    outlined
    :option-label="$props.optionLabel"
    :option-value="$props.optionValue"
    map-options
    emit-value
  >
    <template v-slot:option="slotProps">
      <slot name="option" v-bind="slotProps">
        <q-item v-bind="slotProps.itemProps" class="a-select-item" @click="isClick">
          <q-item-section>
            <q-item-label v-if="typeof slotProps.opt === 'string'">
              {{ slotProps.opt }}
            </q-item-label>

            <q-item-label v-if="typeof slotProps.opt === 'object'">
              {{ slotProps.opt[$props.optionLabel] }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </slot>
    </template>
  </q-select>
</template>

<style lang="scss" scoped>
.a-select {
  :deep(.q-field__control) {
    min-height: calc($line-height - 4px);
    height: calc($line-height - 4px);
    padding: 0;
  }
  :deep(.q-field__control-container) {
    padding: 0;
  }
  :deep(.q-field__native) {
    min-height: calc($line-height - 4px);
    height: calc($line-height - 4px);
    padding: 0 6px;
    white-space: nowrap;
    overflow: hidden;
  }
  :deep(.q-field__marginal) {
    height: 100%;
    padding: 0;
  }
  :deep(.q-field__label) {
    display: none;
  }
}

.a-select-item {
  min-height: calc($line-height - 4px);
  height: calc($line-height - 4px);
}
</style>
