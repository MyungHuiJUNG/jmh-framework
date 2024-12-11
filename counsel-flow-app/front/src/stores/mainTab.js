import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { Menu } from "src/js/menu";

export const useMainTabStore = defineStore("mainTab", () => {
  const tabs = ref([
    {
      name: Menu.CALL_CONSULT.name,
      label: Menu.CALL_CONSULT.label,
    },
  ]);

  const activeTab = ref(Menu.CALL_CONSULT.name);

  // getters
  const cachedTabs = computed(() => tabs.value.map((tab) => tab.name));

  // actions
  function addTab(menu) {
    const inx = tabs.value.findIndex((tab) => tab.name == menu.name);
    if (inx < 0) {
      tabs.value.push({
        name: menu.name,
        label: menu.label,
        lockable: true,
        closable: true,
      });
    }
    activeTab.value = menu.name;
  }

  function closeTab(tabName) {
    const inx = tabs.value.findIndex((tab) => tab.name == tabName);
    if (inx >= 0) {
      // set activeTab
      if (tabName == activeTab.value) {
        if (tabs.value.length === 1) {
          activeTab.value = null;
        } else {
          if (inx === tabs.value.length - 1) {
            activeTab.value = tabs.value[inx - 1].name;
          } else {
            activeTab.value = tabs.value[inx + 1].name;
          }
        }
      }

      // close tab
      tabs.value.splice(inx, 1);
    }
  }

  function closeAll() {
    // set activeTab
    const activeInx = tabs.value.findIndex((tab) => tab.name == activeTab.value);
    if (!tabs.value[activeInx].locked && tabs.value[activeInx].closable) {
      let nextActiveTab = null;
      for (let inx = activeInx - 1; inx >= 0; inx--) {
        if (tabs.value[inx].locked || !tabs.value[inx].closable) {
          nextActiveTab = tabs.value[inx].name;
          break;
        }
      }

      if (nextActiveTab == null) {
        for (let inx = activeInx + 1; inx < tabs.value.length; inx++) {
          if (tabs.value[inx].locked || !tabs.value[inx].closable) {
            nextActiveTab = tabs.value[inx].name;
            break;
          }
        }
      }
      activeTab.value = nextActiveTab;
    }

    // close tabs
    for (let inx = tabs.value.length - 1; inx >= 0; inx--) {
      if (!tabs.value[inx].locked && tabs.value[inx].closable) {
        tabs.value.splice(inx, 1);
      }
    }
  }

  return {
    tabs,
    activeTab,
    cachedTabs,
    addTab,
    closeTab,
    closeAll,
  };
});
