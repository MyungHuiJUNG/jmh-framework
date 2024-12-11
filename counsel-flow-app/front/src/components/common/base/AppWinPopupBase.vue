<template>
  <component :is="isComp" :propsData="props" />
</template>

<script setup>

import {defineAsyncComponent, onMounted, ref} from "vue";
const storagePropsKey = "flow-winpopup-props";
let props;

const allPath = import.meta.glob('@/**/*.vue');
const componetName = new URLSearchParams(window.location.search).get("comp");

props = JSON.parse(localStorage.getItem(storagePropsKey));
localStorage.removeItem(storagePropsKey);

const isComp = defineAsyncComponent(() => {
  const matchedComponent = Object.keys(allPath).find(path => path.includes(componetName));
  if (matchedComponent) {
    return allPath[matchedComponent]();
  } else {
    return Promise.reject(new Error(`Component not found: ㅋㅋㅋㅋ`));
  }
})

</script>

<style scoped>

</style>
