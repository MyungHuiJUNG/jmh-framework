<script setup>
import { useMainTabStore } from "src/stores/mainTab";
import { Menu } from "src/js/menu";
import ADynTabs from "components/common/ADynTabs.vue";
import CallConsult from "pages/tabs/CallConsult.vue";
import TicketManage from "pages/tabs/TicketManage.vue";
import CounselTypeManage from "src/pages/tabs/CounselTypeManage.vue";
import UserManage from "src/pages/tabs/UserManage.vue";
import PermissionManage from "src/pages/tabs/PermissionManage.vue";
import CodeManage from "src/pages/tabs/CodeManage.vue";
import NoticeMain from "pages/tabs/NoticeMain.vue";
import ORGManage from "pages/tabs/OrgManage.vue";
import ProfileManage from "pages/tabs/ProfileManage.vue";
import BlankTab from "./tabs/tabtest/BlankTab.vue"; // 미구현 페이지 임시로 빈 컴포넌트 할당
import BoardMain from "src/pages/tabs/BoardMain.vue";
import MenuManage from "./tabs/MenuManage.vue";
import SystemVariableManage from "./tabs/SystemVariableManage.vue";
import CompanyManage from "./tabs/CustomerInfoManage.vue";
import StatisticsByUsers from "./tabs/StatisticsByUsers.vue";
import StatisticsByCounselTypes from "./tabs/StatisticsByCounselTypes.vue";
import CallbackManage from "./tabs/CallbackManage.vue";
import NotificationManage from "./tabs/NotificationManage.vue";
import AccessLogManage from "./tabs/AccessLogManage.vue";
import MessageManage from "./tabs/MessageManage.vue";
import ScriptManage from "./tabs/ScriptManage.vue";
import SiteLinkManage from "./tabs/SiteLinkManage.vue";

const mainTabStore = useMainTabStore();

const components = {
  [Menu.CALL_CONSULT.name]: CallConsult,
  [Menu.CHAT_CONSULT.name]: BlankTab,
  [Menu.TICKET_MANAGE.name]: TicketManage,
  [Menu.CONSULT_TYPE_MANAGE.name]: CounselTypeManage,
  [Menu.BOARD.name]: BoardMain,
  [Menu.USER_MANAGE.name]: UserManage,
  [Menu.PERMISSION_MANAGE.name]: PermissionManage,
  [Menu.CODE_MANAGE.name]: CodeManage,
  [Menu.NOTICE.name]: NoticeMain,
  [Menu.ORG_MANAGE.name]: ORGManage,
  [Menu.PROFILE_MANAGE.name]: ProfileManage,
  [Menu.MENU_MANAGE.name]: MenuManage,
  [Menu.STATISTICS_BY_COUNSEL_TYPES.name]: StatisticsByCounselTypes,
  [Menu.STATISTICS_BY_USERS.name]: StatisticsByUsers,
  [Menu.SYSTEM_VARIABLE_MANAGE.name]: SystemVariableManage,
  [Menu.COMPANY_MANAGE.name]: CompanyManage,
  [Menu.CALLBACK_MANAGE.name]: CallbackManage,
  [Menu.NOTIFICATION_MANAGE.name]: NotificationManage,
  [Menu.ACCESS_LOG_MANAGEMENT.name]: AccessLogManage,
  [Menu.MESSAGE_MANAGE.name]: MessageManage,
  [Menu.SCRIPT_MANAGE.name]: ScriptManage,
  [Menu.SITE_LINK_MANAGE.name]: SiteLinkManage,
};
</script>

<template>
  <q-page class="column no-wrap">
    <!--
      <q-page> 내부의 첫 노드가 갖는 top margin값을 <q-page-container>가 자신의 높이계산할 때 같이 계산하여
      scrollbar가 없어도 되는데 표시되도록 하는 현상이 있음.
      반드시 첫 노드는 top margin 사용하지 말것. padding으로 대체 가능.
    -->
    <a-dyn-tabs
      class="q-pt-sm col-auto"
      v-model="mainTabStore.activeTab"
      v-model:tabs="mainTabStore.tabs"
      @close="mainTabStore.closeTab"
      @closeAll="mainTabStore.closeAll"
    />

    <q-tab-panels class="col" v-model="mainTabStore.activeTab" keep-alive :keep-alive-include="mainTabStore.cachedTabs">
      <q-tab-panel v-for="tab in mainTabStore.tabs" :key="tab.name" :name="tab.name" class="q-pa-xs">
        <component :is="components[tab.name]" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
