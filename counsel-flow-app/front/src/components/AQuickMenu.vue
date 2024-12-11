<script setup>
import { computed } from "vue";
import { useMainTabStore } from "src/stores/mainTab";
import { useMenuStore } from "src/stores/menuStore";

const mainTabStore = useMainTabStore();
const menuStore = useMenuStore();
const quickMenuItems = computed(() => menuStore.quickMenuItems);

function openMenu(item) {
  mainTabStore.addTab({
    name: item.code,
    label: item.name,
  });
}

const defaultUrl = (code) => {
  return new URL(`../assets/default-icon-set/${code}.svg`, import.meta.url).href;
};
</script>

<template>
  <q-drawer :model-value="true" behavior="desktop" :width="50" bordered>
    <q-scroll-area class="fit">
      <div class="column items-center q-py-sm">
        <div v-for="item in quickMenuItems" :key="item.entityId" class="q-ma-sm cursor-pointer" @click="openMenu(item)">
          <div v-if="item.iconUrl">
            <img :src="item.iconUrl" alt="icon" style="width: 24px; height: 24px" />
            <q-tooltip anchor="center end" self="center start">{{ item.name }}</q-tooltip>
          </div>
          <div v-else>
            <img :src="defaultUrl(item.code)" alt="icon" style="width: 24px; height: 24px" />
            <q-tooltip anchor="center end" self="center start">{{ item.name }}</q-tooltip>
          </div>
        </div>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<style lang="scss" scoped></style>
