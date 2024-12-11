<script setup>
import ATitleBar from "../common/ATitleBar.vue";
import ABtn from "../common/ABtn.vue";
import UserShorCutOptions from "./UserShorCutOptions.vue";
import { ref, onMounted } from "vue";
import { useCommandStore } from "src/stores/commandStore";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import commandApi from "src/js/api/commandApi";
import { useAuthStore } from "src/stores/authStore";
import { handleApiError } from "src/js/common/errorHandler";
import { showAlert } from "src/js/common/dialog";

const commandStore = useCommandStore();
const authStore = useAuthStore();

const options = ref(Array(10).fill({ counselTypePath: null, contents: null }));
const previousOptions = ref([]);

function setOptions() {
  for (let i = 0; i < 10; i++) {
    const customKey = i < 9 ? `${i + 1}` : "0";
    const combinationKey = `${FlowSystemCode.SHORT_CUT_KEY_TYPE.SPECIFIC}-${FlowSystemCode.SHORT_CUT_SPECIFIC.CTRL}-${FlowSystemCode.SHORT_CUT_KEY_TYPE.DIGIT}-${customKey}`;
    const result = commandStore.commandMap.get(combinationKey);

    if (result && result.length > 0) {
      // 각 옵션에 값을 바인딩 (i번째 option에 설정)
      options.value[i] = {
        counselTypePath: null,
        contents: null, // 'contents'는 result[1]에서 가져오고, 없으면 null로 설정
        counselTypeCommandEid: null,
        textCommandEid: null,
      };
      result.forEach((item) => {
        if (item.commandType === FlowSystemCode.COMMAND_TYPE.COUNSEL_TYPE) {
          options.value[i].counselTypePath = item.command; // COUNSEL_TYPE일 때 counselType 설정
          options.value[i].counselTypeCommandEid = item.entityId;
        } else if (item.commandType === FlowSystemCode.COMMAND_TYPE.TEXT) {
          options.value[i].contents = item.command; // TEXT일 때 contents 설정
          options.value[i].textCommandEid = item.entityId;
        }
      });
    }
  }
  previousOptions.value = JSON.parse(JSON.stringify(options.value));
}

onMounted(() => {
  setOptions();
});

function updateCommand(userEntityId, commandEntityId, value) {
  const params = {};
  params["entity.command"] = value;
  return commandApi.updateCommand(userEntityId, commandEntityId, params);
}

function updateCommands() {
  const userEntityId = authStore.entityId;
  const promises = []; // 모든 업데이트 요청을 저장할 배열

  // 변경된 항목을 찾아 업데이트
  options.value.forEach((currentOption, index) => {
    const previousOption = previousOptions.value[index];

    // 상담유형이 변경되었을 때 업데이트
    if (currentOption.counselTypePath !== previousOption.counselTypePath && currentOption.counselTypeCommandEid) {
      promises.push(updateCommand(userEntityId, currentOption.counselTypeCommandEid, currentOption.counselTypePath));
    }

    // 상담내용이 변경되었을 때 업데이트
    if (currentOption.contents !== previousOption.contents && currentOption.textCommandEid) {
      promises.push(updateCommand(userEntityId, currentOption.textCommandEid, currentOption.contents));
    }
  });

  // 모든 API 요청이 완료된 후 한 번만 후속 작업 실행
  Promise.allSettled(promises).then((results) => {
    const hasErrors = results.some((result) => result.status === "rejected");

    // 실패한 요청들에 대해 handleApiError 호출
    results.forEach((result) => {
      if (result.status === "rejected") {
        handleApiError(result.reason); // `result.reason`은 에러 객체
      }
    });

    if (hasErrors) {
      showAlert("일부 업데이트 요청이 실패했습니다.");
    } else {
      showAlert("저장이 완료되었습니다.");
    }

    // 성공, 실패 여부와 관계없이 후속 작업을 한 번만 수행
    commandStore
      .loadCommand()
      .then(() => {
        setOptions();
      })
      .catch((error) => {
        handleApiError(error);
      });
  });
}
</script>

<template>
  <div class="column no-wrap">
    <a-title-bar title="상담유형 템플릿" class="full-width col-auto" />
    <div class="column col full-width b-border q-pa-xs">
      <div class="col-auto row full-width fixed-height">
        <div class="top-border-left col-2 t-column flex-center row"><span>단축키</span></div>
        <div class="top-border-left col-4 t-column flex-center row"><span>상담유형</span></div>
        <div class="top-border-right col-6 t-column flex-center row"><span>상담내용</span></div>
      </div>
      <UserShorCutOptions
        v-for="(option, index) in options"
        :key="index"
        class="col"
        :number="index + 1"
        v-model="options[index]"
      />
      <div class="col-auto text-right q-pt-xs">
        <a-btn label="저장" @click="updateCommands" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.b-border {
  border-right: 1px solid $grey-5;
  border-left: 1px solid $grey-5;
  border-bottom: 1px solid $grey-5;
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
.fixed-height {
  height: $line-height + 2;
}
.t-column {
  background-color: $grey-2;
}
</style>
