import { defineStore } from "pinia";
import organizationApi from "src/js/api/orgManageApi";

export const useOrganizationStore = defineStore("organizationStore", {
  state: () => ({
    organizations: new Map(), // key를 code값으로 하는 전체 map(하위 뎁스까지 포함)
    organizationArray: [], // 1depth짜리 배열(최상단 데이터만 가지고있는 tree구조)
    recid: 1,
    initialLoaded: false,
  }),

  getters: {
    getOrganization: (state) => (parentTypeOrTypes, codeValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.code === codeValue) || null;
    },

    getOrganizationName: (state) => (parentTypeOrTypes, codeValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      const organization = children.find((child) => child.code === codeValue);
      return organization ? organization.name : null;
    },

    getOrganizationByEntityId: (state) => (parentTypeOrTypes, entityId) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.entityId === entityId) || null;
    },

    getChildrenOrganizationsByTopParentCodeValue: (state) => (parentCodeValue) => {
      const parentType = state.organizations.get(parentCodeValue);
      return parentType?.children || [];
    },

    getChildrenOrganizationNamesByTopParentCodeValue: (state) => (parentCodeValue) => {
      const parentType = state.organizations.get(parentCodeValue);
      return parentType?.children?.map((child) => child.name) || [];
    },

    findOrganizationsInTopParentCodeValue: (state) => (parentCodeValue, codeValue, beOneResult) => {
      function findOrganizationRecursive(results, parentType, codeValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.code === codeValue) results.push(child);
          findOrganizationRecursive(results, child, codeValue);
        });
      }

      const results = [];
      const parentType = state.organizations.get(parentCodeValue);
      if (parentType) findOrganizationRecursive(results, parentType, codeValue);
      return beOneResult ? results[0] || null : results;
    },

    findOrganizationNamesInTopParentCodeValue: (state) => (parentCodeValue, codeValue, beOneResult) => {
      function findOrganizationNameRecursive(results, parentType, codeValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.code === codeValue) results.push(child.name);
          findOrganizationNameRecursive(results, child, codeValue);
        });
      }

      const results = [];
      const parentType = state.organizations.get(parentCodeValue);
      if (parentType) findOrganizationNameRecursive(results, parentType, codeValue);
      return beOneResult ? results[0] || null : results;
    },

    findParentOrganizationByChildren: (state) => (organization) => {
      if (!organization?.parentEntityId) return state.organizationArray;

      let parentTypeChildren = null;
      function find(records) {
        records.forEach((record) => {
          if (organization.parentEntityId === record.entityId) {
            parentTypeChildren = record.children || [];
          } else if (record.children?.length) {
            find(record.children);
          }
        });
      }

      find(state.organizationArray);
      return parentTypeChildren || state.organizationArray;
    },

    findParentCode: (state) => (organization) => {
      if (!organization?.parentEntityId) return null;

      let parentType = null;
      function find(records) {
        records.forEach((record) => {
          if (organization.parentEntityId === record.entityId) {
            parentType = record;
          } else if (record.children && record.children.length > 0) {
            find(record.children);
          }
        });
      }

      find(state.organizationArray);
      return parentType;
    },

    findIndexInParentOrganizationChildren: (state) => (parentTypeChildren, code) => {
      return parentTypeChildren.findIndex((child) => child.entityId === code.entityId);
    },
  },

  actions: {
    setOrganizations(organizations) {
      this.organizations = new Map();
      organizations.forEach((organization) => {
        if (organization.children?.length) {
          organization.children.sort((a, b) => {
            if (a.orderNumber !== b.orderNumber) return a.orderNumber - b.orderNumber;
            return a.name.localeCompare(b.name);
          });
        }
        this.organizations.set(organization.code, organization);
      });
    },

    setOrganizationArray(organizations) {
      this.recid = 1;

      const setParentOrganizationAndSort = (records, parent) => {
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
          if (record.children?.length) setParentOrganizationAndSort(record.children, record);
        });
      };

      this.organizationArray = organizations;
      setParentOrganizationAndSort(this.organizationArray);
    },

    load() {
      organizationApi
        .getOrg(null, false) // (isTopCode = false) : children항목들도 모두 리스트로 받는다
        .then((response) => {
          if (response.status === 200) this.setOrganizations(response.data);
        })
        .catch((error) => {
          handleApiError(error);
        });

      organizationApi
        .getOrg(null)
        .then((response) => {
          if (response.status === 200) this.setOrganizationArray(response.data);
        })
        .catch((error) => {
          handleApiError(error);
        });
    },

    fetchInitialData() {
      if (!this.initialLoaded) {
        this.initialLoaded = true;
        return Promise.all([organizationApi.getOrg(null, false), organizationApi.getOrg(null)])
          .then(([response1, response2]) => {
            this.setOrganizations(response1.data);
            this.setOrganizationArray(response2.data);
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
      this.setOrganizations([]);
      this.setOrganizationArray([]);
    },

    async save(entities) {
      try {
        const response = await organizationApi.saveMultipleOrg(entities);
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
        const response = await organizationApi.updateMultipleOrg(entities);
        if (response.status === 200) {
          this.load();
        }
        return response; // 성공 시 response 반환
      } catch (error) {
        console.log(error);
        throw error; // 에러 발생 시 에러를 호출된 곳으로 던짐
      }
    },

    async remove(entityId) {
      try {
        const response = await organizationApi.deleteOrg(entityId);
        if (response.status === 200) {
          this.load();
        }
        return response; // 성공 시 response 반환
      } catch (error) {
        console.log(error);
        throw error; // 에러 발생 시 에러를 호출된 곳으로 던짐
      }
    },

    search(payload = {}) {
      return new Promise((resolve) => {
        // 검색 조건이 없으면 전체 배열 반환
        if (!payload.name && !payload.code) {
          resolve([...this.organizationArray]);
          return;
        }

        // 재귀적으로 상담 유형을 검색하는 함수
        const find = (organizations) => {
          return organizations.reduce((results, organization) => {
            const newType = { ...organization };
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
        resolve(find(this.organizationArray));
      });
    },
  },
});
