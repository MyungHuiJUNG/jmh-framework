<script setup>
import AMenu from "components/AMenu.vue";

defineProps({ offset: Array });
</script>

<template>
  <q-btn icon="menu">
    <AMenu :offset="$props.offset" />
  </q-btn>
</template>

<style lang="scss" scoped></style>
