<script setup>
import { ref, computed, watch } from "vue";
import ATab from "components/common/ATab.vue";
import ATabs from "components/common/ATabs.vue";

const CTL_TAB = "__ctl.tab.__";

const model = defineModel();
const tabs = defineModel("tabs", { type: Array, required: true });
defineEmits(["close", "closeAll"]);

const lockable = computed(() => {
  if (tabs.value) {
    const inx = tabs.value.findIndex(
      (tab) => tab.closable && tab.lockable && !tab.locked
    );
    return inx >= 0;
  }
  return false;
});

watch(model, (newValue, oldValue) => {
  if (newValue == CTL_TAB) {
    model.value = oldValue; // 컨트롤 탭으로 전환되지 않도록 막는다. 이게 최선?
  }
});

function toggleLockAll() {
  if (tabs.value) {
    const locked = lockable.value;
    tabs.value.forEach((tab) => {
      if (tab.closable && tab.lockable) {
        tab.locked = locked;
      }
    });
  }
}
</script>

<template>
  <a-tabs class="a-dyn-tabs" v-model="model">
    <a-tab
      v-for="tab in tabs"
      v-model:locked="tab.locked"
      :key="tab.name"
      :name="tab.name"
      :label="tab.label"
      :lockable="tab.lockable"
      :closable="tab.closable"
      :badge="tab.badge"
      @close="$emit('close', tab.name)"
    >
    </a-tab>
    <q-space />
    <a-tab class="ctrl-tab" :name="CTL_TAB">
      <template #private>
        <div class="row no-wrap">
          <q-btn
            dense
            round
            flat
            color="primary"
            size="sm"
            :ripple="false"
            :icon="lockable ? 'lock' : 'lock_open'"
            @click.stop="toggleLockAll"
          />
          <q-btn
            dense
            round
            flat
            color="primary"
            size="sm"
            :ripple="false"
            icon="close"
            @click.stop="$emit('closeAll')"
            style="margin-left: -3px"
          />
        </div>
      </template>
    </a-tab>
  </a-tabs>
</template>

<style lang="scss" scoped>
.a-dyn-tabs {
  :deep(.ctrl-tab) {
    opacity: 1;
  }
}
</style>
