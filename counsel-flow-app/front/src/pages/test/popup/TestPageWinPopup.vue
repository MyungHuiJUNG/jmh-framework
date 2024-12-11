<template>
  <div style="height: 100%">
    <div>
        window Popup 테스트입니다.
    </div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";

const props = defineProps({
  propsData: {
    type: Object,
    default: null
  }
})

onMounted(() => {
  console.log('넘어옴?', props.propsData);
})
</script>

<style scoped>

</style>
