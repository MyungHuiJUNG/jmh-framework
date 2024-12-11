import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getCommands = (userEntityId) => {
  return api.get(`/rest/api/v1/users/${userEntityId}/command/commands`, getHeaders());
};

const saveCommand = (userEntityId, params) => {
  return api.post(`/rest/api/v1/users/${userEntityId}/command/commands`, params, {
    headers: {
      ...getHeaders().headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const updateCommand = (userEntityId, commandEntityId, params) => {
  return api.put(`/rest/api/v1/users/${userEntityId}/command/commands/${commandEntityId}`, params, {
    headers: {
      ...getHeaders().headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const deleteCommands = (userEntityId, commandEntityIds) => {
  const params = {
    commandEntityIds,
  };

  return api.delete(`/rest/api/v1/users/${userEntityId}/command/commands`, {
    params: params,
    ...getHeaders(),
  });
};

const saveShortCutKeys = (commandEntityId, keyList) => {
  const params = {
    entities: keyList,
  };

  return api.post(`/rest/api/v1/commands/${commandEntityId}/short-cut-key/short-cut-keys/multiple`, params, {
    headers: {
      ...getHeaders().headers,
      "Content-Type": "application/json",
    },
  });
};

export default { getCommands, saveCommand, updateCommand, deleteCommands, saveShortCutKeys };
