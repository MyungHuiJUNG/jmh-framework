<script setup>
const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
  depth: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["click"]);

const isMaterialIcon = (icon) => {
  return icon && icon !== null && !icon.includes("/");
};

function click(menu) {
  if (!props.menu.children) {
    emit("click", menu);
  }
}

const defaultUrl = (code) => {
  return new URL(`../assets/default-icon-set/${code}.svg`, import.meta.url).href;
};
</script>

<template>
  <q-expansion-item
    :group="depth === 1 ? 'group' : undefined"
    :hide-expand-icon="!menu.children"
    :dense="depth > 1"
    :class="`depth${depth}`"
    @click="click(menu)"
  >
    <template v-slot:header>
      <q-item-section>
        <div class="row items-center">
          <q-icon v-if="isMaterialIcon(menu.icon)" :name="menu.icon" size="xs" class="q-mr-md" />
          <img
            v-else-if="menu.icon"
            :src="menu.icon"
            class="q-mr-md"
            style="width: 18px; height: 20px; object-fit: fill"
          />
          <img
            v-else-if="!menu.icon"
            :src="defaultUrl(menu.name)"
            class="q-mr-md"
            style="width: 18px; height: 20px; object-fit: fill"
          />
          <q-item-label>{{ menu.label }}</q-item-label>
        </div>
      </q-item-section>
    </template>

    <template v-if="menu.children">
      <TreeMenu
        v-for="submenu in menu.children"
        :key="submenu.name"
        :menu="submenu"
        :depth="depth + 1"
        @click="$emit('click', $event)"
      />
    </template>
  </q-expansion-item>
</template>

<style lang="scss" scoped>
.q-expansion-item {
  > :deep(.q-expansion-item__container) {
    > .q-item[aria-expanded="true"] {
      color: $primary;
      font-weight: bold;
    }
  }

  &.depth1 > :deep(.q-expansion-item__container) {
    > .q-item[aria-expanded="true"] {
      &:first-child {
        background: $primary;
        color: white;

        .q-item__section--side {
          color: white;
        }
      }

      & + .q-expansion-item__content {
        background: $blue-grey-1;
      }
    }
  }
}

.depth1 {
  font-size: 15px;
  font-weight: bold;

  @for $i from 2 through 10 {
    .depth#{$i} :deep(.q-item) {
      padding-left: #{50 + ($i - 2) * 10}px;
    }
  }

  .depth2 :deep(.q-item) {
    font-size: 14px;
    font-weight: normal;
  }

  .depth3 :deep(.q-item) {
    font-size: 13px;
    font-weight: normal;
  }
}
</style>
