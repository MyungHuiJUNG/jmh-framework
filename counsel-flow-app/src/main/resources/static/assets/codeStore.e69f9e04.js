import{d as f}from"./index.02f7c95d.js";import{api as h}from"./axios.816e1a60.js";const m=(t,e)=>(e!=null&&(t={...t,isTopCode:e}),h.get("/rest/api/v1/settings/code/codes",{params:t,headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`,"date-format":"yyyy-MM-dd HH:mm:ss"}})),C=t=>h.get(`/rest/api/v1/settings/code/codes/${t}`,{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`,"date-format":"yyyy-MM-dd HH:mm:ss"}}),g=t=>h.put("/rest/api/v1/settings/code/codes/multiple",t,{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`,"Content-Type":"application/json","date-format":"yyyy-MM-dd HH:mm:ss"}}),y=t=>h.post("/rest/api/v1/settings/code/codes/multiple",t,{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`,"Content-Type":"application/json","date-format":"yyyy-MM-dd HH:mm:ss"}}),I=t=>h.delete(`/rest/api/v1/settings/code/codes/${t}`,{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`,"date-format":"yyyy-MM-dd HH:mm:ss"}}),l={getCodes:m,getCode:C,putCode:g,postCode:y,deleteCode:I},M=f("codeStore",{state:()=>({codes:new Map,codeArray:[],recid:1,initialLoaded:!1}),getters:{getCode:t=>(e,i)=>{if(!e)return null;let n=Array.isArray(e)?e:e.children;return n!=null&&n.length&&n.find(r=>r.code===i)||null},getCodeName:t=>(e,i)=>{if(!e)return null;let n=Array.isArray(e)?e:e.children;if(!(n!=null&&n.length))return null;const r=n.find(o=>o.code===i);return r?r.name:null},getCodeByEntityId:t=>(e,i)=>{if(!e)return null;let n=Array.isArray(e)?e:e.children;return n!=null&&n.length&&n.find(r=>r.entityId===i)||null},getChildrenCodesByTopParentCodeValue:t=>e=>{const i=t.codes.get(e);return(i==null?void 0:i.children)||[]},getChildrenCodeNamesByTopParentCodeValue:t=>e=>{var n;const i=t.codes.get(e);return((n=i==null?void 0:i.children)==null?void 0:n.map(r=>r.name))||[]},findCodesInTopParentCodeValue:t=>(e,i,n)=>{function r(c,s,u){!(s!=null&&s.children)||s.children.forEach(a=>{a.code===u&&c.push(a),r(c,a,u)})}const o=[],d=t.codes.get(e);return d&&r(o,d,i),n?o[0]||null:o},findCodeNamesInTopParentCodeValue:t=>(e,i,n)=>{function r(c,s,u){!(s!=null&&s.children)||s.children.forEach(a=>{a.code===u&&c.push(a.name),r(c,a,u)})}const o=[],d=t.codes.get(e);return d&&r(o,d,i),n?o[0]||null:o},findParentCodeByChildren:t=>e=>{if(!(e!=null&&e.parentEntityId))return t.codeArray;let i=null;function n(r){r.forEach(o=>{var d;e.parentEntityId===o.entityId?i=o.children||[]:(d=o.children)!=null&&d.length&&n(o.children)})}return n(t.codeArray),i||t.codeArray},findParentCode:t=>e=>{if(!(e!=null&&e.parentEntityId))return null;let i=null;function n(r){r.forEach(o=>{e.parentEntityId===o.entityId?i=o:o.children&&o.children.length>0&&n(o.children)})}return n(t.codeArray),i},findIndexInParentCodeChildren:t=>(e,i)=>e.findIndex(n=>n.entityId===i.entityId)},actions:{setCodes(t){this.codes=new Map,t.forEach(e=>{var i;(i=e.children)!=null&&i.length&&e.children.sort((n,r)=>n.orderNumber!==r.orderNumber?n.orderNumber-r.orderNumber:n.name.localeCompare(r.name)),this.codes.set(e.code,e)})},setCodeArray(t){this.recid=1;const e=(i,n)=>{i.sort((r,o)=>r.orderNumber!==o.orderNumber?r.orderNumber-o.orderNumber:r.name.localeCompare(o.name)),i.forEach(r=>{var o;r.recid=this.recid++,r.remarkText||(r.remarkText=""),n&&(r.parentCode=n.code,r.parentEntityId=n.entityId,r.parentRecid=n.recid,r.prevParentEntityId=n.entityId),(o=r.children)!=null&&o.length&&e(r.children,r)})};this.codeArray=t,e(this.codeArray)},load(t){l.getCodes(t,!1).then(e=>{e.status===200&&this.setCodes(e.data)}).catch(e=>{console.log(e)}),l.getCodes(t).then(e=>{e.status===200&&this.setCodeArray(e.data)}).catch(e=>{console.log(e)})},fetchInitialData(t){return this.initialLoaded?Promise.resolve():(this.initialLoaded=!0,Promise.all([l.getCodes(t,!1),l.getCodes(t)]).then(([e,i])=>{this.setCodes(e.data),this.setCodeArray(i.data)}).catch(e=>{throw this.initialLoaded=!1,e}))},clearInitialData(){this.initialLoaded=!1,this.clear()},clear(){this.setCodes([]),this.setCodeArray([])},async save(t){try{const e=await l.postCode(t);return e.status===200&&this.load(),e}catch(e){throw console.log(e),e}},async update(t){try{const e=await l.putCode(t);return e.status===200&&this.load(),e}catch(e){throw console.log(e),e}}}});export{l as c,M as u};