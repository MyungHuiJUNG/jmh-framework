import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getNotifications = (params) => {
  const paramsWithSort = {
    ...params,
    sort: "createdDate,desc",
  };

  return api.get(`/rest/api/v1/notification/notifications`, {
    ...getHeaders("yyyy-MM-dd HH:mm:ss"),
    params: paramsWithSort,
  });
};

const updateNotification = (entityId) => {
  const param = {
    entity: {
      isRead: true,
    },
  };

  return api.put(`/rest/api/v1/notification/notifications/${entityId}`, param, getHeaders("yyyy-MM-dd HH:mm:ss"));
};

const updateMultipleNotifications = (entities) => {
  const updatedEntities = entities.map((entity) => ({
    ...entity,
    isRead: true,
  }));
  return api.put(
    `/rest/api/v1/notification/notifications/multiple`,
    { entities: updatedEntities },
    getHeaders("yyyy-MM-dd HH:mm:ss")
  );
};

const deleteNotifications = (entityIds) => {
  const params = {
    entityIds,
  };
  return api.delete("/rest/api/v1/notification/notifications", {
    params: params,
    ...getHeaders(),
  });
};

const sendMessage = (params) => {
  return api.post("/rest/api/v1/notification/notifications/send-message", params, getHeaders("yyyy-MM-dd HH:mm:ss"));
};

const getMessages = (param) => {
  return api.get("/rest/api/v1/message/messages", {
    params: { ...param, sort: "createdDate,desc" },
    ...getHeaders("yyyy-MM-dd HH:mm:ss"),
  });
};

const deleteMessages = (entityIds) => {
  const param = {
    entityIds,
  };
  return api.delete("/rest/api/v1/message/messages", {
    params: param,
    ...getHeaders("yyyy-MM-dd HH:mm:ss"),
  });
};

export default {
  getNotifications,
  updateNotification,
  updateMultipleNotifications,
  deleteNotifications,
  sendMessage,
  getMessages,
  deleteMessages,
};
