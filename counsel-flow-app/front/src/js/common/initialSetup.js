import { useAuthStore } from "src/stores/authStore";
import { useCounselTypeStore } from "src/stores/counselTypeStore";
import { useOrganizationStore } from "src/stores/organizationStore";
import { useCodeStore } from "src/stores/codeStore";
import { useSystemVariableStore } from "src/stores/systemVariableStore";
import { useServiceStore } from "src/stores/representativeServiceStore";
import { usePermissionRoleStore } from "src/stores/permissionStore";
import { useCommandStore } from "src/stores/commandStore";
import { useMenuStore } from "src/stores/menuStore";
import { computed } from "vue";

const authStore = useAuthStore();
const counselTypeStore = useCounselTypeStore();
const organizationStore = useOrganizationStore();
const codeStore = useCodeStore();
const systemVariableStore = useSystemVariableStore();
const serviceStore = useServiceStore();
const permissionRoleStore = usePermissionRoleStore();
const commandStore = useCommandStore();
const menuStore = useMenuStore();

const roleGroupId = computed(() => authStore.roleGroup?.entityId);

// authStore.login()이 완료된 뒤에 실행되어야함
// authStore.login().then(() => { setInitialDatas(); })
function setInitialDatas() {
  return Promise.all([
    codeStore.fetchInitialData(),
    counselTypeStore.fetchInitialData(),
    organizationStore.fetchInitialData(),
    systemVariableStore.fetchInitialData(),
    serviceStore.fetchInitialData(),
    permissionRoleStore.fetchInitialData(roleGroupId.value),
    commandStore.fetchInitialData(),
    menuStore.fetchInitialData(roleGroupId.value),
  ])
    .then(() => {
      console.log("All data loaded successfully.");
    })
    .catch((error) => {
      console.error("Error loading data:", error);
      throw error;
    });
}

function clearInitialDatas() {
  codeStore.clearInitialData();
  counselTypeStore.clearInitialData();
  organizationStore.clearInitialData();
  systemVariableStore.clearInitialData();
  serviceStore.clearInitialData();
  permissionRoleStore.clearInitialData();
  commandStore.clearInitialData();
  menuStore.clearInitialData();
}

export { setInitialDatas, clearInitialDatas };
