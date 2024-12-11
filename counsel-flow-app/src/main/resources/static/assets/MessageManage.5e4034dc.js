import O from"./TabulatorGrid.9c80b09d.js";import{n as f}from"./notificationApi.e49dbc1e.js";import{h as d}from"./errorHandler.5efe1eb1.js";import{s as A,a as U}from"./dialog.88ce899f.js";import{F as Q}from"./FlowSystemCode.7be7ce49.js";import Z from"./ATitleBar.bbf1d9a4.js";import J from"./ABtn.e24d7e8a.js";import{u as K}from"./authStore.fadf8446.js";import W from"./NotificationMessageSearchBar.1387acc5.js";import{u as X}from"./use-quasar.2d4ce40a.js";import ee from"./NotificationMessagePopup.f5b848b3.js";import{u as te}from"./codeStore.e69f9e04.js";import{u as ae}from"./permissionStore.29c18612.js";import{F as $}from"./FlowRoleCode.12cdb02e.js";import oe from"./ALoadingSpinner.ca275fb8.js";import{r as i,g as b,y as ne,o as C,Y as H,z as P,a as g,Z as ie}from"./index.02f7c95d.js";import"./axios.816e1a60.js";import"./header.10137493.js";import"./counsel-hub.145170b4.js";import"./CommonPopup.2b0ee10b.js";import"./use-dialog-plugin-component.234e0905.js";import"./ClosePopup.daa62b28.js";/* empty css                                                             */import"./_plugin-vue_export-helper.cdc0426e.js";import"./ACheckbox.923db872.js";import"./AInput.398f059b.js";import"./ASelect.a02a29e0.js";import"./QItem.1bce08e7.js";import"./QSelect.b17c746f.js";import"./QMenu.3c9cf304.js";import"./position-engine.53490cc8.js";import"./rtl.276c3f1b.js";import"./format.2cae61da.js";import"./UserPopup.4dc2e487.js";import"./organizationStore.a86bd6ff.js";import"./userApi.abe7b8c8.js";import"./QBadge.c1f4e948.js";import"./ATextarea.94103f28.js";/* empty css                                                                  */import"./permissionApi.ffe0b82d.js";const re={class:"column no-wrap fit a-border q-pa-xs",style:{"min-height":"680px"}},se={class:"col-auto q-mb-xs"},le={class:"col column no-wrap a-border q-pa-xs"},ce={key:0,class:"full-width text-right bg-grey-5 a-border q-pa-xs col-auto"},ue="/rest/api/v1/message/messages",We={__name:"MessageManage",setup(fe){const l=i(!1),k=X(),S=ae(),z=i(null),c=i(!1),D=b(()=>S.hasPermission($.MESSAGE_ROLE.READ)),q=b(()=>S.hasPermission($.MESSAGE_ROLE.DELETE)),p=K(),F=te(),m=i([]),V=[{formatter:"rowSelection",titleFormatter:"rowSelection",hozAlign:"center",headerHozAlign:"center",headerSort:!1,width:20,resizable:!1},{title:"No.",formatter:"rownum",hozAlign:"center",headerHozAlign:"center",headerSort:!1,width:20},{title:"\uC218\uC2E0\uC77C\uC790",field:"createdDate",headerHozAlign:"center",hozAlign:"center"},{title:"\uC720\uD615",field:"type",headerHozAlign:"center",hozAlign:"center",formatter:function(e){var a,n;const t=e.getValue()||null;return(n=(a=F.codes.get(t))==null?void 0:a.name)!=null?n:name}},{title:"\uC81C\uBAA9",field:"notification.title",headerHozAlign:"center",hozAlign:"center"},{title:"\uB0B4\uC6A9",field:"notification.message",headerHozAlign:"center",hozAlign:"center"},{title:"\uBCF4\uB0B8\uC0AC\uB78C",field:"notification.sender.entityId",headerHozAlign:"center",hozAlign:"center",formatter:function(e){const t=e.getData();return`${t.notification.sender.name} [${t.notification.sender.id}]`}},{title:"\uBC1B\uB294\uC0AC\uB78C",field:"notification.receiver.entityId",headerHozAlign:"center",hozAlign:"center",formatter:function(e){const t=e.getData();return`${t.notification.receiver.name} [${t.notification.receiver.id}]`}},{title:"\uD655\uC778\uC5EC\uBD80",field:"notification.isRead",headerHozAlign:"center",hozAlign:"center",formatter:function(e){const a=e.getData().notification.isRead;return a===!0?"\uC77D\uC74C":a===!1?"\uC548\uC77D\uC74C":null}},{title:"\uD655\uC778\uC77C\uC2DC",field:"notification.readDate",headerHozAlign:"center",hozAlign:"center"}],u=i([]),r=i(0),h=i(100),v=i(!1),o=i(),_=i(E(N(new Date))),M=i(E(T(new Date)));ne(()=>{w()});function N(e){const t=new Date(e);return t.setMonth(e.getMonth()-1),t}function T(e){const t=new Date(e);return t.setDate(e.getDate()+1),t}function E(e){e.setHours(0,0,0,0);const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${n} 00:00:00`}function w(){if(!D.value){A("\uCABD\uC9C0 \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}c.value?o.value={fromCreatedDate:_.value,toCreatedDate:M.value,"entity.owner.entityId":p.entityId}:(l.value=!0,r.value=0,o.value={page:r.value,size:h.value,fromCreatedDate:_.value,toCreatedDate:M.value,"entity.owner.entityId":p.entityId},f.getMessages(o.value).then(e=>{e.status===200&&(m.value=e.data.content,v.value=e.data.last,r.value+=1)}).catch(e=>{d(e)}).finally(()=>{l.value=!1}))}async function B(){if(!c.value&&!v.value){o.value={...o.value,page:r.value};try{const e=await f.getMessages(o.value);e.status===200&&(m.value=[...m.value,...e.data.content],v.value=e.data.last,r.value+=1)}catch(e){d(e)}}}function R(e){u.value=[],u.value=e}function L(e){if(!D.value){A("\uCABD\uC9C0 \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}c.value?(o.value={"entity.owner.entityId":p.entityId,...e},y()):(l.value=!0,r.value=0,o.value={page:r.value,size:h.value,"entity.owner.entityId":p.entityId,...e},f.getMessages(o.value).then(t=>{t.status===200&&(m.value=t.data.content,v.value=t.data.last,r.value+=1)}).catch(t=>{d(t)}).finally(()=>{l.value=!1}))}function G(e){const t=e.notification.entityId;e.type===Q.MESSAGE_TYPE.RECEIVE_MESSAGE&&f.updateNotification(t).then(n=>{n.status===200&&(w(),c.value&&y())}).catch(n=>{d(n)}),k.dialog({component:ee,componentProps:{componentType:"read",data:e.notification}})}function j(){if(!u.value.length){A("\uC0AD\uC81C\uD560 \uCABD\uC9C0\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}U("\uCABD\uC9C0\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?").then(e=>{if(e){let t="";for(const[a,n]of u.value.entries())t+=n.entityId,a<u.value.length-1&&(t+=",");f.deleteMessages(t).then(a=>{a.status===200&&(u.value=[],w(),c.value&&y())}).catch(a=>{d(a)})}})}function y(){z.value.setData()}function Y(e,t,a){return o.value={...o.value,page:a.page-1,size:a.size||h.value,isPaging:!0},new Promise(function(n,I){f.getMessages(o.value).then(s=>{if(s.status===200){const x={data:s.data.content,last_page:s.data.totalPages,last_row:s.data.totalElements};n(x)}}).catch(s=>{d(s),I(s)})})}return(e,t)=>(C(),H("div",re,[P("div",se,[g(W,{onSearch:L})]),P("div",le,[g(Z,{title:"\uCABD\uC9C0 \uBAA9\uB85D",class:"col-auto full-width q-mb-xs"}),g(O,{rows:m.value,columns:V,infiniteScroll:B,selectableRows:!0,selectableRowsRangeMode:"click",onRowSelected:R,onRowDeselected:R,onRowDblClick:G,"ajax-url":ue,"ajax-request-func":Y,pagination:c.value,"pagination-size":h.value,class:"col full-width",ref_key:"grid",ref:z},null,8,["rows","pagination","pagination-size"]),q.value?(C(),H("div",ce,[g(J,{label:"\uC0AD\uC81C",onClick:j})])):ie("",!0)]),g(oe,{modelValue:l.value,"onUpdate:modelValue":t[0]||(t[0]=a=>l.value=a)},null,8,["modelValue"])]))}};export{We as default};
