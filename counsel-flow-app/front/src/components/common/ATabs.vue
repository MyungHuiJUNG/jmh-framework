<script setup></script>

<template>
  <q-tabs class="a-tabs" align="left" indicator-color="transparent" breakpoint="0" dense>
    <div class="space"></div>
    <slot></slot>
    <div class="space"></div>
  </q-tabs>
</template>

<style lang="scss" scoped>
.a-tabs::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: $grey-5;
}

.a-tabs {
  :deep(.space) {
    width: map-get($space-xs, x);
  }
}
</style>
