import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getCategories = (entityId, isTopCode) => {
  let url = entityId ? `/rest/api/v1/board/categories/${entityId}` : `/rest/api/v1/board/categories`;

  if (typeof isTopCode !== "undefined") url += `?isTopCode=${isTopCode}`;

  return api.get(url, getHeaders());
};

const saveCategories = (code, name, parentId, orderNumber) => {
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

const updateCategories = (entityId, code, name, parentId, orderNumber) => {
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

  return api.put(
    `/rest/api/v1/board/categories/${entityId}`,
    {
      entity: entity,
    },
    getHeaders()
  );
};

/* @param
const entities =
[
  {
      "entityId" : 305,
      "code" : "03~",
      "name" : "상담유형 대3수정",
      "orderNumber" : 3
  },
  {
      "code" : "06",
      "name" : "상담유형 대6",
      "orderNumber" : 6,
      "parent": {
          "entityId" : 100
      }
  }
]
*/
const saveMultipleCategories = (entities) => {
  return api.post(
    "/rest/api/v1/board/categories/multiple",
    {
      entities: entities,
    },
    getHeaders()
  );
};

const updateMultipleCategories = (entities) => {
  return api.put(
    "/rest/api/v1/board/categories/multiple",
    {
      entities: entities,
    },
    getHeaders()
  );
};

const deleteCategories = (entityId) => {
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
  getCategories,
  saveCategories,
  saveMultipleCategories,
  updateMultipleCategories,
  updateCategories,
  deleteCategories,
  deleteMultipleCategories,
};
