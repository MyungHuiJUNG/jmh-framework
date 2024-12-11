import { api } from "src/boot/axios";

const getUser = (userId) => {
  return api.get(`/rest/api/v1/user/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const getUsers = (param) => {
  return api.get("/rest/api/v1/user/users", {
    params: param,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const getOrgs = () => {
  return api.get("/rest/api/v1/organization/organizations", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const postPermssionByUser = (param, permissionId) => {
  return api.post(`/rest/api/v1/settings/role-group/${permissionId}/users`, param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const postUser = (param) => {
  return api.post("/rest/api/v1/user/users", param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const deleteUser = (userId) => {
  return api.delete(`/rest/api/v1/user/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const putUser = (userId, param) => {
  return api.put(`/rest/api/v1/user/users/${userId}`, param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const getRoles = () => {
  return api.get("/rest/api/v1/settings/role-group/role-groups", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

export default { getUser,getUsers, postPermssionByUser, getOrgs, postUser, deleteUser, putUser, getRoles };
