import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getAccessLogs = (params) => {
  return api.get("/rest/api/v1/access-log/access-logs", {
    params: { ...params, sort: "createdDate,desc" },
    ...getHeaders("yyyy-MM-dd HH:mm:ss"),
  });
};

export default { getAccessLogs };
