import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getCounselType = (entityId, isTopCode) => {
  let url = entityId ? `/rest/api/v1/counsel/type/types/${entityId}` : `/rest/api/v1/counsel/type/types`;

  if (typeof isTopCode !== "undefined") url += `?isTopCode=${isTopCode}`;

  return api.get(url, getHeaders());
};

const saveCounselType = (code, name, parentId, orderNumber) => {
  return api.post(
    "/rest/api/v1/counsel/type/types",
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

const updateCounselType = (entityId, code, name, parentId, orderNumber) => {
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
    `/rest/api/v1/counsel/type/types/${entityId}`,
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
const saveMultipleCounselType = (entities) => {
  return api.post(
    "/rest/api/v1/counsel/type/types/multiple",
    {
      entities: entities,
    },
    getHeaders()
  );
};

const updateMultipleCounselType = (entities) => {
  return api.put(
    "/rest/api/v1/counsel/type/types/multiple",
    {
      entities: entities,
    },
    getHeaders()
  );
};

const deleteCounselType = (entityId) => {
  return api.delete(`/rest/api/v1/counsel/type/types/${entityId}`, getHeaders());
};

const deleteMultipleCounselTypes = (entityIds) => {
  const queryParams = entityIds.join(",");
  return api.delete(`/rest/api/v1/counsel/type/types`, {
    ...getHeaders(),
    params: {
      entityIds: queryParams,
    },
  });
};

export default {
  getCounselType,
  saveCounselType,
  saveMultipleCounselType,
  updateMultipleCounselType,
  updateCounselType,
  deleteCounselType,
  deleteMultipleCounselTypes,
};
