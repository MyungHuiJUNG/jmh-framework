import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

/**
 * number - 티켓번호
 * statusCode - 처리상태(코드값)
 * typeCode - 상담구분(코드값)
 * tel - 전화번호
 * customerName - 고객명
 * contents - 상담내용
 * startDate - 상담시작시간(YYYY-MM-DD HH:mm:ss)
 * endDate - 상담종료시간(YYYY-MM-DD HH:mm:ss)
 * counselCategoryCode - 상담구분(코드값)
 * counselTypeCodeLarge - 상담유형 대(코드값)
 * counselTypeCodeMedium - 상담유형 중(코드값)
 * counselTypeCodeSmall - 상담유형 소(코드값)
 * callbackReservationDate - 재통화예약시간(YYYY-MM-DD HH:mm:ss)
 * inboundPath - 인입경로
 */

const saveTicket = (ticket) => {
  const params = new URLSearchParams();

  // ticket 객체의 키와 값을 entity.~ 형태로 params에 추가
  for (const key in ticket) {
    if (ticket.hasOwnProperty(key) && ticket[key] != null) {
      // 값이 undefined나 null이 아닌 경우에만 추가
      params.append(`entity.${key}`, ticket[key]);
    }
  }

  const headers = {
    ...getHeaders("yyyy-MM-dd HH:mm:ss").headers, // getHeaders에서 반환된 헤더 가져오기
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return api.post("/rest/api/v1/ticket/tickets", params, { headers });
};

const getTicket = (params) => {
  const paramsWithSort = {
    ...params,
    sort: "createdDate,desc",
  };
  return api.get("/rest/api/v1/ticket/tickets", {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
    params: paramsWithSort,
  });
};

const getTicketByEntityId = (entityId) => {
  return api.get(`/rest/api/v1/ticket/tickets/${entityId}`, {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
  });
};

const deleteTicket = (entityId) => {
  return api.delete(`/rest/api/v1/ticket/tickets/${entityId}`, getHeaders());
};

const updateTicket = (entityId, ticket) => {
  const params = new URLSearchParams();

  // ticket 객체의 키와 값을 entity.~ 형태로 params에 추가
  for (const key in ticket) {
    if (ticket.hasOwnProperty(key) && ticket[key] != null) {
      // 값이 undefined나 null이 아닌 경우에만 추가
      params.append(`entity.${key}`, ticket[key]);
    }
  }

  const headers = {
    ...getHeaders("yyyy-MM-dd HH:mm:ss").headers, // getHeaders에서 반환된 헤더 가져오기
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return api.put(`/rest/api/v1/ticket/tickets/${entityId}`, params, { headers });
};

const downloadTickets = (params) => {
  const paramsWithSort = {
    ...params,
    sort: "createdDate,desc",
  };
  return api.get("/rest/api/v1/ticket/tickets/download/excel", {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
    params: paramsWithSort,
    responseType: "blob",
  });
};

export default { saveTicket, getTicket, deleteTicket, updateTicket, getTicketByEntityId, downloadTickets };
