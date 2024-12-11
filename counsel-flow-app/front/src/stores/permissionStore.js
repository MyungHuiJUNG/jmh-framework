import { defineStore } from "pinia";
import permissionApi from "src/js/api/permissionApi";
import { handleApiError } from "src/js/common/errorHandler";

export const usePermissionStore = defineStore("permissionStore", {
  state: () => ({
    entityId: null,
    menuIds: [],
    roleIds: [],
  }),
  actions: {
    setEntityId(id) {
      this.entityId = id;
    },
    setMenuIds(ids) {
      this.menuIds = ids;
    },
    setRoleIds(ids) {
      this.roleIds = ids;
    },
    clearIds() {
      this.menuIds = [];
      this.roleIds = [];
      this.entityId = null;
    },
  },
});

export const usePermissionRoleStore = defineStore("permissionRoleStore", {
  state: () => ({
    permissions: [],
    initialLoaded: false,
  }),
  actions: {
    async loadPermissions(permissionId) {
      if (!permissionId) {
        this.permissions = [];
        return;
      }

      try {
        const response = await permissionApi.getRolesByPermission(permissionId);
        if (response.status === 200) {
          this.permissions = response.data;
        }
      } catch (error) {
        handleApiError(error);
      }
    },

    fetchInitialData(permissionId) {
      if (!permissionId) {
        this.permissions = [];
        return;
      }
      if (!this.initialLoaded) {
        this.initialLoaded = true;
        return permissionApi
          .getRolesByPermission(permissionId)
          .then((response) => {
            this.permissions = response.data;
          })
          .catch((error) => {
            this.initialLoaded = false;
            throw error;
          });
      } else {
        return Promise.resolve();
      }
    },

    clearInitialData() {
      this.initialLoaded = false;
      this.permissions = [];
    },

    hasPermission(code) {
      return this.permissions.some((permission) => permission.code === code);
    },
  },
  getters: {},
});
