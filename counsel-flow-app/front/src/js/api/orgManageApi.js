import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getOrg = (entityId, isTopCode) => {
  let url = entityId
    ? `/rest/api/v1/organization/organizations/${entityId}`
    : `/rest/api/v1/organization/organizations`;

  if (typeof isTopCode !== "undefined") url += `?isTopCode=${isTopCode}`;

  return api.get(url, getHeaders());
};

const saveOrg = (code, name, parentId, orderNumber) => {
  return api.post(
    "/rest/api/v1/organization/organizations",
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

const updateOrg = (entityId, code, name, parentId, orderNumber) => {
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
    `/rest/api/v1/organization/organizations/${entityId}`,
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
const saveMultipleOrg = (entities) => {
  return api.post(
    "/rest/api/v1/organization/organizations/multiple",
    {
      entities: entities,
    },
    getHeaders()
  );
};

const updateMultipleOrg = (entities) => {
  return api.put(
    "/rest/api/v1/organization/organizations/multiple",
    {
      entities: entities,
    },
    getHeaders()
  );
};

const deleteOrg = (entityId) => {
  return api.delete(`/rest/api/v1/organization/organizations/${entityId}`, getHeaders());
};

const deleteMultipleOrgs = (entityIds) => {
  const queryParams = entityIds.join(",");
  return api.delete(`/rest/api/v1/organization/organizations`, {
    ...getHeaders(),
    params: {
      entityIds: queryParams,
    },
  });
};

export default {
  getOrg,
  saveOrg,
  saveMultipleOrg,
  updateMultipleOrg,
  updateOrg,
  deleteOrg,
  deleteMultipleOrgs,
};
