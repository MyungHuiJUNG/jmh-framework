import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getPasswordResetRequestor = (param) => {
  return api.get(`/rest/api/v1/task/request/requests`, {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
    params: param,
  });
};

const postPasswordReset = (param) => {
  const urlEncodedData = new URLSearchParams();

  for (const key in param) {
    if (param.hasOwnProperty(key)) {
      urlEncodedData.append(key, param[key]);
    }
  }

  return api.post("/rest/api/v1/task/request/requests/request-init-password", urlEncodedData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

const putPasswordReset = (requestId, param) => {
  const urlEncodedData = new URLSearchParams();

  for (const key in param) {
    if (param.hasOwnProperty(key)) {
      urlEncodedData.append(key, param[key]);
    }
  }

  return api.put(`/rest/api/v1/task/request/requests/${requestId}`, urlEncodedData, {
    headers: {
      ...getHeaders("yyyy-MM-dd HH:mm:ss").headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export default { getPasswordResetRequestor, postPasswordReset, putPasswordReset };
