<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  name: {
    type: [Number, String],
    required: true,
  },
  label: [Number, String],
  lockable: Boolean,
  closable: Boolean,
  badge: [Number, String],
});
const locked = defineModel("locked");
defineEmits(["close"]);

const badgeRight = computed(() => {
  let right = 1;
  if (props.closable) {
    right += 16;
    if (props.lockable) {
      right += 18;
    }
  }
  return `${right}px`;
});
</script>

<template>
  <q-tab class="a-tab" :name="$props.name" :ripple="false" no-caps>
    <slot name="private">
      <div class="row items-center no-wrap">
        <div class="q-px-md">
          {{ $props.label }}
          <q-badge v-if="$props.badge" floating rounded>{{ $props.badge }}</q-badge>
        </div>
        <q-btn
          v-if="$props.lockable && $props.closable"
          dense
          round
          flat
          size="xs"
          :ripple="false"
          :icon="locked ? 'lock' : 'lock_open'"
          @click.stop="locked = !locked"
        />
        <q-btn
          v-if="$props.closable"
          :disable="locked"
          dense
          round
          flat
          size="xs"
          :ripple="false"
          icon="close"
          @click.stop="$emit('close', $props.name)"
          style="margin-left: -3px"
        />
      </div>
    </slot>
  </q-tab>
</template>

<style lang="scss" scoped>
.a-tab {
  min-height: $line-height;
  height: 30px;
  padding: 0;
  border: 1px solid $grey-5;
  border-radius: 4px 4px 0 0;
  border-bottom: none;
  background-color: white;

  :deep(.q-badge) {
    top: 3px;
    right: v-bind(badgeRight);
  }
}

.a-tab.q-tab--inactive {
  height: 29px;
  margin-bottom: 1px;
  border: 1px solid $grey-4;
  border-bottom: none;
  background-color: $grey-2;
}
</style>
