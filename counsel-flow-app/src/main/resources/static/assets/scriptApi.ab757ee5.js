import{api as r}from"./axios.816e1a60.js";import{g as s}from"./header.10137493.js";const i=t=>r.get("/rest/api/v1/script/scripts",{params:t,...s()}),c=t=>r.post("/rest/api/v1/script/scripts",t,s()),e=(t,p)=>r.put(`/rest/api/v1/script/scripts/${t}`,p,s()),n={getScript:i,saveScript:c,updateScript:e};export{n as s};