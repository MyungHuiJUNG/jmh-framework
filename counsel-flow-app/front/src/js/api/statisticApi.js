import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getStatisticsByCounselType = (params) => {
  return api.get("/rest/api/v1/ticket/statistics/by-counsel-types", {
    headers: getHeaders().headers,
    params: params,
  });
};

const getStatisticsByUsers = (params) => {
  return api.get("/rest/api/v1/ticket/statistics/by-users", {
    headers: getHeaders().headers,
    params: params,
  });
};

export default { getStatisticsByCounselType, getStatisticsByUsers };
