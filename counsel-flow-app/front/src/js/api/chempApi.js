import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const sendMessage = (params) => {
  return api.post("/rest/api/v1/chemp/sms", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...getHeaders().headers,
    },
  });
};

export default { sendMessage };
