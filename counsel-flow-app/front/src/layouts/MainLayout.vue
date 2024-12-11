<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import AHeader from "components/AHeader.vue";
import AQuickMenu from "components/AQuickMenu.vue";
import AFooter from "components/AFooter.vue";
import MainPage from "src/pages/MainPage.vue";

const headerRef = ref(null);
const footerRef = ref(null);
const pageHeight = ref(null);
const ticketBoard = ref();

onMounted(() => {
  adjustPageHeight();
  window.addEventListener("resize", adjustPageHeight);
});

onUnmounted(() => {
  window.removeEventListener("resize", adjustPageHeight);
});

function adjustPageHeight() {
  pageHeight.value = window.innerHeight - headerRef.value.$el.offsetHeight - footerRef.value.$el.offsetHeight;
}

function setTicketBoard(data) {
  ticketBoard.value = data;
}
</script>

<template>
  <q-layout view="hHh LpR lFf" class="min-width-layout">
    <a-header ref="headerRef" @ticket-board="setTicketBoard" />

    <a-quick-menu />

    <q-page-container ref="pageContainerRef">
      <main-page :style="{ height: pageHeight + 'px' }" />
    </q-page-container>

    <a-footer ref="footerRef" :ticketBoard="ticketBoard" />
  </q-layout>
</template>

<style lang="scss" scoped>
.min-width-layout {
  min-width: $body-width;
}
</style>
