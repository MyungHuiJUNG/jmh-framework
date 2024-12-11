import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const headers = {
  ...getHeaders(),
};

const headersFormData = {
  ...getHeaders(),
  "Content-Type": "multipart/form-data",
};

const uploadFile = (type, entityNumber, param) => {
  return api.post(`/rest/api/v1/file/files/${type}/${entityNumber}/upload`, param, headersFormData);
};

const getFileDetail = (param) => {
  return api.get(`/rest/api/v1/file/files/${param}`, headers);
};

const downloadFile = (entityId) => {
  return api.get(`/rest/api/v1/file/files/${entityId}/download`, {
    ...getHeaders(),
    responseType: "blob",
  });
};

const removeFile = (entityId) => {
  return api.delete(`/rest/api/v1/file/files/${entityId}`, headers);
};

const removeFiles = (entityIds) => {
  const params = {
    entityIds,
  };
  return api.delete("/rest/api/v1/file/files", {
    params: params,
    ...getHeaders(),
  });
};

export default { uploadFile, getFileDetail, downloadFile, removeFile, removeFiles };
