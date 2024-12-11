import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getCallbacks = (params) => {
  return api.get(`/rest/api/v1/callback/ticket/tickets`, {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
    params: { ...params, sort: "createdDate,desc" },
  });
};

const setManagerManually = (entityId, managerEntityId) => {
  const param = {
    managerEntityId: managerEntityId,
  };
  return api.put(`/rest/api/v1/callback/ticket/tickets/${entityId}/manual-distribute`, param, getHeaders());
};

const registTargetGroup = (param) => {
  return api.post("/rest/api/v1/callback/target-group/target-groups", param, getHeaders());
};

const getTargetGroups = () => {
  return api.get("/rest/api/v1/callback/target-group/target-groups", getHeaders());
};

const updateTargetGroup = (entityId, param) => {
  return api.put(`/rest/api/v1/callback/target-group/target-groups/${entityId}`, param, getHeaders());
};

export default { getCallbacks, setManagerManually, registTargetGroup, getTargetGroups, updateTargetGroup };
