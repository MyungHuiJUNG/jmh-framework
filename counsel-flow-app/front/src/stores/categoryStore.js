import { defineStore } from "pinia";
import categoryApi from "src/js/api/categoryApi.js";

export const useCategoryStore = defineStore("categoryStore", {
  state: () => ({
    categories: new Map(), // key를 code값으로 하는 전체 map(하위 뎁스까지 포함)
    categoryArray: [], // 1depth짜리 배열
    recid: 1,
  }),

  getters: {
    // 코드값으로 카테고리 반환
    getCategory: (state) => (parentTypeOrTypes, codeValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.code === codeValue) || null;
    },
    // 코드값으로 카테고리 이름 반환
    getCategoryName: (state) => (parentTypeOrTypes, codeValue) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      const category = children.find((child) => child.code === codeValue);
      return category ? category.name : null;
    },
    // entityId로 카테고리 반환
    getCategoryByEntityId: (state) => (parentTypeOrTypes, entityId) => {
      if (!parentTypeOrTypes) return null;
      let children = Array.isArray(parentTypeOrTypes) ? parentTypeOrTypes : parentTypeOrTypes.children;
      if (!children?.length) return null;
      return children.find((child) => child.entityId === entityId) || null;
    },
    // map에서 key값으로 찾기
    getChildrencategoriesByTopParentCodeValue: (state) => (parentCodeValue) => {
      const parentType = state.categories.get(parentCodeValue);
      return parentType?.children || [];
    },
    // 부모 카테고리의 children의 이름만 배열로 반환
    getChildrenCategoryNamesByTopParentCodeValue: (state) => (parentCodeValue) => {
      const parentType = state.categories.get(parentCodeValue);
      return parentType?.children?.map((child) => child.name) || [];
    },
    // code로 
    findcategoriesInTopParentCodeValue: (state) => (parentCodeValue, codeValue, beOneResult) => {
      function findCategoryRecursive(results, parentType, codeValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.code === codeValue) results.push(child);
          findCategoryRecursive(results, child, codeValue);
        });
      }

      const results = [];
      const parentType = state.categories.get(parentCodeValue);
      if (parentType) findCategoryRecursive(results, parentType, codeValue);
      return beOneResult ? results[0] || null : results;
    },
    // 이름으로 
    findCategoryNamesInTopParentCodeValue: (state) => (parentCodeValue, codeValue, beOneResult) => {
      function findCategoryNameRecursive(results, parentType, codeValue) {
        if (!parentType?.children) return;
        parentType.children.forEach((child) => {
          if (child.code === codeValue) results.push(child.name);
          findCategoryNameRecursive(results, child, codeValue);
        });
      }

      const results = [];
      const parentType = state.categories.get(parentCodeValue);
      if (parentType) findCategoryNameRecursive(results, parentType, codeValue);
      return beOneResult ? results[0] || null : results;
    },

    findParentCategoryByChildren: (state) => (category) => {
      if (!category?.parentEntityId) return state.categoryArray;

      let parentTypeChildren = null;
      function find(records) {
        records.forEach((record) => {
          if (category.parentEntityId === record.entityId) {
            parentTypeChildren = record.children || [];
          } else if (record.children?.length) {
            find(record.children);
          }
        });
      }

      find(state.categoryArray);
      return parentTypeChildren || state.categoryArray;
    },

    findParentCode: (state) => (category) => {
      if (!category?.parentEntityId) return null;

      let parentType = null;
      function find(records) {
        records.forEach((record) => {
          if (category.parentEntityId === record.entityId) {
            parentType = record;
          } else if (record.children && record.children.length > 0) {
            find(record.children);
          }
        });
      }

      find(state.categoryArray);
      return parentType;
    },

    findIndexInParentCategoryChildren: (state) => (parentTypeChildren, code) => {
      return parentTypeChildren.findIndex((child) => child.entityId === code.entityId);
    },
  },

  actions: {
    setcategories(categories) {
      this.categories = new Map();
      categories.forEach((category) => {
        if (category.children?.length) {
          category.children.sort((a, b) => {
            if (a.orderNumber !== b.orderNumber) return a.orderNumber - b.orderNumber;
            return a.name.localeCompare(b.name);
          });
        }
        this.categories.set(category.code, category);
      });
    },

    setcategoryArray(categories) {
      this.recid = 1;

      const setParentCategoryAndSort = (records, parent) => {
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
          if (record.children?.length) setParentCategoryAndSort(record.children, record);
        });
      };

      this.categoryArray = categories;
      setParentCategoryAndSort(this.categoryArray);
    },

    load() {
      categoryApi
        .getCategory(null, false) // (isTopCode = false) : children항목들도 모두 리스트로 받는다
        .then((response) => {
          if (response.status === 200) this.setcategories(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      categoryApi
        .getCategory(null)
        .then((response) => {
          if (response.status === 200) this.setcategoryArray(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    clear() {
      this.setcategories([]);
      this.setcategoryArray([]);
    },

    async save(entities) {
      try {
        const response = await categoryApi.saveMultipleCategories(entities);
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
        const response = await categoryApi.updateMultipleCategories(entities);
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
        const response = await categoryApi.deleteCategory(entityId);
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
        // 검색 조건이 없으면  배열 반환
        if (!payload.name && !payload.code) {
          // resolve([...this.categoryArray]);
          resolve([]);
          return;
        }

        // 재귀적으로 상담 유형을 검색하는 함수
        const find = (categories) => {
          return categories.reduce((results, category) => {
            const newType = { ...category };
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
        resolve(find(this.categoryArray));
      });
    },
  },
});
