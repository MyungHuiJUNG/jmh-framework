import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const login = (id, pw) => {
  return api.post(
    "/rest/api/v1/auth/login",
    {
      id: id,
      password: pw,
    },
    {
      headers: {
        "date-format": "yyyy-MM-dd HH:mm:ss",
      },
    }
  );
};

const logout = () => {
  return api.post("/rest/api/v1/auth/logout", null, getHeaders());
};

const getUserInfo = () => {
  return api.get("/rest/api/v1/auth/login-info", getHeaders());
};

const reproduceToken = () => {
  const param = new URLSearchParams();
  param.append("refreshToken", localStorage.getItem("refreshToken"));
  return api.post("/rest/api/v1/auth/token", param, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};

export default { login, logout, getUserInfo, reproduceToken };
