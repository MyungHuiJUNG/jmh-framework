<script setup>
const imgPath = new URL(`../../assets/images/call/call_btn.png`, import.meta.url).href;
</script>

<template>
  <q-btn round dense padding="0" unelevated :icon="`img:${imgPath}`">
    <slot></slot>
  </q-btn>
</template>
