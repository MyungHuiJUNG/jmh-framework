import G from"./TabulatorGrid.9c80b09d.js";import Q from"./ATitleBar.bbf1d9a4.js";import E from"./ABtn.e24d7e8a.js";import Z from"./CallbackSearchBar.7f3c2ae6.js";import{c as f}from"./representativeServiceStore.1d850f8a.js";import{h as g}from"./errorHandler.5efe1eb1.js";import{u as J}from"./codeStore.e69f9e04.js";import{u as W}from"./use-quasar.2d4ce40a.js";import X from"./UserPopup.4dc2e487.js";import{s as v,a as ee}from"./dialog.88ce899f.js";import te from"./CallbackTargetGroupPopup.e5ec4039.js";import{F as b}from"./FlowRoleCode.12cdb02e.js";import{u as ae}from"./permissionStore.29c18612.js";import oe from"./ALoadingSpinner.ca275fb8.js";import{r as n,g as D,y as le,o as A,Y as $,z as F,a as k,c as H,Z as z}from"./index.02f7c95d.js";import"./ClosePopup.daa62b28.js";/* empty css                                                             */import"./_plugin-vue_export-helper.cdc0426e.js";import"./AInput.398f059b.js";import"./ACheckbox.923db872.js";import"./ASelect.a02a29e0.js";import"./QItem.1bce08e7.js";import"./QSelect.b17c746f.js";import"./QMenu.3c9cf304.js";import"./position-engine.53490cc8.js";import"./rtl.276c3f1b.js";import"./format.2cae61da.js";import"./FlowSystemCode.7be7ce49.js";import"./axios.816e1a60.js";import"./header.10137493.js";import"./authStore.fadf8446.js";import"./counsel-hub.145170b4.js";import"./use-dialog-plugin-component.234e0905.js";import"./organizationStore.a86bd6ff.js";import"./userApi.abe7b8c8.js";import"./CommonPopup.2b0ee10b.js";import"./permissionApi.ffe0b82d.js";const ne={class:"column no-wrap fit a-border q-pa-xs",style:{"min-height":"680px"}},re={class:"col-auto q-mb-xs"},ie={class:"col column no-wrap a-border q-pa-xs"},se={key:0,class:"full-width text-right bg-grey-5 a-border q-pa-xs col-auto"},ce="/rest/api/v1/callback/ticket/tickets",ue="\uCF5C\uBC31\uBAA9\uB85D",Qe={__name:"CallbackManage",setup(me){const c=n(!1),C=W(),w=ae(),q=J(),_=n(null),u=n(!1),m=n([]),T=[{formatter:"rowSelection",titleFormatter:"rowSelection",hozAlign:"center",headerHozAlign:"center",headerSort:!1,width:20,resizable:!1},{title:"No.",formatter:"rownum",hozAlign:"center",headerHozAlign:"center",headerSort:!1,width:20},{title:"\uB300\uD45C\uC11C\uBE44\uC2A4",field:"representNumberName",headerHozAlign:"center",hozAlign:"center",formatter:function(t){const e=t.getData();return`${e.representNumberName} (${e.representNumber})`}},{title:"\uC778\uC785\uACBD\uB85C",field:"inboundPathCode",headerHozAlign:"center",hozAlign:"center"},{title:"\uC218\uC2E0\uBC88\uD638",field:"receptionNumber",headerHozAlign:"center",hozAlign:"center"},{title:"\uCF5C\uBC31\uBC88\uD638",field:"callbackNumber",headerHozAlign:"center",hozAlign:"center"},{title:"\uB2F4\uB2F9\uC790",field:"ticket",headerHozAlign:"center",hozAlign:"center",formatter:function(t){const e=t.getData();return e.ticket.managerUserName&&e.ticket.managerUserId?e.ticket.managerUserName+` [${e.ticket.managerUserId}]`:null}},{title:"\uD2F0\uCF13 \uCC98\uB9AC\uC0C1\uD0DC",field:"ticket.statusCode",headerHozAlign:"center",hozAlign:"center",formatter:function(t){var o,a;const e=t.getValue()||null;return(a=(o=q.codes.get(e))==null?void 0:o.name)!=null?a:e}},{title:"\uD2F0\uCF13 \uBC1C\uD589\uC77C\uC2DC",field:"ticket.createdDate",headerHozAlign:"center",hozAlign:"center"},{title:"\uD2F0\uCF13 \uCC98\uB9AC\uC77C\uC2DC",field:"ticket.endDate",headerHozAlign:"center",hozAlign:"center"}],y=D(()=>w.hasPermission(b.CALLBACK_ROLE.READ)),S=D(()=>w.hasPermission(b.CALLBACK_ROLE.AUTO)),R=D(()=>w.hasPermission(b.CALLBACK_ROLE.MANUAL)),d=n([]),r=n(0),p=n(100),h=n(!1),l=n(),x=N(new Date(new Date().setMonth(new Date().getMonth()-1))),L=N(new Date);le(()=>{P()});function M(t){const e=new Date(t);e.setDate(e.getDate()+1);const o=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0");return`${o}-${a}-${i}`}function N(t){const e=new Date(t);let o=""+(e.getMonth()+1),a=""+e.getDate();const i=e.getFullYear();return o.length<2&&(o="0"+o),a.length<2&&(a="0"+a),[i,o,a].join("-")}function O(t){if(!y.value){v("\uCF5C\uBC31 \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}u.value?(l.value={...t},B()):(c.value=!0,r.value=0,l.value={page:r.value,size:p.value,...t},f.getCallbacks(l.value).then(e=>{e&&e.data&&(m.value=e.data.content,h.value=e.data.last,r.value+=1)}).catch(e=>{g(e)}).finally(()=>{c.value=!1}))}function P(){if(!y.value){v("\uCF5C\uBC31 \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}u.value?l.value={fromCreatedDate:x+" 00:00:00",toCreatedDate:M(L)+" 00:00:00"}:(c.value=!0,r.value=0,l.value={page:r.value,size:p.value,fromCreatedDate:x+" 00:00:00",toCreatedDate:M(L)+" 00:00:00"},f.getCallbacks(l.value).then(t=>{t.status===200&&(m.value=t.data.content,h.value=t.data.last,r.value+=1)}).catch(t=>{g(t)}).finally(()=>{c.value=!1}))}function U(t){d.value=[],d.value=t}async function V(){if(!u.value&&!h.value){l.value={...l.value,page:r.value};try{const t=await f.getCallbacks(l.value);t.status===200&&(m.value=[...m.value,...t.data.content],h.value=t.data.last,r.value+=1)}catch(t){g(t)}}}function j(){if(!d.value||!d.value.length){v("\uCF5C\uBC31\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}C.dialog({component:X,componentProps:{enableRowDblClick:!0,title:"\uCF5C\uBC31 \uC218\uB3D9\uBD84\uBC30"}}).onOk(t=>{ee(`${t.payload[0].name} [${t.payload[0].id}] \uC5D0\uAC8C \uBD84\uBC30\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`).then(e=>{if(e){const o=d.value.map(a=>f.setManagerManually(a.entityId,t.payload[0].entityId));Promise.all(o).then(a=>{a.every(i=>i.status===200)&&v("\uC218\uB3D9\uBD84\uBC30\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.")}).catch(a=>{g(a)}).finally(()=>{P(),u.value&&B()})}})})}function I(){C.dialog({component:te})}function B(){_.value.setData()}function K(t,e,o){return l.value={...l.value,page:o.page-1,size:o.size||p.value,isPaging:!0},new Promise(function(a,i){f.getCallbacks(l.value).then(s=>{if(s.status===200){const Y={data:s.data.content,last_page:s.data.totalPages,last_row:s.data.totalElements};a(Y)}}).catch(s=>{g(s),i(s)})})}return(t,e)=>(A(),$("div",ne,[F("div",re,[k(Z,{onSearch:O})]),F("div",ie,[k(Q,{title:ue,class:"q-mb-xs col-auto full-width"}),k(G,{rows:m.value,columns:T,selectableRows:!0,selectableRowsRangeMode:"click",onRowSelected:U,onRowDeselected:U,infiniteScroll:V,"ajax-url":ce,"ajax-request-func":K,pagination:u.value,"pagination-size":p.value,ref_key:"grid",ref:_,class:"col full-width"},null,8,["rows","pagination","pagination-size"]),S.value||R.value?(A(),$("div",se,[S.value?(A(),H(E,{key:0,label:"\uC790\uB3D9\uBD84\uBC30 \uC124\uC815",onClick:I})):z("",!0),R.value?(A(),H(E,{key:1,label:"\uC218\uB3D9\uBD84\uBC30",class:"q-ml-xs",onClick:j})):z("",!0)])):z("",!0)]),k(oe,{modelValue:c.value,"onUpdate:modelValue":e[0]||(e[0]=o=>c.value=o)},null,8,["modelValue"])]))}};export{Qe as default};