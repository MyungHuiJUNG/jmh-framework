<script setup>
import ATitleBar from "../common/ATitleBar.vue";
import ATextEditor from "../common/ATextEditor.vue";
import AInput from "../common/AInput.vue";
import { ref, onMounted } from "vue";

const scriptData = ref({
  name: null,
  title: null,
  contents: null,
});

function setData(data) {
  scriptData.value.name = data.counselTypeNameWithPath;
  scriptData.value.title = data.title;
  scriptData.value.contents = data.contents;
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const popupKey = params.get("popupKey");
  if (popupKey) {
    const data = localStorage.getItem(popupKey);
    if (data) {
      setData(JSON.parse(data));
      localStorage.removeItem(popupKey);
    }
  }
});
</script>

<template>
  <div class="column no-wrap fit q-pa-xs">
    <ATitleBar title="상담유형별 스크립트" class="col-auto full-width" />
    <div class="col full-width column">
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left top-border-left q-px-xs column justify-center">상담유형</div>
        <div class="col top-border-right justify-center column q-px-xs">
          <a-input readonly v-model="scriptData.name" />
        </div>
      </div>
      <div class="col-auto row fixed-height full-width">
        <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center full-height">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>제목</div>
        </div>
        <div class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height justify-center column">
          <a-input readonly v-model="scriptData.title" />
        </div>
      </div>
      <div class="col row full-width">
        <div class="col-auto t-column text-left body-border-left q-px-xs column justify-center full-height">
          <div class="row"><q-badge class="q-pa-none q-mr-xs" color="grey-2" text-color="red">*</q-badge>내용</div>
        </div>
        <div class="col body-border-right q-pa-xs no-wrap text-no-wrap full-height">
          <ATextEditor class="col fit column no-wrap" :readOnly="true" :content-input="scriptData.contents" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fixed-height {
  height: $line-height + 2;
}

.top-border-left {
  border: 1px solid $grey-5;
  border-right: none;
}

.top-border-right {
  border: 1px solid $grey-5;
}

.body-border-left {
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
}

.body-border-right {
  border: 1px solid $grey-5;
  border-top: none;
}

.t-column {
  width: 10%;
  background-color: $grey-2;
}
</style>
