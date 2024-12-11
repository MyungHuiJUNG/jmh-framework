<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import ABtn from "components/common/ABtn.vue";
import ATitle from "components/common/ATitleBar.vue";
import TicketManageSearch from "components/ticket/TicketManageSearch.vue";
import TicketDetail from "components/ticket/TicketDetail.vue";
import TicketManageTable from "components/ticket/TicketManageTable.vue";
import NewTicketPopup from "components/ticket/NewTicketPopup.vue";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { showAlert } from "src/js/common/dialog";
import FlowRoleCode from "src/js/common/FlowRoleCode";

const $q = useQuasar();
const permissionRoleStore = usePermissionRoleStore();

const ticketDetail = ref(null);
const showTicketDetail = ref(false);
const grid = ref(null);
const selectedRow = ref();

const canRemoveTicket = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.TICKET_ROLE.DELETE));
const canAddTicket = computed(() => permissionRoleStore.hasPermission(FlowRoleCode.TICKET_ROLE.ADD));

const hasDatas = ref(false);

function handleRowSelected(row) {
  selectedRow.value = row[0];
  ticketDetail.value = row[0];
  showTicketDetail.value = true;
}

function handleDeselected() {
  selectedRow.value = null;
  showTicketDetail.value = false;
}

function openNewTicketPopup() {
  $q.dialog({
    component: NewTicketPopup,
  }).onOk(() => {
    grid.value.loadInitialData();
    grid.value.setData();
  });
}

function deleteTicket() {
  if (selectedRow.value?.entityId) {
    grid.value.deleteTicket(selectedRow.value.entityId);
  } else {
    showAlert("삭제할 티켓을 선택해주세요.");
  }
}

function loadInitialData() {
  grid.value.loadInitialData();
  grid.value.setData();
}

function search(param) {
  grid.value.searchTickets(param);
}

function setHasDatas(result) {
  hasDatas.value = result;
}
</script>

<template>
  <div class="column no-wrap fit a-border q-pa-xs" style="min-height: 865px">
    <div class="col-auto q-mb-xs">
      <TicketManageSearch @search="search" :has-datas="hasDatas" />
    </div>
    <div class="row col no-wrap a-border q-pa-xs">
      <div class="col column no-wrap">
        <a-title title="티켓 목록" class="col-auto full-width q-mb-xs" />
        <TicketManageTable
          @row-selected="handleRowSelected"
          @row-deselected="handleDeselected"
          @row-deleted="showTicketDetail = false"
          ref="grid"
          class="col"
          @hasDatas="setHasDatas"
        />
        <div class="text-right bg-grey-5 a-border q-pa-xs col-auto">
          <a-btn v-if="canRemoveTicket" label="삭제" @click="deleteTicket" />
          <a-btn v-if="canAddTicket" label="등록" class="q-ml-xs" @click="openNewTicketPopup" />
        </div>
      </div>
      <TicketDetail
        v-if="showTicketDetail"
        :ticket-detail="ticketDetail"
        @close="showTicketDetail = false"
        @update="loadInitialData"
        class="col-auto"
      />
    </div>
  </div>
</template>
