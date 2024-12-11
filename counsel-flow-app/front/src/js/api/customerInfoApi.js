import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getCustomerInfo = (entityId) => {
  return api.get(`/rest/api/v1/customer-info/customer-infos/${entityId}`, getHeaders("yyyy-MM-dd HH:mm:ss"));
};

const getCustomerInfos = (params) => {
  return api.get("/rest/api/v1/customer-info/customer-infos", {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
    params: params,
  });
};

const deleteCustomerInfo = (entityId) => {
  return api.delete(`/rest/api/v1/customer-info/customer-infos/${entityId}`, getHeaders("yyyy-MM-dd HH:mm:ss"));
};

const updateCustomerInfo = (entityId, params) => {
  return api.put(`/rest/api/v1/customer-info/customer-infos/${entityId}`, params, {
    headers: {
      ...getHeaders("yyyy-MM-dd HH:mm:ss").headers,
      "Content-Type": "application/json",
    },
  });
};

const saveCustomerInfo = (params) => {
  return api.post("/rest/api/v1/customer-info/customer-infos", params, {
    headers: {
      ...getHeaders("yyyy-MM-dd HH:mm:ss").headers,
      "Content-Type": "application/json",
    },
  });
};

export default { getCustomerInfo, getCustomerInfos, deleteCustomerInfo, updateCustomerInfo, saveCustomerInfo };
