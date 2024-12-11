import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getSystemVariable = (entityId, isTopCode) => {
  let url = entityId
    ? `/rest/api/v1/settings/system/variable/variables/${entityId}`
    : `/rest/api/v1/settings/system/variable/variables`;

  if (typeof isTopCode !== "undefined") url += `?isTopCode=${isTopCode}`;

  return api.get(url, getHeaders());
};

const putSystemVariable = (entityId, param) => {
  return api.put(`/rest/api/v1/settings/system/variable/variables/${entityId}`, param, {
    ...getHeaders(),
    "Content-Type": "application/json",
  });
};

export default { getSystemVariable, putSystemVariable };
