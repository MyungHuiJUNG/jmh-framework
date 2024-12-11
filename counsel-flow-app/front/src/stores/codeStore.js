import { defineStore } from "pinia";
import codeApi from "src/js/api/codeApi";
import { handleApiError } from "src/js/common/errorHandler";

export const useCodeStore = defineStore("codeStore", {
  state: () => ({
    codes: new Map(), // key를 code값으로 하는 전체 map(하위 뎁스까지 포함)
    codeArray: [], // 1depth짜리 배열(최상단 데이터만 가지고있는 tree구조)
    recid: 1,
    initialLoaded: false,
  }),

  getters: {
    getCode: (state) => (parentTypeOrTypes, codeValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.code === codeValue) || null;
    },

    getCodeName: (state) => (parentTypeOrTypes, codeValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      const code = children.find((child) => child.code === codeValue);
      return code ? code.name : null;
    },

    getCodeByEntityId: (state) => (parentTypeOrTypes, entityId) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.entityId === entityId) || null;
    },

    getChildrenCodesByTopParentCodeValue: (state) => (parentCodeValue) => {
      const parentType = state.codes.get(parentCodeValue);
      return parentType?.children || [];
    },

    getChildrenCodeNamesByTopParentCodeValue: (state) => (parentCodeValue) => {
      const parentType = state.codes.get(parentCodeValue);
      return parentType?.children?.map((child) => child.name) || [];
    },

    findCodesInTopParentCodeValue: (state) => (parentCodeValue, codeValue, beOneResult) => {
      function findCodeRecursive(results, parentType, codeValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.code === codeValue) results.push(child);
          findCodeRecursive(results, child, codeValue);
        });
      }

      const results = [];
      const parentType = state.codes.get(parentCodeValue);
      if (parentType) findCodeRecursive(results, parentType, codeValue);
      return beOneResult ? results[0] || null : results;
    },

    findCodeNamesInTopParentCodeValue: (state) => (parentCodeValue, codeValue, beOneResult) => {
      function findCodeNameRecursive(results, parentType, codeValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.code === codeValue) results.push(child.name);
          findCodeNameRecursive(results, child, codeValue);
        });
      }

      const results = [];
      const parentType = state.codes.get(parentCodeValue);
      if (parentType) findCodeNameRecursive(results, parentType, codeValue);
      return beOneResult ? results[0] || null : results;
    },

    findParentCodeByChildren: (state) => (code) => {
      if (!code?.parentEntityId) return state.codeArray;

      let parentTypeChildren = null;
      function find(records) {
        records.forEach((record) => {
          if (code.parentEntityId === record.entityId) {
            parentTypeChildren = record.children || [];
          } else if (record.children?.length) {
            find(record.children);
          }
        });
      }

      find(state.codeArray);
      return parentTypeChildren || state.codeArray;
    },

    findParentCode: (state) => (code) => {
      if (!code?.parentEntityId) return null;

      let parentType = null;
      function find(records) {
        records.forEach((record) => {
          if (code.parentEntityId === record.entityId) {
            parentType = record;
          } else if (record.children && record.children.length > 0) {
            find(record.children);
          }
        });
      }

      find(state.codeArray);
      return parentType;
    },

    findIndexInParentCodeChildren: (state) => (parentTypeChildren, code) => {
      return parentTypeChildren.findIndex((child) => child.entityId === code.entityId);
    },
  },

  actions: {
    setCodes(codes) {
      this.codes = new Map();
      codes.forEach((code) => {
        if (code.children?.length) {
          code.children.sort((a, b) => {
            if (a.orderNumber !== b.orderNumber) return a.orderNumber - b.orderNumber;
            return a.name.localeCompare(b.name);
          });
        }
        this.codes.set(code.code, code);
      });
    },

    setCodeArray(codes) {
      this.recid = 1;

      const setParentCodeAndSort = (records, parent) => {
        records.sort((a, b) => {
          if (a.orderNumber !== b.orderNumber) return a.orderNumber - b.orderNumber;
          return a.name.localeCompare(b.name);
        });
        records.forEach((record) => {
          record.recid = this.recid++;
          if (!record.remarkText) record.remarkText = "";
          if (parent) {
            record.parentCode = parent.code;
            record.parentEntityId = parent.entityId;
            record.parentRecid = parent.recid;
            record.prevParentEntityId = parent.entityId;
          }
          if (record.children?.length) setParentCodeAndSort(record.children, record);
        });
      };

      this.codeArray = codes;
      setParentCodeAndSort(this.codeArray);
    },

    load(param) {
      codeApi
        .getCodes(param, false)
        .then((response) => {
          if (response.status === 200) this.setCodes(response.data);
        })
        .catch((error) => {
          handleApiError(error);
        });

      codeApi
        .getCodes(param)
        .then((response) => {
          if (response.status === 200) this.setCodeArray(response.data);
        })
        .catch((error) => {
          handleApiError(error);
        });
    },

    fetchInitialData(param) {
      if (!this.initialLoaded) {
        this.initialLoaded = true;
        return Promise.all([codeApi.getCodes(param, false), codeApi.getCodes(param)])
          .then(([response1, response2]) => {
            this.setCodes(response1.data);
            this.setCodeArray(response2.data);
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
      this.setCodes([]);
      this.setCodeArray([]);
    },

    async save(entities) {
      try {
        const response = await codeApi.postCode(entities);
        if (response.status === 200) {
          this.load();
        }
        return response; // 성공 시 response 반환
      } catch (error) {
        console.log(error);
        throw error; // 에러 발생 시 에러를 호출된 곳으로 던짐
      }
    },

    async update(entities) {
      try {
        const response = await codeApi.putCode(entities);
        if (response.status === 200) {
          this.load();
        }
        return response; // 성공 시 response 반환
      } catch (error) {
        console.log(error);
        throw error; // 에러 발생 시 에러를 호출된 곳으로 던짐
      }
    },

    // async remove(entityId) {
    //   try {
    //     const response = await codeApi.deleteCode(entityId);
    //     if (response.status === 200) {
    //       this.load();
    //     }
    //     return response; // 성공 시 response 반환
    //   } catch (error) {
    //     console.log(error);
    //     throw error; // 에러 발생 시 에러를 호출된 곳으로 던짐
    //   }
    // },

    // search(payload = {}) {
    //   return new Promise((resolve) => {
    //     // 검색 조건이 없으면 전체 배열 반환
    //     if (!payload.name && !payload.code) {
    //       resolve([...this.codeArray]);
    //       return;
    //     }

    //     // 재귀적으로 상담 유형을 검색하는 함수
    //     const find = (codes) => {
    //       return codes.reduce((results, code) => {
    //         const newType = { ...code };
    //         const matchesCode = !payload.code || newType.code.includes(payload.code);
    //         const matchesName = !payload.name || newType.name.includes(payload.name);

    //         // 코드와 이름 모두 조건을 만족하는 경우 결과에 추가
    //         if (matchesCode && matchesName) results.push(newType);

    //         // 자식 항목이 있는 경우 재귀 호출
    //         if (newType.children?.length) results.push(...find(newType.children));

    //         return results;
    //       }, []);
    //     };

    //     // 검색 결과를 Promise로 반환
    //     resolve(find(this.codeArray));
    //   });
    // },
  },
});
