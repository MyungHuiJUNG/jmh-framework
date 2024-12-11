import { defineStore } from "pinia";
import VoiceCommonCode from "src/boot/VoiceCommonCode";
import systemVariableApi from "src/js/api/systemVariableApi";
import { handleApiError } from "src/js/common/errorHandler";

export const useSystemVariableStore = defineStore("systemVariableStore", {
  state: () => ({
    systemVariables: new Map(), // key를 entityId값으로 하는 전체 map(하위 뎁스까지 포함)
    systemVariableArray: [], // 1depth짜리 배열(최상단 데이터만 가지고있는 tree구조)
    recid: 1,
    ctiServerInfo: VoiceCommonCode.CtiServerInfo,
    initialLoaded: false,
  }),

  getters: {
    getSystemVariable: (state) => (parentTypeOrTypes, entityIdValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.entityId === entityIdValue) || null;
    },

    getSystemVariableName: (state) => (parentTypeOrTypes, entityIdValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      const systemVariable = children.find((child) => child.entityId === entityIdValue);
      return systemVariable ? systemVariable.displayName : null;
    },

    getSystemVariableByEntityId: (state) => (parentTypeOrTypes, entityId) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.entityId === entityId) || null;
    },

    getChildrenSystemVariablesByTopParentEntityIdValue: (state) => (parentEntityIdValue) => {
      const parentType = state.systemVariables.get(parentEntityIdValue);
      return parentType?.children || [];
    },

    getChildrenSystemVariableNamesByTopParentEntityIdValue: (state) => (parentEntityIdValue) => {
      const parentType = state.systemVariables.get(parentEntityIdValue);
      return parentType?.children?.map((child) => child.displayName) || [];
    },

    findSystemVariablesInTopParentEntityIdValue: (state) => (parentEntityIdValue, entityIdValue, beOneResult) => {
      function findSystemVariableRecursive(results, parentType, entityIdValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.entityId === entityIdValue) results.push(child);
          findSystemVariableRecursive(results, child, entityIdValue);
        });
      }

      const results = [];
      const parentType = state.systemVariables.get(parentEntityIdValue);
      if (parentType) findSystemVariableRecursive(results, parentType, entityIdValue);
      return beOneResult ? results[0] || null : results;
    },

    findSystemVariableNamesInTopParentEntityIdValue: (state) => (parentEntityIdValue, entityIdValue, beOneResult) => {
      function findSystemVariableNameRecursive(results, parentType, entityIdValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.entityId === entityIdValue) results.push(child.displayName);
          findSystemVariableNameRecursive(results, child, entityIdValue);
        });
      }

      const results = [];
      const parentType = state.systemVariables.get(parentEntityIdValue);
      if (parentType) findSystemVariableNameRecursive(results, parentType, entityIdValue);
      return beOneResult ? results[0] || null : results;
    },

    findParentSystemVariableByChildren: (state) => (systemVariable) => {
      if (!systemVariable?.parentEntityId) return state.systemVariableArray;

      let parentTypeChildren = null;
      function find(records) {
        records.forEach((record) => {
          if (systemVariable.parentEntityId === record.entityId) {
            parentTypeChildren = record.children || [];
          } else if (record.children?.length) {
            find(record.children);
          }
        });
      }

      find(state.systemVariableArray);
      return parentTypeChildren || state.systemVariableArray;
    },

    findParentEntityId: (state) => (systemVariable) => {
      if (!systemVariable?.parentEntityId) return null;

      let parentType = null;
      function find(records) {
        records.forEach((record) => {
          if (systemVariable.parentEntityId === record.entityId) {
            parentType = record;
          } else if (record.children && record.children.length > 0) {
            find(record.children);
          }
        });
      }

      find(state.systemVariableArray);
      return parentType;
    },

    findIndexInParentSystemVariableChildren: (state) => (parentTypeChildren, entityId) => {
      return parentTypeChildren.findIndex((child) => child.entityId === entityId.entityId);
    },
  },

  actions: {
    setSystemVariables(systemVariables) {
      this.systemVariables = new Map();
      systemVariables.forEach((systemVariable) => {
        if (systemVariable.children?.length) {
          systemVariable.children.sort((a, b) => {
            return a.displayName.localeCompare(b.displayName);
          });
        }
        this.systemVariables.set(systemVariable.entityId, systemVariable);
      });
      this.ctiServerInfo = {
        APPNAME: this.systemVariables.get("cti-server-app-name")?.value || VoiceCommonCode.CtiServerInfo.APPNAME,
        PROTOCOL: this.systemVariables.get("cti-server-protocol")?.value || VoiceCommonCode.CtiServerInfo.PROTOCOL,
        ACTIVESERVER:
          this.systemVariables.get("cti-server-active-host")?.value || VoiceCommonCode.CtiServerInfo.ACTIVESERVER,
        ACTIVEPORT:
          this.systemVariables.get("cti-server-active-port")?.value || VoiceCommonCode.CtiServerInfo.ACTIVEPORT,
        STANDBYSERVER:
          this.systemVariables.get("cti-server-standby-host")?.value || VoiceCommonCode.CtiServerInfo.STANDBYSERVER,
        STANDBYPORT:
          this.systemVariables.get("cti-server-standby-port")?.value || VoiceCommonCode.CtiServerInfo.STANDBYPORT,
        TENANT: this.systemVariables.get("cti-server-tenant-name")?.value || VoiceCommonCode.CtiServerInfo.TENANT,
      };
    },

    setSystemVariableArray(systemVariables) {
      this.recid = 1;

      const setParentSystemVariableAndSort = (records, parent) => {
        records.sort((a, b) => {
          return a.displayName.localeCompare(b.displayName);
        });
        records.forEach((record) => {
          record.recid = this.recid++;
          if (parent) {
            record.parentEntityId = parent.entityId;
            record.parentRecid = parent.recid;
            record.prevParentEntityId = parent.entityId;
          }
          if (record.children?.length) setParentSystemVariableAndSort(record.children, record);
        });
      };

      this.systemVariableArray = systemVariables;
      setParentSystemVariableAndSort(this.systemVariableArray);
    },

    load() {
      systemVariableApi
        .getSystemVariable(null, false) // (isTopEntityId = false) : children항목들도 모두 리스트로 받는다
        .then((response) => {
          if (response.status === 200) this.setSystemVariables(response.data);
        })
        .catch((error) => {
          handleApiError(error);
        });

      systemVariableApi
        .getSystemVariable(null)
        .then((response) => {
          if (response.status === 200) this.setSystemVariableArray(response.data);
        })
        .catch((error) => {
          handleApiError(error);
        });
    },

    fetchInitialData() {
      if (!this.initialLoaded) {
        this.initialLoaded = true;
        return Promise.all([
          systemVariableApi.getSystemVariable(null, false),
          systemVariableApi.getSystemVariable(null),
        ])
          .then(([response1, response2]) => {
            this.setSystemVariables(response1.data);
            this.setSystemVariableArray(response2.data);
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
      this.clear();
    },

    clear() {
      this.setSystemVariables([]);
      this.setSystemVariableArray([]);
    },

    async update(entities) {
      try {
        const response = await systemVariableApi.updateMultipleSystemVariable(entities);
        if (response.status === 200) {
          this.load();
        }
        return response; // 성공 시 response 반환
      } catch (error) {
        console.log(error);
        throw error; // 에러 발생 시 에러를 호출된 곳으로 던짐
      }
    },
  },
});
