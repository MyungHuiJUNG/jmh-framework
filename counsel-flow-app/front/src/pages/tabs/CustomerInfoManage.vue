<script setup>
import { ref, nextTick } from "vue";
import ATitle from "components/common/ATitleBar.vue";
import CustomerInfoManageTable from "src/components/customerInfo/CustomerInfoManageTable.vue";
import CustomerInfoManageSearch from "src/components/customerInfo/CustomerInfoManageSearch.vue";
import CustomerInfoDetail from "src/components/customerInfo/CustomerInfoDetail.vue";

const grid = ref(null);
const detailRef = ref(null);

const customerInfoEntityId = ref(null);
const selectedRow = ref();

function handleRowSelected(row) {
  selectedRow.value = row[0];
  customerInfoEntityId.value = row[0].entityId;

  nextTick(() => {
    if (detailRef.value) {
      detailRef.value.getCustomerInfo();
    }
  });
}

function handleDeselected() {
  selectedRow.value = null;
}

function loadInitialData() {
  grid.value.loadInitialData();
  grid.value.setData();
}

function resetCustomerInfoEntityId() {
  customerInfoEntityId.value = null;
}

function search(param) {
  grid.value.searchCustomerInfos(param);
}
</script>

<template>
  <div class="column no-wrap fit a-border q-pa-xs" style="min-height: 730px">
    <div class="col-auto q-mb-xs">
      <CustomerInfoManageSearch @search="search" />
    </div>
    <div class="row col no-wrap a-border q-pa-xs">
      <div class="col column no-wrap">
        <a-title title="업체 목록" class="col-auto full-width q-mb-xs" />
        <CustomerInfoManageTable
          @row-selected="handleRowSelected"
          @row-deselected="handleDeselected"
          ref="grid"
          class="col"
        />
      </div>
      <CustomerInfoDetail
        :customerInfoEntityId="customerInfoEntityId"
        @saveCustomerInfo="loadInitialData"
        @resetCustomerInfoEntityId="resetCustomerInfoEntityId"
        ref="detailRef"
        class="col-auto"
      />
    </div>
  </div>
</template>
