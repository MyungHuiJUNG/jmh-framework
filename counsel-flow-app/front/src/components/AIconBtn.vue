<script setup>
defineProps({ label: String, icon: String, disable: Boolean });
</script>

<template>
  <q-btn class="a-icon-btn" :disable="$props.disable">
    <slot></slot>
    <div class="">
      <q-icon
        :class="{
          'text-grey-7': $props.disable,
          'text-primary': !$props.disable,
        }"
        :name="$props.icon"
      />
      <div style="font-size: 13px">{{ $props.label }}</div>
    </div>
  </q-btn>
</template>

<style lang="scss" scoped>
.a-icon-btn {
  padding: 3px;
  width: 60px; // default size.
  height: 56px; //
}

.a-icon-btn.disabled {
  background-color: $grey-3;
}
</style>
