<script setup>
import { ref } from "vue";
import MenuSettings from "./PermissionMenu.vue";
import RoleSettings from "./PermissionRole.vue";
import ATitleBar from "../common/ATitleBar.vue";
import ATabs from "../common/ATabs.vue";
import ATab from "../common/ATab.vue";

let title = "권한 그룹별 설정";
const selectedTab = ref("menu");
</script>

<template>
  <div class="column full-width">
    <a-title-bar :title="title" class="col-auto full-width" />
    <div class="body a-border col column q-pt-xs full-width">
      <a-tabs v-model="selectedTab" class="col-auto">
        <a-tab name="menu" label="메뉴" />
        <a-tab name="role" label="기능관련" />
      </a-tabs>
      <div class="col full-width q-pa-xs" v-if="selectedTab === 'menu'">
        <MenuSettings class="fit" />
      </div>
      <div class="col full-width q-pa-xs" v-if="selectedTab === 'role'">
        <RoleSettings class="fit" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body {
  border-top: none;
}
</style>
