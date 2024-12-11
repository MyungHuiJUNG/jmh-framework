import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const headersFormData = {
  ...getHeaders(),
  "Content-Type": "multipart/form-data",
};

const getSiteLinks = () => {
  return api.get("/rest/api/v1/site-link/site-links", getHeaders());
};

const getSiteLinksUsable = () => {
  const param = { "entity.usable": true };
  return api.get("/rest/api/v1/site-link/site-links", {
    params: param,
    ...getHeaders(),
  });
};

const saveSiteLink = (param) => {
  return api.post("/rest/api/v1/site-link/site-links", param, getHeaders());
};

const updateSiteLink = (entityId, param) => {
  return api.put(`/rest/api/v1/site-link/site-links/${entityId}`, param, getHeaders());
};

const deleteIconImg = (entityId) => {
  return api.delete(`/rest/api/v1/site-link/site-links/${entityId}/files`, getHeaders());
};

const deleteSiteLink = (entityId) => {
  return api.delete(`/rest/api/v1/site-link/site-links/${entityId}`, getHeaders());
};

const deleteSiteLinks = (entityIds) => {
  const params = {
    entityIds,
  };
  return api.delete(`/rest/api/v1/site-link/site-links`, {
    params: params,
    ...getHeaders(),
  });
};

const getImageWithToken = async (url) => {
  try {
    const response = await api.get(url, {
      headers: getHeaders().headers,
      responseType: "blob",
    });

    const blob = response.data;
    return URL.createObjectURL(blob);
  } catch (error) {
    return null;
  }
};

export default {
  getSiteLinks,
  saveSiteLink,
  updateSiteLink,
  deleteIconImg,
  deleteSiteLink,
  deleteSiteLinks,
  getImageWithToken,
  getSiteLinksUsable,
};
