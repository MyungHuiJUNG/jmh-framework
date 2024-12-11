import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const saveTicketChannel = (ticketChannel) => {
  const params = new URLSearchParams();

  // ticket 객체의 키와 값을 entity.~ 형태로 params에 추가
  for (const key in ticketChannel) {
    if (ticketChannel.hasOwnProperty(key) && ticketChannel[key] != null) {
      // 값이 undefined나 null이 아닌 경우에만 추가
      params.append(`entity.${key}`, ticketChannel[key]);
    }
  }

  const headers = {
    ...getHeaders("yyyy-MM-dd HH:mm:ss").headers, // getHeaders에서 반환된 헤더 가져오기
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return api.post("/rest/api/v1/ticket/channels", params, { headers });
};

const getTicketChannel = (params) => {
  return api.get("/rest/api/v1/ticket/channels", {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
    params: params,
  });
};

const deleteTicketChannel = (entityId) => {
  return api.delete(`/rest/api/v1/ticket/channels/${entityId}`, getHeaders());
};

const updateTicketChannel = (entityId, ticketChannel) => {
  const params = new URLSearchParams();

  // ticket 객체의 키와 값을 entity.~ 형태로 params에 추가
  for (const key in ticketChannel) {
    if (ticketChannel.hasOwnProperty(key) && ticketChannel[key] != null) {
      // 값이 undefined나 null이 아닌 경우에만 추가
      params.append(`entity.${key}`, ticketChannel[key]);
    }
  }

  const headers = {
    ...getHeaders("yyyy-MM-dd HH:mm:ss").headers, // getHeaders에서 반환된 헤더 가져오기
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return api.put(`/rest/api/v1/ticket/channels/${entityId}`, params, { headers });
};

export default { saveTicketChannel, getTicketChannel, deleteTicketChannel, updateTicketChannel };
