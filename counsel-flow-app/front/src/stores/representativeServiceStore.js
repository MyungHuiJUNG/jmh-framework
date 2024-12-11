import { defineStore } from "pinia";
import callbackApi from "src/js/api/callbackApi";

export const useServiceStore = defineStore("serviceStore", {
  state: () => ({
    services: [],
    initialLoaded: false,
  }),
  actions: {
    async load() {
      try {
        const response = await callbackApi.getTargetGroups();
        if (response.status === 200) {
          this.services = response.data;
        }
        return response; // 성공한 경우 Promise 반환
      } catch (error) {
        throw error; // 에러를 상위로 전달
      }
    },

    fetchInitialData() {
      if (!this.initialLoaded) {
        this.initialLoaded = true;
        return callbackApi
          .getTargetGroups()
          .then((response) => {
            this.services = response.data;
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
      this.services = [];
    },
  },
  getters: {},
});
