<script setup>
defineProps({
  icon: String,
  label: {
    type: String,
    required: true,
  },
  value: [Number, String],
});
</script>

<template>
  <div class="row no-wrap items-center q-px-sm">
    <q-icon v-if="icon" class="q-mr-xs" :name="$props.icon" />
    <div class="text-no-wrap">{{ $props.label }}: {{ $props.value }}</div>
  </div>
</template>

<style lang="scss" scoped></style>
