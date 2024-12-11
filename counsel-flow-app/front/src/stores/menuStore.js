import { defineStore } from "pinia";
import permissionApi from "src/js/api/permissionApi";
import menuApi from "src/js/api/menuApi";
import { handleApiError } from "src/js/common/errorHandler";

export const useMenuStore = defineStore("menuStore", {
  state: () => ({
    dynamicMenuList: [],
    quickMenuItems: [],
    initialLoaded: false,
  }),

  getters: {},

  actions: {
    async buildMenuTree(menuItems) {
      const menuMap = {};
      const menuTree = [];

      const usableMenuItems = menuItems.filter((item) => item.usable);

      usableMenuItems.forEach((item) => {
        menuMap[item.entityId] = {
          name: item.code,
          label: item.name,
          icon: null,
          orderNumber: item.orderNumber,
        };
      });

      usableMenuItems.forEach((item) => {
        if (item.parentEntityId === null) {
          menuTree.push(menuMap[item.entityId]);
        } else {
          if (!menuMap[item.parentEntityId].children) {
            menuMap[item.parentEntityId].children = [];
          }
          menuMap[item.parentEntityId].children.push(menuMap[item.entityId]);
        }
      });

      function sortByOrderNumber(a, b) {
        return a.orderNumber - b.orderNumber;
      }

      function sortMenuTree(tree) {
        tree.sort(sortByOrderNumber);
        tree.forEach((menuItem) => {
          if (menuItem.children) {
            sortMenuTree(menuItem.children);
          }
        });
      }

      sortMenuTree(menuTree);

      this.loadIcons(usableMenuItems, menuMap);

      return menuTree;
    },

    loadIcons(menuItems, menuMap) {
      menuItems.forEach((item) => {
        if (item.iconImageFile) {
          menuApi
            .getImageWithToken(item.iconImageFile.downloadUrl)
            .then((iconUrl) => {
              menuMap[item.entityId].icon = iconUrl;
            })
            .catch((error) => {
              menuMap[item.entityId].icon = null;
            });
        } else {
          menuMap[item.entityId].icon = null;
        }
      });
    },

    async getMenus(roleGroupId) {
      const mainMenu = {
        name: "CALL_CONSULT",
        label: "전화상담",
        icon: "call",
        orderNumber: 1,
      };

      if (!roleGroupId) {
        this.dynamicMenuList = [mainMenu];
        return;
      }

      try {
        const response = await permissionApi.getMenusByPermission(roleGroupId);
        if (response.status === 200) {
          const builtMenuTree = await this.buildMenuTree(response.data);
          this.dynamicMenuList = [mainMenu, ...builtMenuTree];
        }
      } catch (error) {
        handleApiError(error);
      }
    },

    async fetchInitialData(roleGroupId) {
      const mainMenu = {
        name: "CALL_CONSULT",
        label: "전화상담",
        icon: "call",
        orderNumber: 1,
      };

      if (!roleGroupId) {
        this.dynamicMenuList = [mainMenu];
        this.quickMenuItems = [];
        return;
      }
      if (!this.initialLoaded) {
        this.initialLoaded = true;
        try {
          const response = await permissionApi.getMenusByPermission(roleGroupId);
          if (response.status === 200) {
            const builtMenuTree = await this.buildMenuTree(response.data);
            this.dynamicMenuList = [mainMenu, ...builtMenuTree];

            const allMenuItems = this.flattenMenuItems(response.data);
            const quickItems = allMenuItems
              .filter((item) => item.quickUsable === true)
              .sort((a, b) => a.quickOrderNumber - b.quickOrderNumber);

            await this.loadquickMenuIcons(quickItems);
            this.quickMenuItems = quickItems;
          }
        } catch (error) {
          this.initialLoaded = false;
          throw error;
        }
      } else {
        return Promise.resolve();
      }
    },

    clearInitialData() {
      this.initialLoaded = false;
      this.dynamicMenuList = [];
      this.quickMenuItems = [];
    },

    flattenMenuItems(menuItems) {
      let flatItems = [];
      menuItems.forEach((item) => {
        flatItems.push(item);
        if (item.children && item.children.length > 0) {
          flatItems = flatItems.concat(flattenMenuItems(item.children));
        }
      });
      return flatItems;
    },

    loadquickMenuIcons(menuItems) {
      const iconPromises = menuItems.map((item) => {
        if (item.quickIconImageFile && item.quickIconImageFile.downloadUrl) {
          return menuApi
            .getImageWithToken(item.quickIconImageFile.downloadUrl)
            .then((iconUrl) => {
              item.iconUrl = iconUrl;
            })
            .catch((error) => {
              throw error;
            });
        } else {
          item.iconUrl = null;
          return Promise.resolve();
        }
      });

      return Promise.all(iconPromises);
    },
  },
});
