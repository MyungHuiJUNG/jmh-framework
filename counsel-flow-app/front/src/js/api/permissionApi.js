import { api } from "src/boot/axios";

const getPermissions = (param) => {
  return api.get("/rest/api/v1/settings/role-group/role-groups", {
    params: param,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const getUsersByPermission = (permissionId) => {
  return api.get(`/rest/api/v1/settings/role-group/${permissionId}/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const getMenus = (param) => {
  return api.get("/rest/api/v1/settings/menu/menus", {
    params: param,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const getRoles = () => {
  return api.get(`/rest/api/v1/settings/role/roles`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const getRolesByPermission = (permissionId) => {
  return api.get(`/rest/api/v1/settings/role-group/${permissionId}/roles`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const getMenusByPermission = (permissionId) => {
  return api.get(`/rest/api/v1/settings/role-group/${permissionId}/menus`, {
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

const postPermission = (param) => {
  return api.post("/rest/api/v1/settings/role-group/role-groups/multiple", param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const deletePermission = (permissionId) => {
  return api.delete(`/rest/api/v1/settings/role-group/role-groups/${permissionId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const putPermission = (param) => {
  return api.put(`/rest/api/v1/settings/role-group/role-groups/multiple`, param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const deleteUsersByPermission = (entityId, permissionIds) => {
  return api.delete(`/rest/api/v1/settings/role-group/${entityId}/users?entityIds=${permissionIds}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const postUsersByPermission = (param, permissionId) => {
  return api.post(`/rest/api/v1/settings/role-group/${permissionId}/users/multiple`, param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const postMenusByPermission = (param, permissionId) => {
  return api.post(`/rest/api/v1/settings/role-group/${permissionId}/menus/multiple`, param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const postRolesByPermission = (param, permissionId) => {
  return api.post(`/rest/api/v1/settings/role-group/${permissionId}/roles/multiple`, param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

export default {
  getMenus,
  postMenusByPermission,
  getRoles,
  getRolesByPermission,
  getUsers,
  getPermissions,
  postPermission,
  deletePermission,
  putPermission,
  deleteUsersByPermission,
  getUsersByPermission,
  postUsersByPermission,
  postRolesByPermission,
  getMenusByPermission,
};
