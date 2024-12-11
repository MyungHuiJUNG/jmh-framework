<script setup>
import { ref } from "vue";
import TabulatorGrid from "../common/TabulatorGrid.vue";
import { useCodeStore } from "src/stores/codeStore";
import notificationApi from "src/js/api/notificationApi";
import { showAlert } from "src/js/common/dialog";
import { handleApiError } from "src/js/common/errorHandler";
import { useMainTabStore } from "src/stores/mainTab";
import { Menu } from "src/js/menu";
import FlowSystemCode from "src/js/common/FlowSystemCode";
import { useQuasar } from "quasar";
import NotificationMessagePopup from "../notification/NotificationMessagePopup.vue";

const $q = useQuasar();
const model = defineModel();
const codeStore = useCodeStore();
const mainTabStore = useMainTabStore();
const grid = ref(null);
const emit = defineEmits(["notificatioUpdate"]);
const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
});

const columns = [
  {
    title: "알림구분",
    field: "typeCode",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    width: 100,
    formatter: function (cell) {
      const code = cell.getValue() || null;
      return codeStore.codes.get(code)?.name ?? code;
    },
  },
  {
    title: "메시지",
    field: "message",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    formatter: function (row) {
      const data = row.getData();
      if (data.typeCode === FlowSystemCode.NOTIFICATION_TYPE.MESSAGE) return data.title;
      else return data.message;
    },
  },
  {
    title: "수신",
    field: "sendTime",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    width: 130,
    formatter: (cell) => {
      const sendTimeStr = cell.getValue();
      const sendTime = new Date(sendTimeStr);
      const now = new Date();
      const diffMs = now - sendTime;

      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) {
        return `${diffSec}초 전`;
      } else if (diffMin < 60) {
        return `${diffMin}분 전`;
      } else if (diffHour < 24) {
        return `${diffHour}시간 전`;
      } else {
        return `${diffDay}일 전`;
      }
    },
  },
  {
    title: `<button style="height: 24px; padding: 0px 8px; min-height: 0; margin: 0;" >전체삭제</button>`,
    field: "delete",
    headerHozAlign: "center",
    hozAlign: "center",
    headerSort: false,
    formatter: (cell) => {
      const button = document.createElement("button");
      button.innerText = "삭제";
      button.style.height = "21px";
      button.style.minHeight = "0px";
      button.style.padding = "0px 8px";
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const entityId = cell.getData().entityId;
        deleteNotification(entityId);
      });
      return button;
    },
    headerClick: () => deleteAllNotifications(),
    width: 90,
  },
];

function deleteAllNotifications() {
  const allRows = grid.value.getRows();
  const entityIds = allRows.map((row) => row.getData().entityId);

  if (entityIds.length === 0) {
    showAlert("삭제할 알림이 없습니다.");
    return;
  }
  const entities = entityIds.map((id) => ({ entityId: id }));

  notificationApi
    .updateMultipleNotifications(entities)
    .then((response) => {
      if (response.status === 200) {
        emit("notificatioUpdate");
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function deleteNotification(entityId) {
  notificationApi
    .updateNotification(entityId)
    .then((response) => {
      if (response.status === 200) {
        emit("notificatioUpdate");
      }
    })
    .catch((error) => {
      handleApiError(error);
    });
}

function rowDbclick(row) {
  const typeCode = row.typeCode;
  const data = JSON.parse(row.jsonStringContent);
  const messageEid = data.notification?.entityId;

  if (typeCode === FlowSystemCode.NOTIFICATION_TYPE.MESSAGE) {
    openMessageTab();
    notificationApi
      .updateNotification(messageEid)
      .then((response) => {
        if (response.status === 200) {
          emit("notificatioUpdate");
          $q.dialog({
            component: NotificationMessagePopup,
            componentProps: {
              componentType: "read",
              data: data.notification,
            },
          });
          model.value = false;
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  } else if (typeCode === FlowSystemCode.NOTIFICATION_TYPE.REQUEST) {
    openUserManageTab();
    notificationApi
      .updateNotification(row.entityId)
      .then((response) => {
        if (response.status === 200) {
          emit("notificatioUpdate");
          model.value = false;
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
}

function openMessageTab() {
  mainTabStore.addTab({
    name: Menu.MESSAGE_MANAGE.name,
    label: Menu.MESSAGE_MANAGE.label,
  });
}

function openUserManageTab() {
  mainTabStore.addTab({
    name: Menu.USER_MANAGE.name,
    label: Menu.USER_MANAGE.label,
  });
}

function applyHoverStyle(row) {
  const data = row.getData();

  if (
    data.typeCode === FlowSystemCode.NOTIFICATION_TYPE.MESSAGE ||
    data.typeCode === FlowSystemCode.NOTIFICATION_TYPE.REQUEST
  ) {
    row.getElement().classList.add("tabulator-hover-clickable");
  } else {
    row.getElement().classList.remove("tabulator-hover-clickable");
  }
}
</script>

<template>
  <q-menu anchor="bottom middle" self="top middle" v-model="model" no-parent-event @hide="model = false">
    <div class="a-border q-pa-xs popup-size column">
      <tabulator-grid
        ref="grid"
        :rows="props.rows"
        :columns="columns"
        class="bg-grey-4 col fit"
        placeholder="알림이 존재하지 않습니다."
        placeholder-color="#555"
        :row-formatter="applyHoverStyle"
        @rowDblClick="rowDbclick"
      />
    </div>
  </q-menu>
</template>

<style lang="scss" scoped>
.popup-size {
  height: 250px;
  width: 700px;
}
</style>
