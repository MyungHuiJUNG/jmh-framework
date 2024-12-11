<script setup>
import { onMounted, ref } from "vue";
import { useMainTabStore } from "src/stores/mainTab";
import { useAuthStore } from "src/stores/authStore";
import { useMenuStore } from "src/stores/menuStore";
import TreeMenu from "components/TreeMenu.vue";

const mainTabStore = useMainTabStore();
const authStore = useAuthStore();
const menuStore = useMenuStore();

const openMenu = ref(false);

function click(menu) {
  openMenu.value = false;
  mainTabStore.addTab(menu);
}

// onMounted(() => {
//   const roleGroupId = authStore.roleGroup ? authStore.roleGroup.entityId : null;
//   menuStore.getMenus(roleGroupId);
// });
</script>

<template>
  <q-menu v-model="openMenu" square class="a-menu">
    <q-list>
      <TreeMenu v-for="menu in menuStore.dynamicMenuList" :key="menu.name" :menu="menu" :depth="1" @click="click" />
    </q-list>
  </q-menu>
</template>

<style lang="scss">
.q-menu.a-menu {
  min-width: 300px;
  min-height: calc(100vh - 70px); // 100vh - header's height
}
</style>
