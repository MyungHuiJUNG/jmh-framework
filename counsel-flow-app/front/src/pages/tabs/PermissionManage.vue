<script setup>
import PermissionList from "src/components/permissions/PermissionList.vue";
import UserList from "src/components/permissions/UserList.vue";
import PermissionTabs from "src/components/permissions/PermissionTabs.vue";
</script>

<template>
  <div class="row no-wrap fit a-border q-pa-xs" style="min-height: 813px">
    <div class="col-5 column">
      <PermissionList class="a-border q-pa-xs col q-mb-xs" />
      <UserList class="a-border q-pa-xs col" />
    </div>
    <div class="col-7 q-ml-xs column">
      <PermissionTabs class="a-border q-pa-xs col" />
    </div>
  </div>
</template>
