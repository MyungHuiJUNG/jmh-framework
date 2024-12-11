<script setup>
import UserProfile from "src/components/profiles/UserProfile.vue";
import UserShortCut from "src/components/profiles/UserShortCut.vue";
</script>

<template>
  <div class="column no-wrap fit a-border q-pa-xs" style="min-height: 730px">
    <div class="row col no-wrap">
      <UserProfile class="col-3" />
      <UserShortCut class="col q-ml-xs" />
    </div>
  </div>
</template>
