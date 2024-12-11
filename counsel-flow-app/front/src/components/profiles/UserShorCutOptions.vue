<script setup>
import ASelect from "../common/ASelect.vue";
import ATextarea from "../common/ATextarea.vue";
import ABtn from "../common/ABtn.vue";
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useCounselTypeStore } from "src/stores/counselTypeStore";

defineProps(["number"]);
const model = defineModel();

const counselTypeStore = useCounselTypeStore();
const counselTypeCodeLarge = ref(); // 상담유형1
const counselTypeCodeMedium = ref(); // 상담유형2
const counselTypeCodeSmall = ref(); // 상담유형3

const isInitialLoad = ref(false);

// 상담유형 path를 계산하는 computed 속성
const counselTypePath = computed(() => {
  return [counselTypeCodeLarge.value?.code, counselTypeCodeMedium.value?.code, counselTypeCodeSmall.value?.code]
    .filter(Boolean) // 빈 값 제거
    .join("."); // '.'로 연결
});

const counselTypeCodeLargeOptions = ref(
  computed(() => {
    return [
      { name: "전체", value: null },
      ...counselTypeStore.counselTypeArray.map((item) => ({
        name: item.name,
        value: item,
      })),
    ];
  })
);
const counselTypeCodeMediumOptions = ref([{ name: "전체", value: null }]);
const counselTypeCodeSmallOptions = ref([{ name: "전체", value: null }]);

watch(
  counselTypeCodeLargeOptions,
  (newOptions) => {
    if (newOptions.length > 0 && !counselTypeCodeLarge.value) {
      counselTypeCodeLarge.value = null;
    }
  },
  { immediate: true }
);
watch(
  counselTypeCodeLarge,
  (newVal) => {
    if (newVal) {
      counselTypeCodeMediumOptions.value = [
        { name: "전체", value: null },
        ...counselTypeStore.getChildrenCounselTypesByTopParentCodeValue(newVal.code).map((item) => ({
          name: item.name,
          value: item,
        })),
      ];
      if (!isInitialLoad.value) {
        counselTypeCodeMedium.value = null;
        counselTypeCodeSmall.value = null;
      }
    } else {
      counselTypeCodeMediumOptions.value = [{ name: "전체", value: null }];
      counselTypeCodeSmallOptions.value = [{ name: "전체", value: null }];
      counselTypeCodeMedium.value = null;
      counselTypeCodeSmall.value = null;
    }
  },
  { immediate: true }
);
watch(
  counselTypeCodeMedium,
  (newVal) => {
    if (newVal) {
      counselTypeCodeSmallOptions.value = [
        { name: "전체", value: null },
        ...counselTypeStore.getChildrenCounselTypesByTopParentCodeValue(newVal.code).map((item) => ({
          name: item.name,
          value: item,
        })),
      ];
      if (!isInitialLoad.value) counselTypeCodeSmall.value = null;
    } else {
      counselTypeCodeSmallOptions.value = [{ name: "전체", value: null }];
      counselTypeCodeSmall.value = null;
    }
  },
  { immediate: true }
);

watch(counselTypePath, (newVal) => {
  model.value.counselTypePath = newVal;
});

watch(model, (newVal) => {
  setCounselType(newVal.counselTypePath);
});

function setCounselType(path) {
  if (!path) return;
  isInitialLoad.value = true;
  const pathArray = path.split(".");
  if (pathArray.length > 0) counselTypeCodeLarge.value = counselTypeStore.counselTypes.get(pathArray[0]);
  if (pathArray.length > 1) counselTypeCodeMedium.value = counselTypeStore.counselTypes.get(pathArray[1]);
  if (pathArray.length > 2) counselTypeCodeSmall.value = counselTypeStore.counselTypes.get(pathArray[2]);
  nextTick(() => (isInitialLoad.value = false));
}
</script>

<template>
  <div class="col row full-width">
    <div class="body-border-left col-2 flex-center row full-height">
      <span>Ctrl + Number {{ number }}</span>
    </div>
    <div class="body-border-left col-4 row full-height">
      <div class="row fit flex-center q-px-xs">
        <a-select
          class="col"
          :options="counselTypeCodeLargeOptions"
          v-model="counselTypeCodeLarge"
          option-label="name"
        />
        <a-select
          class="col"
          :options="counselTypeCodeMediumOptions"
          v-model="counselTypeCodeMedium"
          option-label="name"
        />
        <a-select
          class="col"
          :options="counselTypeCodeSmallOptions"
          v-model="counselTypeCodeSmall"
          option-label="name"
        />
      </div>
    </div>
    <div class="body-border-right col-6 flex-center column q-pa-xs full-height">
      <a-textarea height="100%" class="col fit" v-model="model.contents" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-border-left {
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}

.body-border-right {
  border: 1px solid $grey-5;
  border-top: none;
}
</style>
