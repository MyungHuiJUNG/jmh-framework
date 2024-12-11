<script setup>
defineEmits(["close", "maximize"]);

const props = defineProps({
  title: String,
  maximize: Boolean,
  close: Boolean,
});
</script>

<template>
  <div class="row items-center relative-position bg-primary" style="height: 28px">
    <div class="text-bold text-white col text-center">{{ title }}</div>
    <div class="absolute-right row items-center" style="padding-right: 2px">
      <q-btn
        v-if="$props.maximize"
        icon="crop_din"
        color="white"
        size="sm"
        round
        dense
        flat
        @click="$emit('maximize')"
        style="margin-right: -4px"
      />
      <q-btn
        v-if="$props.close"
        icon="close"
        color="white"
        size="sm"
        v-close-popup
        round
        dense
        flat
        @click="$emit('close')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<!-- 다이얼로그는 그대로 사용가능 그외 컴포넌트에선 @close 이벤트로 닫기 이벤트 구현하기  -->
