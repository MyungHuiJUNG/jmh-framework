import { api } from "src/boot/axios";

const getCodes = (param,isTopCode) => {
  if (isTopCode !== undefined && isTopCode !== null) {
    param = { ...param, isTopCode: isTopCode };
  }

  return api.get(`/rest/api/v1/settings/code/codes`, {
    params: param,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const getCode = (codeId) => {
  return api.get(`/rest/api/v1/settings/code/codes/${codeId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const putCode = (param) => {
  return api.put(`/rest/api/v1/settings/code/codes/multiple`, param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const postCode = (param) => {
  return api.post("/rest/api/v1/settings/code/codes/multiple", param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const deleteCode = (codeId) => {
  return api.delete(`/rest/api/v1/settings/code/codes/${codeId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

export default { getCodes, getCode, putCode, postCode, deleteCode };
