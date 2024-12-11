import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getCategory = (entityId, isTopCode) => {
  let url = entityId ? `/rest/api/v1/board/categories/${entityId}` : `/rest/api/v1/board/categories`;
  if (typeof isTopCode !== "undefined") url += `?isTopCode=${isTopCode}`;

  return api.get(url, getHeaders());
};

const saveCategory = (code, name, parentId, orderNumber) => {
  return api.post(
    "/rest/api/v1/board/categories",
    {
      entity: {
        code: code,
        name: name,
        orderNumber: orderNumber,
        parent: {
          entityId: parentId,
        },
      },
    },
    getHeaders()
  );
};

const updateCategory = (entityId, code, name, parentId, orderNumber) => {
  const entity = {
    code: code,
    name: name,
    orderNumber: orderNumber,
  };

  if (parentId) {
    entity.parent = {
      entityId: parentId,
    };
  }

  return api.put(`/rest/api/v1/board/categories/${entityId}`, { entity: entity }, getHeaders());
};

const saveMultipleCategories = (entities) => {
  return api.post("/rest/api/v1/board/categories/multiple", { entities: entities }, getHeaders());
};

const updateMultipleCategories = (entities) => {
  return api.put("/rest/api/v1/board/categories/multiple", { entities: entities }, getHeaders());
};

const deleteCategory = (entityId) => {
  return api.delete(`/rest/api/v1/board/categories/${entityId}`, getHeaders());
};

const deleteMultipleCategories = (entityIds) => {
  const queryParams = entityIds.join(",");
  return api.delete(`/rest/api/v1/board/categories`, {
    ...getHeaders(),
    params: {
      entityIds: queryParams,
    },
  });
};

export default {
  getCategory,
  saveCategory,
  saveMultipleCategories,
  updateMultipleCategories,
  updateCategory,
  deleteCategory,
  deleteMultipleCategories,
};
