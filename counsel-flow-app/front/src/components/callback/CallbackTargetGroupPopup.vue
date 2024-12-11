<script setup>
import { useDialogPluginComponent } from "quasar";
import ATitleBar from "../common/ATitleBar.vue";
import ABtn from "../common/ABtn.vue";
import { ref, onMounted, computed, onUnmounted } from "vue";
import ACheckbox from "../common/ACheckbox.vue";
import { useQuasar } from "quasar";
import UserPopup from "../common/UserPopup.vue";
import callbackApi from "src/js/api/callbackApi";
import { handleApiError } from "src/js/common/errorHandler";
import { showAlert } from "src/js/common/dialog";
import { useServiceStore } from "src/stores/representativeServiceStore";

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK } = useDialogPluginComponent();

const $q = useQuasar();
const serviceStore = useServiceStore();

const targetGroups = ref([]);
const selectedGroups = ref([]);
const allSelected = computed({
  get: () => selectedGroups.value.length === targetGroups.value.length,
  set: (value) => {
    selectedGroups.value = value ? targetGroups.value.map((group) => group.entityId) : [];
  },
});

onMounted(() => {
  getTargetGroups();
});

function getTargetGroups() {
  callbackApi
    .getTargetGroups()
    .then((response) => {
      if (response.status === 200) {
        targetGroups.value = response.data;
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function openUserPopup() {
  if (!selectedGroups.value.length) {
    showAlert("대표서비스를 선택해주세요.");
    return;
  }
  $q.dialog({
    component: UserPopup,
    componentProps: {
      enableRowDblClick: true,
      selectableRowsRangeMode: "click",
      selectableRows: true,
    },
  }).onOk((payload) => {
    payload.payload.forEach((user) => {
      targetGroups.value.forEach((group) => {
        if (selectedGroups.value.includes(group.entityId) && !group.users.some((u) => u.entityId === user.entityId)) {
          group.users.push(user);
          group.isUpdated = true;
        }
      });
    });
  });
}

function removeUser(group, user) {
  const index = group.users.findIndex((u) => u.entityId === user.entityId);
  if (index > -1) {
    group.users.splice(index, 1);
    group.isUpdated = true;
  }
}

function toggleSelection(entityId) {
  if (selectedGroups.value.includes(entityId)) {
    selectedGroups.value = selectedGroups.value.filter((id) => id !== entityId);
  } else {
    selectedGroups.value.push(entityId);
  }
}

function updateTargetGroup() {
  const updatedGroups = targetGroups.value.filter((group) => group.isUpdated);

  // 변경된 그룹에 대해서만 updateTargetGroup 호출
  const updatePromises = updatedGroups.map((group) => {
    const param = {
      entity: {
        users: group.users.map((user) => ({
          entityId: user.entityId,
        })),
      },
    };

    // updateTargetGroup을 호출하고 Promise 반환
    return callbackApi.updateTargetGroup(group.entityId, param);
  });

  if (updatePromises.length > 0) {
    Promise.all(updatePromises)
      .then(() => {
        showAlert("저장이 완료되었습니다.");
        serviceStore
          .load()
          .then((response) => {
            targetGroups.value = response.data;
          })
          .catch((error) => {
            handleApiError(error);
          });

        selectedGroups.value = [];
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent transition-show="fade" transition-hide="fade">
    <q-card class="dialog-large">
      <div class="column fit">
        <a-title-bar title="자동분배 설정" :close="true" class="col-auto full-width" />
        <div class="col fit q-pa-xs column" style="overflow: auto">
          <table class="fit a-table">
            <colgroup>
              <col width="30" />
              <col width="30" />
              <col width="50%" />
              <col width="50%" />
            </colgroup>
            <thead>
              <tr>
                <td>
                  <a-checkbox
                    :model-value="allSelected"
                    :indeterminate="selectedGroups.length > 0 && selectedGroups.length < targetGroups.length"
                    @update:model-value="
                      (value) => (selectedGroups = value ? targetGroups.map((group) => group.entityId) : [])
                    "
                  />
                </td>
                <td>No</td>
                <td>대표서비스</td>
                <td>담당자</td>
              </tr>
            </thead>
            <tbody>
              <tr v-if="targetGroups.length === 0">
                <td colspan="4">등록된 대표서비스가 없습니다.</td>
              </tr>
              <tr v-for="(group, index) in targetGroups" :key="index">
                <td>
                  <a-checkbox
                    :model-value="selectedGroups.includes(group.entityId)"
                    @update:model-value="(value) => toggleSelection(group.entityId)"
                  />
                </td>
                <td>{{ index + 1 }}</td>
                <td>{{ group.representNumberName }} ({{ group.representNumber }})</td>
                <td>
                  <div
                    v-for="(user, userIndex) in group.users"
                    :key="userIndex"
                    class="row justify-between"
                    :class="userIndex === 0 ? '' : 'q-mt-xs'"
                  >
                    <span>{{ user.name }} ({{ user.id }})</span>
                    <a-btn label="삭제" @click="removeUser(group, user)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="full-width text-right bg-grey-5 a-border q-pa-xs col-auto">
          <a-btn label="추가" @click="openUserPopup" v-if="targetGroups.length" />
          <a-btn label="저장" class="q-ml-xs" @click="updateTargetGroup" v-if="targetGroups.length" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.q-card__section {
  padding: 0px;
}

.dialog-large {
  min-width: 800px;
  height: 700px;
}
.a-table,
.a-table tr,
.a-table td {
  border: 1px solid $grey-5;
  border-collapse: collapse;
  background-color: $grey-2;
  text-align: center;
}

.a-table thead tr,
.a-table thead td {
  background-color: $grey-3;
}

.a-table td {
  padding: 1px map-get($space-xs, x);
  vertical-align: middle;
}

.a-table tr,
.a-table td {
  height: $line-height + 2;
}
</style>
