import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";
import AppUtil from "components/common/js/app-util";

const getBoards = (params) => {
  const paramsWithSort = {
    ...params,
    sort: "createdDate,desc",
  };
  return api.get("/rest/api/v1/board/boards", {
    params: paramsWithSort,
    ...getHeaders(),
  });
};

const getBoardsTotalCount = (params) => {
  const paramsWithSort = {
    ...params,
    sort: "createdDate,desc",
  };
  return api.get("/rest/api/v1/board/boards/totalCount", {
    params: paramsWithSort,
    ...getHeaders(),
  });
}
const getBoard = (entityId) => {
  return api.get(`/rest/api/v1/board/boards/${entityId}`, {
    ...getHeaders(),
  });
};

const addBoard = (params) => {
  return api.post("/rest/api/v1/board/boards", AppUtil.convertObjectToEntityUrlParam(params), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": "yyyy-MM-dd HH:mm:ss",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const updateBoard = (entityId, params) => {
  return api.put(`/rest/api/v1/board/boards/${entityId}`, AppUtil.convertObjectToEntityUrlParam(params), {
    ...getHeaders(),
  });
};

const deleteBoard = (entityId) => {
  return api.delete(`/rest/api/v1/board/boards/${entityId}`, {
    ...getHeaders(),
  });
};

const deleteBoards = (entityIds) => {
  const params = {
    entityIds,
  };
  return api.delete("/rest/api/v1/board/boards", {
    params: params,
    ...getHeaders(),
  });
};

/*
  댓글 api
*/

const getReply = (boardEntityId) => {
  const params = {};
  params["entity.board.entityId"] = boardEntityId;
  return api.get(`/rest/api/v1/board/replies`, {
    ...getHeaders("yyyy-MM-dd HH:mm:ss"),
    params: { ...params, sort: "createdDate,desc" },
  });
};

const addReply = (params) => {
  const headers = {
    ...getHeaders("yyyy-MM-dd HH:mm:ss").headers, // getHeaders에서 반환된 헤더 가져오기
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return api.post("/rest/api/v1/board/replies", params, { headers });
};

const updateReply = (params, entityId) => {
  const headers = {
    ...getHeaders("yyyy-MM-dd HH:mm:ss").headers, // getHeaders에서 반환된 헤더 가져오기
    "Content-Type": "application/x-www-form-urlencoded",
  };
  return api.put(`/rest/api/v1/board/replies/${entityId}`, params, { headers });
};

const removeReply = (entityId) => {
  return api.delete(`/rest/api/v1/board/replies/${entityId}`, {
    ...getHeaders(),
  });
};

export default {
  getBoard,
  getBoards,
  addBoard,
  getBoardsTotalCount,
  updateBoard,
  deleteBoard,
  deleteBoards,
  getReply,
  addReply,
  updateReply,
  removeReply,
};
