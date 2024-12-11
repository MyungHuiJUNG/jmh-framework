import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getScript = (params) => {
  return api.get(`/rest/api/v1/script/scripts`, {
    params: params,
    ...getHeaders(),
  });
};

const saveScript = (params) => {
  return api.post("/rest/api/v1/script/scripts", params, getHeaders());
};

const updateScript = (entityId, params) => {
  return api.put(`/rest/api/v1/script/scripts/${entityId}`, params, getHeaders());
};

export default { getScript, saveScript, updateScript };
