const getHeaders = (dateFormat = "yyyy-MM-dd") => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "date-format": dateFormat,
    },
  };
};

export { getHeaders };
