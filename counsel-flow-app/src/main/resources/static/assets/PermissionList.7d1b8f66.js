import{r as u,g as R,t as O,y as X,o as A,Y as ee,a as m,$ as te,z as i,B as ae,c as x,Z as z,R as se}from"./index.02f7c95d.js";import le from"./AInput.398f059b.js";import oe from"./ASelect.a02a29e0.js";import I from"./ABtn.e24d7e8a.js";import ie from"./ATitleBar.bbf1d9a4.js";import ne from"./TabulatorGrid.9c80b09d.js";import{p as v}from"./permissionApi.ffe0b82d.js";import{a as ue,u as re}from"./permissionStore.29c18612.js";import B from"./ACheckbox.923db872.js";import{s as f,a as de}from"./dialog.88ce899f.js";import{h as d}from"./errorHandler.5efe1eb1.js";import{F as D}from"./FlowRoleCode.12cdb02e.js";import ce from"./ALoadingSpinner.ca275fb8.js";import{_ as me}from"./_plugin-vue_export-helper.cdc0426e.js";import"./QItem.1bce08e7.js";import"./QSelect.b17c746f.js";import"./QMenu.3c9cf304.js";import"./position-engine.53490cc8.js";import"./rtl.276c3f1b.js";import"./format.2cae61da.js";/* empty css                                                             */import"./ClosePopup.daa62b28.js";import"./axios.816e1a60.js";import"./CommonPopup.2b0ee10b.js";import"./use-dialog-plugin-component.234e0905.js";import"./authStore.fadf8446.js";import"./header.10137493.js";import"./counsel-hub.145170b4.js";const fe={class:"fit column"},ve={class:"my-table full-width a-border col-auto q-mb-xs"},pe={class:"a-border"},he={class:"row"},ge={class:"a-border"},_e={class:"row"},ye={class:"row q-gutter-xs justify-end"},we={class:"row full-width justify-end q-pa-xs q-gutter-xs bg-grey-5 a-border col-auto"},C=100,Pe={__name:"PermissionList",setup(Se){const S=ue(),V=re();let q="\uAD8C\uD55C \uADF8\uB8F9 \uBAA9\uB85D";const h=u(""),g=u(null),_=u(!1),y=u(!1),b=R(()=>V.hasPermission(D.PERMISSION_ROLE.READ)),T=R(()=>V.hasPermission(D.PERMISSION_ROLE.DELETE)),U=R(()=>V.hasPermission(D.PERMISSION_ROLE.SAVE)),L=R(()=>V.hasPermission(D.PERMISSION_ROLE.ADD)),H=[{label:"\uC804\uCCB4",value:null},{label:"\uC0AC\uC6A9",value:!0},{label:"\uC0AC\uC6A9 \uC548\uD568",value:!1}],w=u(""),$=[{formatter:"rowSelection",hozAlign:"center",headerHozAlign:"center",headerSort:!1,width:20},{title:"#",field:"rownum",formatter:"rownum",headerHozAlign:"center",hozAlign:"center",headerSort:!1,resizable:!1,width:50},{title:"\uAD8C\uD55C\uBA85",field:"name",hozAlign:"left",headerHozAlign:"center",headerSort:!0,editor:"input",cellEdited:function(e){const t=e.getRow().getData();t._isModified=!0}},{title:"\uC0AC\uC6A9\uC5EC\uBD80",field:"usable",hozAlign:"center",headerHozAlign:"center",headerSort:!0,editor:"list",editorParams:{values:{true:"\uC0AC\uC6A9",false:"\uC0AC\uC6A9 \uC548\uD568"}},formatter:function(e){const t=e.getValue();return t===!0||t==="true"?"\uC0AC\uC6A9":"\uC0AC\uC6A9 \uC548\uD568"},cellEdited:function(e){const t=e.getRow().getData();t._isModified=!0;let a=e.getValue();if(a==="true"||a==="\uC0AC\uC6A9"?a=!0:(a==="false"||a==="\uC0AC\uC6A9 \uC548\uD568")&&(a=!1),typeof a=="boolean")e.getRow().update({usable:a});else{const o=e.getOldValue();e.setValue(o)}}}];async function j(){const e=w.value.getData(),t=[],a=[];let o=!0;if(e.forEach(s=>{if(!s.name||s.name.trim()===""){f("\uBAA8\uB4E0 \uD589\uC5D0\uC11C \uC774\uB984\uC740 \uD544\uC218 \uC785\uB825 \uC0AC\uD56D\uC785\uB2C8\uB2E4."),o=!1;return}if(s._isModified)if(s.entityId){const l={entityId:s.entityId,name:s.name,usable:s.usable};t.push(l)}else{const l={name:s.name,usable:s.usable};a.push(l)}}),!o)return;const n=[];if(t.length>0){const s=v.putPermission({entities:t}).catch(l=>{l.response&&l.response.data.message?l.response.data.code==="9004"?f("\uC911\uBCF5\uB41C \uC774\uB984\uC744 \uAC00\uC9C4 \uAD8C\uD55C\uC774 \uC874\uC7AC\uD569\uB2C8\uB2E4."):d(l):d(l)});n.push(s)}if(a.length>0){const s=v.postPermission({entities:a}).catch(l=>{l.response&&l.response.data.message?l.response.data.code==="9004"?f("\uC911\uBCF5\uB41C \uC774\uB984\uC744 \uAC00\uC9C4 \uAD8C\uD55C\uC774 \uC874\uC7AC\uD569\uB2C8\uB2E4."):d(l):d(l)});n.push(s)}if(n.length>0)try{await Promise.all(n),f("\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4."),b.value?k():r.value=[]}catch{}else f("\uBCC0\uACBD\uB41C \uB0B4\uC6A9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")}async function F(){const e=w.value.getSelectedData();if(!e||e.length===0){f("\uC120\uD0DD\uB41C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}if(await de("\uC0AD\uC81C \uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?")){const a=w.value.getSelectedData(),o=[],n=[];for(const s of a){if(s.name==="Super Admin"){f("admin \uAD8C\uD55C\uC740 \uC0AD\uC81C \uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");continue}s.entityId?o.push(s.entityId):n.push(s)}o.length>0&&v.deletePermission(o).then(s=>{s.status===200&&(b.value?k():r.value=[])}).catch(s=>{d(s)}),n.forEach(s=>{const l=r.value.findIndex(W=>W===s);l>-1&&r.value.splice(l,1)}),M.value=[]}}function K(){r.value.unshift({usable:!0}),se(()=>{const e=w.value.getRows()[0];if(e){const t=e.getCell("name");t&&t.getElement().focus()}w.value.scrollToRow(e,"top")})}const M=u([]);function Z(e){M.value=e;const t=e[0];t.entityId?(v.getMenusByPermission(t.entityId).then(a=>{if(a.status===200){const o=a.data.map(n=>n.entityId);S.setMenuIds(o)}}).catch(a=>{d(a)}),v.getRolesByPermission(t.entityId).then(a=>{if(a.status===200){const o=a.data.map(n=>n.entityId);S.setRoleIds(o)}}).catch(a=>{d(a)}),S.setEntityId(t.entityId)):S.clearIds()}function G(){S.clearIds()}function N(){if(b.value){const e={};_.value&&h.value.trim()&&(e["entity.name"]=h.value.trim()),y.value&&g.value!==null&&(e.usables=g.value),console.log(e),J(e)}}const r=u([]),c=u(0),E=u(!1),P=u(!1),p=u({page:c.value,size:C});async function Y(){if(!E.value){p.value={...p.value,page:c.value};try{const e=await v.getPermissions(p.value);e.status===200&&(r.value=[...r.value,...e.data.content],E.value=e.data.last,c.value+=1)}catch(e){d(e)}}}function J(e){if(!b.value){f("\uAD8C\uD55C \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}return c.value=0,p.value={page:c.value,size:C,...e},P.value=!0,v.getPermissions(p.value).then(t=>{t&&t.data&&(r.value=t.data.content,E.value=t.data.last,c.value+=1)}).catch(t=>{d(t)}).finally(()=>{P.value=!1})}function k(){if(!b.value){f("\uAD8C\uD55C \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}c.value=0,p.value={page:c.value,size:C},P.value=!0,v.getPermissions(p.value).then(e=>{e.status===200&&(r.value=e.data.content,E.value=e.data.last,c.value+=1)}).catch(e=>{d(e)}).finally(()=>{P.value=!1})}function Q(){h.value="",g.value=null,_.value=!1,y.value=!1}return O(h,e=>{e?_.value=!0:_.value=!1}),O(g,e=>{e!==null?y.value=!0:y.value=!1}),X(()=>{k()}),(e,t)=>(A(),ee("div",fe,[m(ie,{title:te(q),class:"col-auto full-width q-mb-xs"},null,8,["title"]),i("table",ve,[i("tbody",null,[i("tr",null,[i("td",pe,[i("div",he,[m(B,{modelValue:_.value,"onUpdate:modelValue":t[0]||(t[0]=a=>_.value=a),label:"\uAD8C\uD55C\uBA85"},null,8,["modelValue"])])]),i("td",null,[m(le,{class:"custom-input",modelValue:h.value,"onUpdate:modelValue":t[1]||(t[1]=a=>h.value=a),onKeyup:ae(N,["enter"])},null,8,["modelValue"])]),i("td",ge,[i("div",_e,[m(B,{modelValue:y.value,"onUpdate:modelValue":t[2]||(t[2]=a=>y.value=a),label:"\uC0AC\uC6A9\uC5EC\uBD80"},null,8,["modelValue"])])]),i("td",null,[m(oe,{class:"fixed-width",modelValue:g.value,"onUpdate:modelValue":t[3]||(t[3]=a=>g.value=a),options:H},null,8,["modelValue"])]),i("td",null,[i("div",ye,[m(I,{label:"\uC870\uD68C",onClick:N}),m(I,{label:"\uCD08\uAE30\uD654",onClick:Q})])])])])]),m(ne,{rows:r.value,columns:$,onRowSelected:Z,onRowDeselected:G,class:"full-width col",infiniteScroll:Y,selectableRows:1,ref_key:"childRef",ref:w},null,8,["rows"]),i("div",we,[L.value?(A(),x(I,{key:0,label:"\uCD94\uAC00",onClick:K})):z("",!0),T.value?(A(),x(I,{key:1,label:"\uC0AD\uC81C",onClick:F})):z("",!0),L.value||U.value?(A(),x(I,{key:2,label:"\uC800\uC7A5",onClick:j})):z("",!0)]),m(ce,{modelValue:P.value,"onUpdate:modelValue":t[4]||(t[4]=a=>P.value=a)},null,8,["modelValue"])]))}},Qe=me(Pe,[["__scopeId","data-v-d87e34d6"]]);export{Qe as default};
