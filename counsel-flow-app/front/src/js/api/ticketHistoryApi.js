import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getTicketHistory = (params) => {
  return api.get("/rest/api/v1/ticket/histories", {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
    params: params,
  });
};

export default { getTicketHistory };
