<script setup>
import FooterItem from "src/components/FooterItem.vue";
const props = defineProps(["ticketBoard"]);
</script>

<template>
  <q-footer class="row no-wrap bg-grey-7 text-white" style="padding: 1px">
    <footer-item label="할당티켓 수 " :value="ticketBoard?.totalTicketCount || 0" />
    <footer-item label="티켓완료 수 " :value="ticketBoard?.completedTicketCount || 0" />
    <footer-item label="티켓처리중 수 " :value="ticketBoard?.inProcessTicketCount || 0" />
    <footer-item label="티켓미처리 수 " :value="ticketBoard?.unprocessedTicketCount || 0" />
  </q-footer>
</template>

<style lang="scss" scoped></style>
