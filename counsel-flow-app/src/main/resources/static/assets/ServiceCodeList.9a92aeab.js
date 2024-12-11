import{u as me}from"./use-quasar.2d4ce40a.js";import{u as ge}from"./permissionStore.29c18612.js";import{u as ve,c as U}from"./codeStore.e69f9e04.js";import B from"./ABtn.e24d7e8a.js";import ye from"./TabulatorGrid.9c80b09d.js";import we from"./CodePopup.bae9c2a7.js";import{s as h,a as Ce}from"./dialog.88ce899f.js";import{h as R}from"./errorHandler.5efe1eb1.js";import{F as Ee}from"./FlowSystemCode.7be7ce49.js";import Ne from"./ATitleBar.bbf1d9a4.js";import{F as _}from"./FlowRoleCode.12cdb02e.js";import{_ as Ie}from"./_plugin-vue_export-helper.cdc0426e.js";import{r as E,g as b,t as Re,y as _e,R as S,o as D,Y as be,a as W,z as Se,c as L,Z as F}from"./index.02f7c95d.js";import"./permissionApi.ffe0b82d.js";import"./axios.816e1a60.js";/* empty css                                                             */import"./AInput.398f059b.js";import"./ACheckbox.923db872.js";import"./use-dialog-plugin-component.234e0905.js";import"./CommonPopup.2b0ee10b.js";import"./authStore.fadf8446.js";import"./header.10137493.js";import"./counsel-hub.145170b4.js";import"./ClosePopup.daa62b28.js";const De={class:"a-border full-height fit column q-pa-xs"},Oe={class:"row full-width justify-end q-pa-xs q-gutter-xs bg-grey-5 a-border"},Pe={__name:"ServiceCodeList",props:{filteredRows:Array},setup(X){const J=Ee.CODE_TYPE.SERVICE,ee=X,q=ve(),te=me(),N=ge(),O=E(null),c=E(""),y=E([]);let ne=-1;const I=b(()=>N.hasPermission(_.CODE_ROLE.READ_SERVICE_CODE)),re=b(()=>N.hasPermission(_.CODE_ROLE.DELETE)),oe=b(()=>N.hasPermission(_.CODE_ROLE.SAVE)),H=b(()=>N.hasPermission(_.CODE_ROLE.ADD));let w=!1;const ie=[{title:"\uCF54\uB4DC\uBA85",field:"name",hozAlign:"left",headerHozAlign:"center",headerSort:!1,editor:"input",cellEdited:function(t){const e=t.getRow().getData();e.isChanged=!0,t.getRow().reformat()}},{title:"\uCF54\uB4DC",field:"code",hozAlign:"center",headerHozAlign:"center",headerSort:!1,editor:"input",cellEdited:function(t){const e=t.getRow().getData();e.isChanged=!0,t.getRow().reformat()}},{title:"\uC0C1\uC704\uCF54\uB4DC",field:"path",hozAlign:"center",headerHozAlign:"center",headerSort:!1,formatter:function(t){const e=t.getRow().getData();let n="";if(!e.parentEntityId)n="";else if(e.isNewPath)n=e.path||"";else if(e.path){const p=e.path.split(".");p.length>1?n=p.slice(0,-1).join("."):n=e.path}const r=document.createElement("span");r.innerText=n;const u=document.createElement("button");u.innerText="\uC120\uD0DD",u.onclick=async function(){if(!w){w=!0;try{const p=await ae(e.entityId);p&&(e.isNewPath=!0,e.path=p,r.innerText=p,await t.getRow().update(e))}finally{w=!1}}};const i=document.createElement("span");i.innerText=" ";const d=document.createElement("div");return d.appendChild(r),d.appendChild(i),d.appendChild(u),d}},{title:"\uC0AC\uC6A9\uC5EC\uBD80",field:"usable",hozAlign:"center",headerHozAlign:"center",headerSort:!1,editor:"list",editorParams:{values:{true:"\uC0AC\uC6A9",false:"\uC0AC\uC6A9 \uC548\uD568"}},formatter:function(t){const e=t.getValue();return e===!0||e==="true"?"\uC0AC\uC6A9":"\uC0AC\uC6A9 \uC548\uD568"},cellClick:function(t,e){e.getRow().select()},cellEdited:function(t){let e=t.getValue();if(e==="true"||e==="\uC0AC\uC6A9"?e=!0:(e==="false"||e==="\uC0AC\uC6A9 \uC548\uD568")&&(e=!1),typeof e=="boolean")t.getRow().update({usable:e});else{const r=t.getOldValue();t.setValue(r)}const n=t.getRow().getData();n.isChanged=!0,t.getRow().reformat()}},{title:"\uBE44\uACE0",field:"remarkText",hozAlign:"center",headerHozAlign:"center",headerSort:!1,editor:"input",cellEdited:function(t){const e=t.getRow().getData();e.isChanged=!0,t.getRow().reformat()}}],a=E([]);function j(t,e=0){if(!t.parentEntityId)return e;const n=C(a.value,t.parentEntityId);return n?j(n,e+1):e}function $(t){t.forEach(e=>{e.isChanged=!1,e.children&&$(e.children)})}function P(){if(I.value){const t={"entity.codeType":J};U.getCodes(t).then(e=>{if(e.status===200){const n=u=>u.map(i=>(i.children&&i.children.length>0?i.children=n(i.children):delete i.children,i)).sort((i,d)=>(i.orderNumber||0)-(d.orderNumber||0)),r=n(e.data);$(r),a.value=r,y.value=JSON.parse(JSON.stringify(r)),c.value&&(c.value.replaceData(r),c.value.redraw(!0))}}).catch(e=>{R(e)})}else h("\uC11C\uBE44\uC2A4\uCF54\uB4DC \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")}function ae(t){return O.value=t,new Promise(e=>{te.dialog({component:we,componentProps:{codeList:a.value}}).onOk(n=>{const{parentEntityId:r,path:u}=n.payload,i=C(a.value,O.value);if(i){if(i.entityId===r){h("\uC790\uAE30 \uC790\uC2E0\uC744 \uC0C1\uC704 \uCF54\uB4DC\uB85C \uC120\uD0DD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."),e(null);return}if(G(i.children||[],r)){h("\uC790\uC2E0\uC758 \uD558\uC704 \uCF54\uB4DC\uB97C \uC0C1\uC704 \uCF54\uB4DC\uB85C \uC120\uD0DD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."),e(null);return}const d=r?j(C(a.value,r)):0,p=Y(i);if(d+p>=3){h("3depth\uB97C \uCD08\uACFC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."),e(null);return}i.parentEntityId!==r&&(se(i.entityId),le(r,i),i.parentEntityId=r,i.path=u,i.isChanged=!0,a.value=[...a.value],S(()=>{x()})),e(u)}}).onCancel(()=>{w=!1,e(null)}).onDismiss(()=>{w=!1,O.value=null})})}function Y(t){if(!t.children||t.children.length===0)return 1;let e=0;return t.children.forEach(n=>{const r=Y(n);r>e&&(e=r)}),e+1}function G(t,e){for(const n of t)if(n.entityId===e||n.children&&n.children.length>0&&G(n.children,e))return!0;return!1}function le(t,e){if(!t)a.value.push(e);else{const n=C(a.value,t);n&&(n.children||(n.children=[]),n.children.push(e))}}function se(t){const e=Q(a.value,t);e?(e.children=e.children.filter(n=>n.entityId!==t),e.children.length===0&&delete e.children):a.value=a.value.filter(n=>n.entityId!==t)}function Q(t,e){for(const n of t){if(n.children&&n.children.some(r=>r.entityId===e))return n;if(n.children){const r=Q(n.children,e);if(r)return r}}return null}function C(t,e){for(const n of t){if(n.entityId===e)return n;if(n.children){const r=C(n.children,e);if(r)return r}}return null}function x(){c.value&&S(()=>{const t=JSON.parse(JSON.stringify(a.value));c.value.clearData(),c.value.replaceData(t),c.value.redraw(!0)})}function ce(){const t={entityId:ne--,name:"",code:"",path:"",usable:!0,remarkText:"",isNewPath:!0,isChanged:!0};a.value.unshift(t),c.value&&S(()=>{c.value.replaceData(a.value),c.value.redraw(!0)})}function T(t){t.forEach(e=>{e.isChanged=!1,e.children&&T(e.children)})}function ue(){const t=JSON.parse(JSON.stringify(c.value.getData())),e=[],n=[];let r=!1;const u={};function i(l,f){l.forEach(s=>{s.entityId&&(u[s.entityId]=f||null),s.children&&s.children.length>0&&i(s.children,s.entityId)})}i(y.value,null);const d={};if(!A(t,null))return;pe(),e.length>0&&q.update({entities:e}).then(l=>{l.status===200&&(r||(h("\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4."),r=!0),I.value?P():a.value=[],T(a.value),x())}).catch(l=>{R(l)}),n.length>0&&q.save({entities:n}).then(l=>{l.status===200&&(r||(h("\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4."),r=!0),I.value?P():a.value=[],T(a.value),x())}).catch(l=>{R(l)});function A(l,f){let s=1;for(const o of l){if(!o.code||!o.name)return h("\uCF54\uB4DC\uC640 \uC774\uB984\uC744 \uC785\uB825\uD558\uC9C0 \uC54A\uC740 \uD56D\uBAA9\uC774 \uC874\uC7AC\uD569\uB2C8\uB2E4."),!1;if(o.code.includes("."))return h("\uCF54\uB4DC\uBA85\uC5D0 .\uC744 \uD3EC\uD568\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."),!1;if(o.remarkText.length>1024){h("\uBE44\uACE0\uC758 \uAE38\uC774\uB294 1024\uC790\uB97C \uCD08\uACFC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");return}const g=o.entityId>0?u[o.entityId]:null;let z=!1;o.entityId>0&&g!==f&&(z=!0,d[g]||(d[g]=[]),d[g].push(o)),o.orderNumber=s++;const m={code:o.code,codeType:J,name:o.name,orderNumber:o.orderNumber,usable:o.usable,remarkText:o.remarkText};if(f&&(m.parent={entityId:f}),o.entityId>0){m.entityId=o.entityId;const v=V(o.entityId);(v.name!==o.name||v.code!==o.code||v.orderNumber!==o.orderNumber||v.usable!==o.usable||v.remarkText!==o.remarkText||g!==f||z)&&e.push(m)}else n.push(m);if(o.children&&o.children.length>0&&!A(o.children,o.entityId))return!1}return!0}function pe(){Object.keys(d).forEach(l=>{const f=K(l,t);let s=1;f.forEach(o=>{if(!d[l].some(m=>m.entityId===o.entityId)){o.orderNumber=s++;const m=V(o.entityId);if(m&&m.orderNumber!==o.orderNumber){const M={entityId:o.entityId,orderNumber:o.orderNumber};l&&(M.parent={entityId:l}),e.push(M)}}})})}function K(l,f){let s=[];return f.forEach(o=>{(o.parentEntityId||null)===l&&s.push(o),o.children&&o.children.length>0&&(s=s.concat(K(l,o.children)))}),s}function V(l,f=y.value){for(const s of f){if(s.entityId===l)return s;if(s.children){const o=V(l,s.children);if(o)return o}}return null}}const Z=E([]);function de(t){Z.value=t}async function fe(){const t=c.value.getSelectedData();if(!t||t.length===0){h("\uC120\uD0DD\uB41C \uCF54\uB4DC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");return}await Ce("\uC0AD\uC81C \uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?")&&(t.forEach(n=>{const r=he(n.entityId);r&&r.delete(),k(a.value,n.entityId),k(y.value,n.entityId),n.entityId>0&&U.deleteCode(n.entityId).then(u=>{u.status}).catch(u=>{a.value.push(n),y.value.push(JSON.parse(JSON.stringify(n))),c.value&&c.value.addRow(n),R(u)})}),Z.value=[])}function he(t){const e=c.value.getRows();for(const n of e)if(n.getData().entityId===t)return n;return null}function k(t,e){for(let n=0;n<t.length;n++){const r=t[n];if(r.entityId===e)return t.splice(n,1),!0;if(r.children&&k(r.children,e))return r.children.length===0&&delete r.children,!0}return!1}return I.value&&Re(()=>ee.filteredRows,t=>{c.value.replaceData(t)}),_e(()=>{S(()=>{setTimeout(()=>{P()},100)})}),(t,e)=>(D(),be("div",De,[W(Ne,{title:"\uC11C\uBE44\uC2A4 \uCF54\uB4DC \uBAA9\uB85D",class:"col-auto full-width q-mb-xs"}),W(ye,{ref_key:"childRef",ref:c,rows:a.value,columns:ie,onRowSelected:de,reactiveData:!1,class:"col full-width",dataTree:!0,dataTreeStartExpanded:!0,selectableRows:1},null,8,["rows"]),Se("div",Oe,[H.value?(D(),L(B,{key:0,label:"\uCD94\uAC00",onClick:ce})):F("",!0),re.value?(D(),L(B,{key:1,label:"\uC0AD\uC81C",onClick:fe})):F("",!0),H.value||oe.value?(D(),L(B,{key:2,label:"\uC800\uC7A5",onClick:ue})):F("",!0)])]))}},tt=Ie(Pe,[["__scopeId","data-v-6fe56175"]]);export{tt as default};
