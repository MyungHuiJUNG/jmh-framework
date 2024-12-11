import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getNotice = (entityId) => {
  return api.get(`/rest/api/v1/notice/notices/${entityId}`, {
    ...getHeaders(),
  });
};

const getNotices = (params) => {
  const paramsWithSort = {
    ...params,
    sort: "createdDate,desc",
  };
  return api.get("/rest/api/v1/notice/notices", {
    params: paramsWithSort,
    ...getHeaders(),
  });
};

const saveNotice = (param) => {
  return api.post("/rest/api/v1/notice/notices", param, getHeaders());
};

const updateNotice = (entityId, param) => {
  return api.put(`/rest/api/v1/notice/notices/${entityId}`, param, getHeaders());
};

const deleteNotice = (entityId) => {
  return api.delete(`/rest/api/v1/notice/notices/${entityId}`, getHeaders());
};

const deleteNotices = (entityIds) => {
  const params = {
    entityIds,
  };
  return api.delete("/rest/api/v1/notice/notices", {
    params: params,
    ...getHeaders(),
  });
};

export default { getNotice, getNotices, saveNotice, updateNotice, deleteNotice, deleteNotices };
