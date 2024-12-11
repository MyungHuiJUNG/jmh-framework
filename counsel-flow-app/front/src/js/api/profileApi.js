import { api } from "src/boot/axios";

const getUser = (userId) => {
  return api.get(`/rest/api/v1/user/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};


const putUser = (userId, param) => {
  return api.put(`/rest/api/v1/user/users/${userId}`, param, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
    },
  });
};
export default { getUser, putUser };
