import L from"./NotificationSearchBar.ca0e4545.js";import G from"./TabulatorGrid.9c80b09d.js";import U from"./ABtn.e24d7e8a.js";import{u as Z}from"./codeStore.e69f9e04.js";import{n as f}from"./notificationApi.e49dbc1e.js";import{h as m}from"./errorHandler.5efe1eb1.js";import{s as A,a as J}from"./dialog.88ce899f.js";import{u as K}from"./authStore.fadf8446.js";import{F as v}from"./FlowSystemCode.7be7ce49.js";import Q from"./ATitleBar.bbf1d9a4.js";import{u as W}from"./permissionStore.29c18612.js";import{F}from"./FlowRoleCode.12cdb02e.js";import X from"./ALoadingSpinner.ca275fb8.js";import{r as i,g as x,y as ee,o as P,Y as M,z as b,a as g,Z as te}from"./index.02f7c95d.js";import"./ACheckbox.923db872.js";import"./AInput.398f059b.js";import"./_plugin-vue_export-helper.cdc0426e.js";import"./ASelect.a02a29e0.js";import"./QItem.1bce08e7.js";import"./QSelect.b17c746f.js";import"./QMenu.3c9cf304.js";import"./position-engine.53490cc8.js";import"./rtl.276c3f1b.js";import"./format.2cae61da.js";/* empty css                                                             */import"./axios.816e1a60.js";import"./header.10137493.js";import"./counsel-hub.145170b4.js";import"./CommonPopup.2b0ee10b.js";import"./use-dialog-plugin-component.234e0905.js";import"./ClosePopup.daa62b28.js";import"./permissionApi.ffe0b82d.js";const ae={class:"column no-wrap fit a-border q-pa-xs",style:{"min-height":"680px"}},oe={class:"col-auto q-mb-xs"},ne={class:"col column no-wrap a-border q-pa-xs"},ie={key:0,class:"full-width text-right bg-grey-5 a-border q-pa-xs col-auto"},re="/rest/api/v1/notification/notifications",qe={__name:"NotificationManage",setup(le){const s=i(!1),y=W(),S=i(null),u=i(!1),N=x(()=>y.hasPermission(F.NOTIFICATION_ROLE.READ)),$=x(()=>y.hasPermission(F.NOTIFICATION_ROLE.DELETE)),h=K(),I=Z(),d=i([]),H=[{formatter:"rowSelection",titleFormatter:"rowSelection",hozAlign:"center",headerHozAlign:"center",headerSort:!1,width:20,resizable:!1},{title:"No.",formatter:"rownum",hozAlign:"center",headerHozAlign:"center",headerSort:!1,width:20},{title:"\uAD6C\uBD84",field:"typeCode",headerHozAlign:"center",hozAlign:"center",formatter:function(e){var a,n;const t=e.getValue()||null;return(n=(a=I.codes.get(t))==null?void 0:a.name)!=null?n:t}},{title:"\uBA54\uC2DC\uC9C0",field:"message",headerHozAlign:"center",hozAlign:"center",formatter:function(e){const t=e.getData();return t.typeCode===v.NOTIFICATION_TYPE.MESSAGE?t.title:t.message}},{title:"\uB4F1\uB85D\uC77C\uC2DC",field:"createdDate",headerHozAlign:"center",hozAlign:"center"},{title:"\uC870\uD68C\uC5EC\uBD80",field:"isRead",headerHozAlign:"center",hozAlign:"center",formatter:function(e){return e.getValue()||null?"\uC77D\uC74C":"\uC548\uC77D\uC74C"}},{title:"\uC791\uC131\uC790",field:"sender.name",headerHozAlign:"center",hozAlign:"center",formatter:function(e){var a,n;const t=e.getData();return((a=t.sender)==null?void 0:a.name)&&((n=t.sender)==null?void 0:n.id)?`${t.sender.name} [${t.sender.id}]`:null}}],c=i([]),_=i(z(V(new Date))),D=i(z(q(new Date))),o=i(),r=i(0),p=i(100),w=i(!1);ee(()=>{E()});function V(e){const t=new Date(e);return t.setMonth(e.getMonth()-1),t}function q(e){const t=new Date(e);return t.setDate(e.getDate()+1),t}function z(e){e.setHours(0,0,0,0);const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${n} 00:00:00`}function C(e){c.value=[],c.value=e}function Y(e){if(!N.value){A("\uC54C\uB9BC \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}u.value?(o.value={"entity.receiver.entityId":h.entityId,...e},T()):(s.value=!0,r.value=0,o.value={page:r.value,size:p.value,"entity.receiver.entityId":h.entityId,...e},f.getNotifications(o.value).then(t=>{t.status===200&&(d.value=t.data.content,w.value=t.data.last,r.value+=1)}).catch(t=>{m(t)}).finally(()=>{s.value=!1}))}function E(){if(!N.value){A("\uC54C\uB9BC \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}u.value?o.value={fromCreatedDate:_.value,toCreatedDate:D.value,"entity.receiver.entityId":h.entityId,typeCodes:I.codes.get(v.CODES.NOTIFICATION_TYPE).children.filter(e=>e.code!==v.NOTIFICATION_TYPE.MESSAGE).map(e=>e.code).join(",")}:(s.value=!0,r.value=0,o.value={page:r.value,size:p.value,fromCreatedDate:_.value,toCreatedDate:D.value,"entity.receiver.entityId":h.entityId,typeCodes:I.codes.get(v.CODES.NOTIFICATION_TYPE).children.filter(e=>e.code!==v.NOTIFICATION_TYPE.MESSAGE).map(e=>e.code).join(",")},f.getNotifications(o.value).then(e=>{e.status===200&&(d.value=e.data.content,w.value=e.data.last,r.value+=1)}).catch(e=>{m(e)}).finally(()=>{s.value=!1}))}async function j(){if(!u.value&&!w.value){o.value={...o.value,page:r.value};try{const e=await f.getNotifications(o.value);e.status===200&&(d.value=[...d.value,...e.data.content],w.value=e.data.last,r.value+=1)}catch(e){m(e)}}}function k(){if(!c.value.length){A("\uC0AD\uC81C\uD560 \uC54C\uB9BC\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}J("\uC54C\uB9BC\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?").then(e=>{if(e){let t="";for(const[a,n]of c.value.entries())t+=n.entityId,a<c.value.length-1&&(t+=",");f.deleteNotifications(t).then(a=>{a.status===200&&(c.value=[],E(),u.value&&T())}).catch(a=>{m(a)})}})}function T(){S.value.setData()}function B(e,t,a){return o.value={...o.value,page:a.page-1,size:a.size||p.value,isPaging:!0},new Promise(function(n,O){f.getNotifications(o.value).then(l=>{if(l.status===200){const R={data:l.data.content,last_page:l.data.totalPages,last_row:l.data.totalElements};n(R)}}).catch(l=>{m(l),O(l)})})}return(e,t)=>(P(),M("div",ae,[b("div",oe,[g(L,{onSearch:Y})]),b("div",ne,[g(Q,{title:"\uC54C\uB9BC \uBAA9\uB85D",class:"col-auto full-width q-mb-xs"}),g(G,{rows:d.value,columns:H,infiniteScroll:j,selectableRows:!0,selectableRowsRangeMode:"click",onRowSelected:C,onRowDeselected:C,"ajax-url":re,"ajax-request-func":B,pagination:u.value,"pagination-size":p.value,class:"col full-width",ref_key:"grid",ref:S},null,8,["rows","pagination","pagination-size"]),$.value?(P(),M("div",ie,[g(U,{label:"\uC0AD\uC81C",onClick:k})])):te("",!0)]),g(X,{modelValue:s.value,"onUpdate:modelValue":t[0]||(t[0]=a=>s.value=a)},null,8,["modelValue"])]))}};export{qe as default};
