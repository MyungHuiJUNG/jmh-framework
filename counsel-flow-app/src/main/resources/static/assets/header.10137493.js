const t=(e="yyyy-MM-dd")=>({headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`,"date-format":e}});export{t as g};
