import{u as j}from"./codeStore.e69f9e04.js";import{u as F}from"./permissionStore.29c18612.js";import{c as f}from"./customerInfoApi.4e3b1586.js";import k from"./TabulatorGrid.9c80b09d.js";import{s as A,a as B}from"./dialog.88ce899f.js";import{h as m}from"./errorHandler.5efe1eb1.js";import{F as L}from"./FlowRoleCode.12cdb02e.js";import M from"./ALoadingSpinner.ca275fb8.js";import{g as O,r as n,y as T,o as U,Y as q,a as _}from"./index.02f7c95d.js";import"./axios.816e1a60.js";import"./permissionApi.ffe0b82d.js";import"./header.10137493.js";import"./CommonPopup.2b0ee10b.js";import"./use-dialog-plugin-component.234e0905.js";import"./authStore.fadf8446.js";import"./counsel-hub.145170b4.js";import"./_plugin-vue_export-helper.cdc0426e.js";const G={class:"full-height"},Y="/rest/api/v1/customer-info/customer-infos",fe={__name:"CustomerInfoManageTable",emits:["rowSelected","rowDeselected","rowDeleted"],setup($,{expose:C,emit:S}){const g=S;C({deleteCustomerInfo:b,loadInitialData:h,searchCustomerInfos:P,setData:p});const I=F(),D=j(),z=O(()=>I.hasPermission(L.CUSTOMER_INFO_ROLE.READ)),i=n(!1),w=n(null),u=n(!1),R=[{title:"#",field:"rownum",formatter:"rownum",headerHozAlign:"center",hozAlign:"center",headerSort:!1,resizable:!1,width:"50"},{title:"\uD68C\uC0AC\uBA85",field:"name",headerHozAlign:"center",hozAlign:"center"},{title:"\uB300\uD45C\uBC88\uD638",field:"representativeNumber",headerHozAlign:"center",hozAlign:"center"},{title:"\uC804\uD654\uBC88\uD6381",field:"secondaryNumber",headerHozAlign:"center",hozAlign:"center"},{title:"\uC804\uD654\uBC88\uD6382",field:"thirdNumber",headerHozAlign:"center",hozAlign:"center"},{title:"\uC5C5\uCCB4\uB2F4\uB2F9\uC790",field:"managerName",headerHozAlign:"center",hozAlign:"center"},{title:"\uACE0\uAC1D\uC720\uD615",field:"customerTypeCode",headerHozAlign:"center",hozAlign:"center",formatter:function(e){var o,v;const t=e.getValue()||null;return(v=(o=D.codes.get(t))==null?void 0:o.name)!=null?v:t}},{title:"\uBE44\uACE0",field:"note",headerHozAlign:"center",hozAlign:"center"}],s=n([]),l=n(0),c=n(100),d=n(!1),a=n({page:l.value,size:c.value});function H(e){g("rowSelected",e)}function x(){g("rowDeselected")}async function y(){if(!u.value&&!d.value){a.value={...a.value,page:l.value};try{const e=await f.getCustomerInfos(a.value);e.status===200&&(s.value=[...s.value,...e.data.content],d.value=e.data.last,l.value+=1)}catch(e){m(e)}}}function P(e){if(!z.value){A("\uC5C5\uCCB4\uC815\uBCF4 \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}if(u.value)a.value={...e},p();else return l.value=0,a.value={page:l.value,size:c.value,...e},i.value=!0,f.getCustomerInfos(a.value).then(t=>{t&&t.data&&(s.value=t.data.content,d.value=t.data.last,l.value+=1)}).catch(t=>{m(t)}).finally(()=>{i.value=!1})}function h(){if(!z.value){A("\uC5C5\uCCB4\uC815\uBCF4 \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}u.value?a.value={}:(l.value=0,a.value={page:l.value,size:c.value},i.value=!0,f.getCustomerInfos(a.value).then(e=>{e.status===200&&(s.value=e.data.content,d.value=e.data.last,l.value+=1)}).catch(e=>{m(e)}).finally(()=>{i.value=!1}))}function b(e){!e||B("\uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?").then(t=>{t&&f.deleteCustomerInfo(e).then(o=>{o.status===200&&(h(),u.value&&p(),g("rowDeleted"))}).catch(o=>{m(o)})})}T(()=>{h()});function p(){u.value&&w.value.setData()}function E(e,t,o){return a.value={...a.value,page:o.page-1,size:o.size||c.value,isPaging:!0},new Promise(function(v,N){f.getCustomerInfos(a.value).then(r=>{if(r.status===200){const V={data:r.data.content,last_page:r.data.totalPages,last_row:r.data.totalElements};v(V)}}).catch(r=>{m(r),N(r)})})}return(e,t)=>(U(),q("div",G,[_(k,{rows:s.value,columns:R,onRowSelected:H,onRowDeselected:x,"selectable-rows":1,"infinite-scroll":y,"ajax-url":Y,"ajax-request-func":E,pagination:u.value,"pagination-size":c.value,class:"full-height",ref_key:"grid",ref:w},null,8,["rows","pagination","pagination-size"]),_(M,{modelValue:i.value,"onUpdate:modelValue":t[0]||(t[0]=o=>i.value=o)},null,8,["modelValue"])]))}};export{fe as default};