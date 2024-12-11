import{g as ge,r as u,t as ne,y as Ie,o as Se,Y as Te,z as a,a as s,B as ae}from"./index.02f7c95d.js";import ue from"./AInput.398f059b.js";import oe from"./ABtn.e24d7e8a.js";import re from"./ACheckbox.923db872.js";import J from"./TreeDepth.d1ea8d25.js";import be from"./TreeDataList.26c5b605.js";import{u as Ce,c as A}from"./counselTypeStore.5faa86f9.js";import{u as Ve}from"./permissionStore.29c18612.js";import{s as p,a as xe}from"./dialog.88ce899f.js";import{h as v}from"./errorHandler.5efe1eb1.js";import{F as Ne}from"./FlowRoleCode.12cdb02e.js";import{_ as ke}from"./_plugin-vue_export-helper.cdc0426e.js";/* empty css                                                             */import"./TabulatorGrid.9c80b09d.js";import"./ATitleBar.bbf1d9a4.js";import"./ClosePopup.daa62b28.js";import"./QTree.ce7bbb93.js";import"./QSlideTransition.b1b1fe3f.js";import"./QTooltip.86ca1c0e.js";import"./position-engine.53490cc8.js";import"./axios.816e1a60.js";import"./header.10137493.js";import"./permissionApi.ffe0b82d.js";import"./CommonPopup.2b0ee10b.js";import"./use-dialog-plugin-component.234e0905.js";import"./authStore.fadf8446.js";import"./counsel-hub.145170b4.js";const Ee={class:"a-border q-pa-xs fit column",style:{"min-height":"680px"}},qe={class:"col-auto"},Ge={class:"full-width a-table"},Ae={class:"row"},Ue={class:"row"},Fe={class:"row"},Be={class:"row justify-between"},Oe={class:"col-auto"},Me={class:"row col q-mt-xs"},Pe={class:"a-border full-height col-2 q-pa-xs"},je={class:"a-border full-height col q-ml-xs q-pa-xs"},Ke={class:"a-border full-height col q-ml-xs q-pa-xs"},Le={class:"a-border full-height col q-ml-xs q-pa-xs"},We={__name:"CounselTypeManage",setup(Je){const x=Ce(),se=Ve(),r=ge(()=>se.hasPermission(Ne.COUNSEL_TYPE_ROLE.READ)),T=u(!1),b=u(!1),m=u(null),y=u(null),_=u([]),N=u([]),c=u([]),C=u([]),D=u([]),Y=u(null),d=u({entityId:null,code:null}),g=u({entityId:null,code:null}),$=u({entityId:null,code:null}),ce=u(null),k=u(null),z=u(null),H=u(null),E=u(null),h=u(null),I=u(null);ne(()=>m.value,l=>{l?T.value=!0:T.value=!1}),ne(()=>y.value,l=>{l?b.value=!0:b.value=!1}),Ie(()=>{V()});const U=u();function F(){const l={};T.value&&m.value&&(l.name=m.value),b.value&&y.value&&(l.code=y.value),U.value=l}function de(){m.value=null,y.value=null,U.value=null}function B(){c.value=[],C.value=[],D.value=[]}function ie(l){if(!l){V();return}Y.value=l;const e=Y.value.split(".");e.length?E.value=e[0]:E.value=null,e.length>1?h.value=e[1]:h.value=null,e.length>2?I.value=e[2]:I.value=null,e.length&&k.value.selectRow(E.value)}function O(){E.value=null,h.value=null,I.value=null}function Q(l){return l.map(e=>(e.children&&!e.children.length&&delete e.children,e.children&&(e.children=Q(e.children)),e))}function f(l){return l.map(e=>{var i;const t={...e,id:e.code};return(i=t.children)!=null&&i.length&&(t.children=f(t.children)),t})}function M(l){const t=[{entityId:"",name:"\uC804\uCCB4",code:"",path:null,orderNumber:0,children:JSON.parse(JSON.stringify(l))}];return Q(t),f(t)}function S(l){return l.map(e=>{var t;return(t=e.children)!=null&&t.length&&(e.children=S(e.children)),e}).sort((e,t)=>e.orderNumber-t.orderNumber)}function V(){r.value?A.getCounselType().then(l=>{const e=S(l.data);N.value=M(e),_.value=f(e),B(),c.value=_.value}).catch(l=>{v(l)}):p("\uC0C1\uB2F4\uC720\uD615 \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")}function X(l){return A.getCounselType(l).then(e=>e.data).catch(e=>{v(e)})}function P(){A.getCounselType().then(l=>{if(l.status===200){const e=S(l.data);N.value=M(e),_.value=f(e),B(),c.value=_.value,d.value.code&&k.value.selectRow(d.value.code)}}).catch(l=>{v(l)})}function j(){A.getCounselType().then(l=>{if(l.status===200){const e=S(l.data);N.value=M(e),_.value=f(e),B(),c.value=_.value,d.value.code&&k.value.selectRow(d.value.code),h.value=g.value.code}}).catch(l=>{v(l)})}async function K({depth:l,entityId:e}){if(!e){p("\uC0AD\uC81C\uD560 \uD56D\uBAA9\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694");return}await xe("\uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?")&&x.remove(e).then(i=>{i.status===200&&(r.value&&l===1?V():r.value&&l===2?P():r.value&&l===3?j():c.value=[])}).catch(i=>{v(i)})}function ve(l){K({depth:1,entityId:l})}function pe(l){K({depth:2,entityId:l})}function he(l){K({depth:3,entityId:l})}function fe(l){C.value=[],D.value=[],l.entityId&&X(l.entityId).then(e=>{C.value=S(f(e.children)),h.value&&z.value.selectRow(h.value),h.value=null}).catch(e=>{v(e)})}function me(l){D.value=[],l.entityId&&X(l.entityId).then(e=>{D.value=S(f(e.children)),I.value&&H.value.selectRow(I.value),I.value=null}).catch(e=>{v(e)})}function ye({newRows:l,modifiedRows:e}){L({depth:1,newRows:l,modifiedRows:e})}function _e({newRows:l,modifiedRows:e}){L({depth:2,newRows:l,modifiedRows:e})}function De({newRows:l,modifiedRows:e}){L({depth:3,newRows:l,modifiedRows:e})}function L({depth:l,newRows:e,modifiedRows:t}){var w,ee;if(!(e!=null&&e.length)&&!(t!=null&&t.length))return;const i=n=>n.some(o=>!o.code||o.code.toString().trim()===""||!o.name||o.name.toString().trim()==="");if((e==null?void 0:e.length)&&i(e)||(t==null?void 0:t.length)&&i(t)){p("\uBE48 \uD56D\uBAA9\uC774 \uC788\uC2B5\uB2C8\uB2E4.");return}const Z=n=>n.some(o=>o.code.includes("."));if((e==null?void 0:e.length)&&Z(e)||(t==null?void 0:t.length)&&Z(t)){p("\uCF54\uB4DC\uBA85\uC5D0 .\uC744 \uD3EC\uD568\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");return}let W=null,q=null;if(l===2){if(!((w=d.value)!=null&&w.entityId)){p("\uC0C1\uC704\uC720\uD615\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}W=d.value.entityId,q=C.value}else if(l===3){if(!((ee=g.value)!=null&&ee.entityId)){p("\uC0C1\uC704\uC720\uD615\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}W=g.value.entityId,q=D.value}else q=c.value;const R=e.map((n,o)=>{var te;const le={code:n.code,name:n.name,orderNumber:(te=n.orderNumber)!=null?te:q.length+1+o};return l>1&&(le.parent={entityId:W}),le}),G=t.map(n=>{const o={entityId:n.entityId,code:n.code,name:n.name,orderNumber:n.orderNumber};return l>1&&(o.parent={entityId:n.parentEntityId}),o});R.length?x.save(R).then(n=>n.status===200&&G.length?x.update(G):null).then(n=>{(n===null||n&&n.status===200)&&(r.value&&l===1?V():r.value&&l===2?P():r.value&&l===3?j():c.value=[],p("\uC800\uC7A5\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4"))}).catch(n=>{v(n)}):G.length&&x.update(G).then(n=>{n.status===200&&(r.value&&l===1?V():r.value&&l===2?P():r.value&&l===3?j():c.value=[],p("\uC800\uC7A5\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4"))}).catch(n=>{v(n)})}return(l,e)=>(Se(),Te("div",Ee,[a("div",qe,[a("table",Ge,[e[7]||(e[7]=a("colgroup",null,[a("col",{class:"t-column",width:"120px"}),a("col"),a("col",{class:"t-column",width:"100px"}),a("col")],-1)),a("tbody",null,[a("tr",null,[a("td",null,[a("div",Ae,[s(re,{modelValue:T.value,"onUpdate:modelValue":e[0]||(e[0]=t=>T.value=t),label:"\uC0C1\uB2F4\uC720\uD615\uBA85"},null,8,["modelValue"])])]),a("td",null,[a("div",Ue,[s(ue,{modelValue:m.value,"onUpdate:modelValue":e[1]||(e[1]=t=>m.value=t),onKeyup:ae(F,["enter"])},null,8,["modelValue"])])]),a("td",null,[a("div",Fe,[s(re,{modelValue:b.value,"onUpdate:modelValue":e[2]||(e[2]=t=>b.value=t),label:"\uCF54\uB4DC"},null,8,["modelValue"])])]),a("td",null,[a("div",Be,[a("div",null,[s(ue,{modelValue:y.value,"onUpdate:modelValue":e[3]||(e[3]=t=>y.value=t),onKeyup:ae(F,["enter"])},null,8,["modelValue"])]),a("div",Oe,[s(oe,{label:"\uC870\uD68C",onClick:F}),s(oe,{label:"\uCD08\uAE30\uD654",class:"q-ml-xs",onClick:de})])])])])])])]),a("div",Me,[a("div",Pe,[s(be,{data:N.value,onRowClick:ie,ref_key:"treeGrid",ref:ce,filter:U.value},null,8,["data","filter"])]),a("div",je,[s(J,{ref_key:"firstDepthGrid",ref:k,data:c.value,title:"\uC0C1\uB2F4\uC720\uD615(1depth)","type-name":"\uC0C1\uB2F4\uC720\uD615\uBA85","is-top":!0,onDeleteRow:ve,onSaveRows:ye,onRowSelected:fe,onRowClick:O,modelValue:d.value,"onUpdate:modelValue":e[4]||(e[4]=t=>d.value=t),viewType:"counselType"},null,8,["data","modelValue"])]),a("div",Ke,[s(J,{ref_key:"secondDepthGrid",ref:z,data:C.value,title:"\uC0C1\uB2F4\uC720\uD615(2depth)","type-name":"\uC0C1\uB2F4\uC720\uD615\uBA85","parent-entity":d.value,onRowSelected:me,onDeleteRow:pe,onSaveRows:_e,onRowClick:O,modelValue:g.value,"onUpdate:modelValue":e[5]||(e[5]=t=>g.value=t),viewType:"counselType"},null,8,["data","parent-entity","modelValue"])]),a("div",Le,[s(J,{ref_key:"thirdDepthGrid",ref:H,data:D.value,title:"\uC0C1\uB2F4\uC720\uD615(3depth)","type-name":"\uC0C1\uB2F4\uC720\uD615\uBA85","parent-entity":g.value,onDeleteRow:he,onSaveRows:De,onRowClick:O,modelValue:$.value,"onUpdate:modelValue":e[6]||(e[6]=t=>$.value=t),viewType:"counselType"},null,8,["data","parent-entity","modelValue"])])])]))}},_l=ke(We,[["__scopeId","data-v-c7d10bec"]]);export{_l as default};
