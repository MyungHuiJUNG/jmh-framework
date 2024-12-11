import { defineStore } from "pinia";
import counselTypeApi from "src/js/api/counselTypeApi";
import { handleApiError } from "src/js/common/errorHandler";

export const useCounselTypeStore = defineStore("counselTypeStore", {
  state: () => ({
    counselTypes: new Map(), // key를 code값으로 하는 전체 map(하위 뎁스까지 포함)
    counselTypeArray: [], // 1depth짜리 배열(최상단 데이터만 가지고있는 tree구조)
    recid: 1,
    initialLoaded: false,
  }),

  getters: {
    getCounselType: (state) => (parentTypeOrTypes, codeValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.code === codeValue) || null;
    },

    getCounselTypeName: (state) => (parentTypeOrTypes, codeValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      const counselType = children.find((child) => child.code === codeValue);
      return counselType ? counselType.name : null;
    },

    getCounselTypeByEntityId: (state) => (parentTypeOrTypes, entityId) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.entityId === entityId) || null;
    },

    getChildrenCounselTypesByTopParentCodeValue: (state) => (parentCodeValue) => {
      const parentType = state.counselTypes.get(parentCodeValue);
      return parentType?.children || [];
    },

    getChildrenCounselTypeNamesByTopParentCodeValue: (state) => (parentCodeValue) => {
      const parentType = state.counselTypes.get(parentCodeValue);
      return parentType?.children?.map((child) => child.name) || [];
    },

    findCounselTypesInTopParentCodeValue: (state) => (parentCodeValue, codeValue, beOneResult) => {
      function findCounselTypeRecursive(results, parentType, codeValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.code === codeValue) results.push(child);
          findCounselTypeRecursive(results, child, codeValue);
        });
      }

      const results = [];
      const parentType = state.counselTypes.get(parentCodeValue);
      if (parentType) findCounselTypeRecursive(results, parentType, codeValue);
      return beOneResult ? results[0] || null : results;
    },

    findCounselTypeNamesInTopParentCodeValue: (state) => (parentCodeValue, codeValue, beOneResult) => {
      function findCounselTypeNameRecursive(results, parentType, codeValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.code === codeValue) results.push(child.name);
          findCounselTypeNameRecursive(results, child, codeValue);
        });
      }

      const results = [];
      const parentType = state.counselTypes.get(parentCodeValue);
      if (parentType) findCounselTypeNameRecursive(results, parentType, codeValue);
      return beOneResult ? results[0] || null : results;
    },

    findParentCounselTypeByChildren: (state) => (counselType) => {
      if (!counselType?.parentEntityId) return state.counselTypeArray;

      let parentTypeChildren = null;
      function find(records) {
        records.forEach((record) => {
          if (counselType.parentEntityId === record.entityId) {
            parentTypeChildren = record.children || [];
          } else if (record.children?.length) {
            find(record.children);
          }
        });
      }

      find(state.counselTypeArray);
      return parentTypeChildren || state.counselTypeArray;
    },

    findParentCode: (state) => (counselType) => {
      if (!counselType?.parentEntityId) return null;

      let parentType = null;
      function find(records) {
        records.forEach((record) => {
          if (counselType.parentEntityId === record.entityId) {
            parentType = record;
          } else if (record.children && record.children.length > 0) {
            find(record.children);
          }
        });
      }

      find(state.counselTypeArray);
      return parentType;
    },

    findIndexInParentCounselTypeChildren: (state) => (parentTypeChildren, code) => {
      return parentTypeChildren.findIndex((child) => child.entityId === code.entityId);
    },
  },

  actions: {
    setCounselTypes(counselTypes) {
      this.counselTypes = new Map();
      counselTypes.forEach((counselType) => {
        if (counselType.children?.length) {
          counselType.children.sort((a, b) => {
            if (a.orderNumber !== b.orderNumber) return a.orderNumber - b.orderNumber;
            return a.name.localeCompare(b.name);
          });
        }
        this.counselTypes.set(counselType.code, counselType);
      });
    },

    setCounselTypeArray(counselTypes) {
      this.recid = 1;

      const setParentCounselTypeAndSort = (records, parent) => {
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
          if (record.children?.length) setParentCounselTypeAndSort(record.children, record);
        });
      };

      this.counselTypeArray = counselTypes;
      setParentCounselTypeAndSort(this.counselTypeArray);
    },

    load() {
      counselTypeApi
        .getCounselType(null, false) // (isTopCode = false) : children항목들도 모두 리스트로 받는다
        .then((response) => {
          if (response.status === 200) this.setCounselTypes(response.data);
        })
        .catch((error) => {
          handleApiError(error);
        });

      counselTypeApi
        .getCounselType(null)
        .then((response) => {
          if (response.status === 200) this.setCounselTypeArray(response.data);
        })
        .catch((error) => {
          handleApiError(error);
        });
    },

    fetchInitialData() {
      if (!this.initialLoaded) {
        this.initialLoaded = true;
        return Promise.all([counselTypeApi.getCounselType(null, false), counselTypeApi.getCounselType(null)])
          .then(([response1, response2]) => {
            this.setCounselTypes(response1.data);
            this.setCounselTypeArray(response2.data);
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
      this.setCounselTypes([]);
      this.setCounselTypeArray([]);
    },

    async save(entities) {
      try {
        const response = await counselTypeApi.saveMultipleCounselType(entities);
        if (response.status === 200) {
          this.load();
        }
        return response; // 성공 시 response 반환
      } catch (error) {
        throw error; // 에러 발생 시 에러를 호출된 곳으로 던짐
      }
    },

    async update(entities) {
      try {
        const response = await counselTypeApi.updateMultipleCounselType(entities);
        if (response.status === 200) {
          this.load();
        }
        return response; // 성공 시 response 반환
      } catch (error) {
        throw error; // 에러 발생 시 에러를 호출된 곳으로 던짐
      }
    },

    async remove(entityId) {
      try {
        const response = await counselTypeApi.deleteCounselType(entityId);
        if (response.status === 200) {
          this.load();
        }
        return response; // 성공 시 response 반환
      } catch (error) {
        throw error; // 에러 발생 시 에러를 호출된 곳으로 던짐
      }
    },

    search(payload = {}) {
      return new Promise((resolve) => {
        // 검색 조건이 없으면  배열 반환
        if (!payload.name && !payload.code) {
          // resolve([...this.counselTypeArray]);
          resolve([]);
          return;
        }

        // 재귀적으로 상담 유형을 검색하는 함수
        const find = (counselTypes) => {
          return counselTypes.reduce((results, counselType) => {
            const newType = { ...counselType };
            const matchesCode = !payload.code || newType.code.includes(payload.code);
            const matchesName = !payload.name || newType.name.includes(payload.name);

            // 코드와 이름 모두 조건을 만족하는 경우 결과에 추가
            if (matchesCode && matchesName) results.push(newType);

            // 자식 항목이 있는 경우 재귀 호출
            if (newType.children?.length) results.push(...find(newType.children));

            return results;
          }, []);
        };

        // 검색 결과를 Promise로 반환
        resolve(find(this.counselTypeArray));
      });
    },
  },
});
