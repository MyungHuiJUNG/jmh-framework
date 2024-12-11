<script setup></script>

<template>
  <q-btn color="primary" unelevated>
    <slot></slot>
  </q-btn>
</template>

<style lang="scss" scoped>
.q-btn {
  height: calc($line-height - 4px);
  padding: 0px 8px;
  min-height: 0;
}
</style>
