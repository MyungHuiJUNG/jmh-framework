import{Q as S}from"./QBadge.c1f4e948.js";import{Q as je}from"./QTooltip.86ca1c0e.js";import{r as s,g as x,t as F,y as re,K as de,o as H,c as ce,w as m,a as i,Q as Ke,$ as me,z as t,a1 as Q,a0 as p,E as Le,Y as Fe,ab as Qe,az as Me,F as Ye,R as W}from"./index.02f7c95d.js";import{Q as Be}from"./QItem.1bce08e7.js";import{Q as He}from"./QList.4c243fc6.js";import{Q as We}from"./QMenu.3c9cf304.js";import{u as ze}from"./use-quasar.2d4ce40a.js";import{u as Ge}from"./counselTypeStore.5faa86f9.js";import{u as Je}from"./authStore.fadf8446.js";import{u as Xe}from"./codeStore.e69f9e04.js";import{l as Ze}from"./lodash.33ed51ec.js";import{u as eo}from"./use-dialog-plugin-component.234e0905.js";import{s as h}from"./dialog.88ce899f.js";import{t as oo}from"./ticketApi.d3774daa.js";import lo from"./ABtn.e24d7e8a.js";import $ from"./ASelect.a02a29e0.js";import A from"./AInput.398f059b.js";import to from"./UserPopup.4dc2e487.js";import so from"./ATitleBar.bbf1d9a4.js";import pe from"./ATextarea.94103f28.js";import{h as fe}from"./errorHandler.5efe1eb1.js";import{F as g}from"./FlowSystemCode.7be7ce49.js";import{u as no}from"./commandStore.9ed00edb.js";import{s as ao}from"./scriptApi.ab757ee5.js";import{_ as uo}from"./_plugin-vue_export-helper.cdc0426e.js";import"./position-engine.53490cc8.js";import"./axios.816e1a60.js";import"./header.10137493.js";import"./_commonjsHelpers.c10bf6cb.js";import"./CommonPopup.2b0ee10b.js";/* empty css                                                             */import"./QSelect.b17c746f.js";import"./rtl.276c3f1b.js";import"./format.2cae61da.js";import"./TabulatorGrid.9c80b09d.js";import"./ACheckbox.923db872.js";import"./organizationStore.a86bd6ff.js";import"./userApi.abe7b8c8.js";import"./ALoadingSpinner.ca275fb8.js";import"./ClosePopup.daa62b28.js";import"./counsel-hub.145170b4.js";/* empty css                                                                  */const io={class:"col q-pa-xs b-border column table-container"},ro={class:"col-auto row fixed-height"},co={class:"col top-border-right justify-center column q-px-xs full-height"},mo={class:"col-auto row fixed-height"},po={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},fo={class:"row"},vo={class:"col body-border-right justify-center column q-px-xs full-height"},yo={class:"col-auto row fixed-height"},ho={class:"col body-border-right justify-center column q-px-xs full-height"},go={class:"col-auto row fixed-height"},To={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},xo={class:"row"},Co={class:"col body-border-right justify-center column q-px-xs full-height"},_o={class:"col-auto row"},bo={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},So={class:"row"},Eo={class:"col body-border-right justify-center column q-pa-xs full-height"},Vo={class:"fit"},wo={class:"row col"},qo={class:"col-1 row"},Io={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},Po={class:"row"},Uo={class:"col body-border-right justify-center column q-pa-xs full-height"},ko={class:"col row"},Oo={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},$o={class:"row"},Ao={class:"col body-border-right justify-center column q-pa-xs full-height"},Do={class:"col-auto row fixed-height"},No={class:"col body-border-right justify-center column q-px-xs full-height"},Ro={class:"row no-wrap"},jo={class:"col-auto row fixed-height"},Ko={class:"col body-border-right justify-center column q-px-xs full-height"},Lo={class:"col-auto row fixed-height"},Fo={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},Qo={class:"row"},Mo={class:"col body-border-right justify-center column q-px-xs full-height"},Yo={class:"text-right q-mt-xs col-auto"},Bo={__name:"NewTicketPopup",setup(Ho){var ie;const{dialogRef:ve,onDialogOK:ye}=eo(),he=ze(),r=Ge(),E=Je(),V=Xe(),ge=no();let Te="\uC0C8 \uD2F0\uCF13";const z=g.CODES.COUNSEL_CATEGORY,xe=g.CODES.TICKET_PROCESS_STATUS,Ce=g.TICKET_TYPE.COUNSEL_TICKET,_e=g.TICKET_PROCESS_STATUS.UNPROCESSED,G=s(V.codes.get(Ce)),D=s(V.codes.get(_e)),w=s((ie=V.codes.get(z))==null?void 0:ie.children[0]),c=s(),v=s(),y=s(),q=s(),N=s();s(),s();const M=s(E.entityId),J=s(E.id),X=s(E.name),I=s(),P=s(),Z=s();s();const R=s(),be=s(x(()=>{var o;return(o=V.codes.get(xe))==null?void 0:o.children})),Se=s(x(()=>{var o;return(o=V.codes.get(z))==null?void 0:o.children})),Ee=s(x(()=>E.name)),Ve=s(x(()=>E.id)),U=s(!1),ee=s(x(()=>r.counselTypeArray.map(o=>({name:o.name,value:o})))),oe=s([{name:"\uC120\uD0DD",value:null}]),le=s([{name:"\uC120\uD0DD",value:null}]),j=s(),K=s(),C=s(!1);F(ee,o=>{o.length>0&&!c.value&&(c.value=o[0].value)},{immediate:!0}),F(c,o=>{o&&(oe.value=r.getChildrenCounselTypesByTopParentCodeValue(o.code).map(e=>({name:e.name,value:e})),U.value||(v.value={name:"\uC120\uD0DD",value:null},y.value={name:"\uC120\uD0DD",value:null}))},{immediate:!0}),F(v,o=>{o&&(le.value=r.getChildrenCounselTypesByTopParentCodeValue(o.code).map(e=>({name:e.name,value:e})),U.value||(y.value={name:"\uC120\uD0DD",value:null}))},{immediate:!0});function we(){he.dialog({component:to,componentProps:{enableRowDblClick:!0}}).onOk(o=>{M.value=o.payload[0].entityId,X.value=o.payload[0].name,J.value=o.payload[0].id})}const k=s([]),te=s(x(()=>r.counselTypeArray));re(()=>{U.value=!1,se()}),F(te,o=>{se()});function se(){k.value=[];let o,e,a;te.value.forEach(l=>{var u;o=l.name,k.value.push({name:`${o}`,value:l}),(u=l.children)!=null&&u.length&&l.children.forEach(n=>{var d;e=n.name,k.value.push({name:`${o} > ${e}`,value:n}),(d=n.children)!=null&&d.length&&n.children.forEach(T=>{a=T.name,k.value.push({name:`${o} > ${e} > ${a}`,value:T})})})})}function qe(){var o;if(j.value.trim()){let e=k.value.filter(a=>a.name.includes(j.value));K.value=e}else K.value=[];(o=K.value)!=null&&o.length?C.value=!0:C.value=!1}const ne=Ze.exports.debounce(()=>{qe()},500);function Ie(o){const e=o.path.split(".");if(e.length){const a=r.counselTypes.get(e[0]);c.value=a}W(()=>{e.length>1&&(v.value=r.counselTypes.get(e[1])),W(()=>{e.length>2&&(y.value=r.counselTypes.get(e[2]))})}),C.value=!1}de(()=>{ne.cancel()});function Pe(){var e,a,l,u,n;if(!D.value){h("\uCC98\uB9AC\uC0C1\uD0DC\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}if(((e=w.value)==null?void 0:e.value)===null||!w.value){h("\uC0C1\uB2F4\uAD6C\uBD84\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}if(((a=c.value)==null?void 0:a.value)===null||!c.value){h("\uC0C1\uB2F4\uC720\uD615\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}if(!R.value){h("\uBB38\uC758\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.");return}if(!q.value){h("\uC0C1\uB2F4\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");return}if(I.value&&!P.value){h("\uC7AC\uD1B5\uD654\uC608\uC57D \uC2DC\uAC04\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}if(!M.value){h("\uB2F4\uB2F9\uC790\uB97C \uC9C0\uC815\uD574\uC8FC\uC138\uC694.");return}Ue();let o;o={typeCode:G.value.code,statusCode:D.value.code,counselCategoryCode:w.value.code,counselTypeCodeLarge:((l=c.value)==null?void 0:l.code)||null,counselTypeCodeMedium:((u=v.value)==null?void 0:u.code)||null,counselTypeCodeSmall:((n=y.value)==null?void 0:n.code)||null,contents:q.value||null,isManualCreated:"Y","manager.entityId":M.value,inquiry:R.value},N.value&&(o.callbackReservationDate=N.value),oo.saveTicket(o).then(d=>{d.status===200&&h("\uC800\uC7A5\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4").then(()=>{ye()})}).catch(d=>{fe(d)})}const ae=x({get(){return`${X.value} [${J.value}]`}});function Ue(){I.value&&P.value?N.value=`${I.value} ${P.value}:00`:N.value=null}function ke(o){const e=o.getFullYear(),a=String(o.getMonth()+1).padStart(2,"0"),l=String(o.getDate()).padStart(2,"0");return`${e}-${a}-${l}`}const Oe=s(null),Y=s(!1);function ue(o){var e;if(!!Y.value)for(let[a,l]of ge.commandMap.entries()){const u=a.split("-");let n=null,d=null;if(u[0]===g.SHORT_CUT_KEY_TYPE.SPECIFIC&&(u[1]===g.SHORT_CUT_SPECIFIC.CTRL?n=o.ctrlKey:u[1]===g.SHORT_CUT_SPECIFIC.ALT?n=o.altKey:u[1]===g.SHORT_CUT_SPECIFIC.SHIFT&&(n=o.shiftKey)),u[2]===g.SHORT_CUT_KEY_TYPE.DIGIT&&(d=u[3]),n!==null&&d!==null&&n&&o.code===`Digit${d}`){o.preventDefault();const T=l.find(f=>f.commandType===g.COMMAND_TYPE.COUNSEL_TYPE),L=l.find(f=>f.commandType===g.COMMAND_TYPE.TEXT);if(T!=null&&T.command){U.value=!0;const f=((e=T.command)==null?void 0:e.split("."))||[];f.length===1&&(c.value=r.counselTypes.get(f[0]),v.value={name:"\uC120\uD0DD",value:null},y.value={name:"\uC120\uD0DD",value:null}),f.length===2&&(c.value=r.counselTypes.get(f[0]),v.value=r.counselTypes.get(f[1]),y.value={name:"\uC120\uD0DD",value:null}),f.length===3&&(c.value=r.counselTypes.get(f[0]),v.value=r.counselTypes.get(f[1]),y.value=r.counselTypes.get(f[2]))}L!=null&&L.command&&(q.value=L.command),W(()=>U.value=!1);break}}}function $e(){Y.value=!0}function Ae(){Y.value=!1}re(()=>{window.addEventListener("keydown",ue)}),de(()=>{window.removeEventListener("keydown",ue)});const _=s(null),O=s(),b=s([]),B=s(null);function De(){var e,a,l;if((e=c.value)!=null&&e.entityId&&(_.value=c.value.entityId),(a=v.value)!=null&&a.entityId&&(_.value=v.value.entityId),(l=y.value)!=null&&l.entityId&&(_.value=y.value.entityId),!_.value){h("\uC0C1\uB2F4\uC720\uD615\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}const o={};o["entity.counselType.entityId"]=_.value,ao.getScript(o).then(u=>{var n;if(u.status===200){if(!u.data.length){h("\uB4F1\uB85D\uB41C \uC2A4\uD06C\uB9BD\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");return}O.value=u.data[0],Re((n=O.value.counselType)==null?void 0:n.path),O.value.counselTypeNameWithPath=B.value,Ne(_.value)}}).catch(u=>{fe(u)})}function Ne(o){const e=O.value.entityId,a=100*b.value.length,l=100*b.value.length;b.value.forEach(d=>{d.closed||d.focus()});const u=`script-${o}`;localStorage.setItem(u,JSON.stringify(O.value));const n=window.open(`/view/counselTypeScript?popupKey=${u}`,e,`width=1200,height=600,left=${a},top=${l}`);n?(b.value.push(n),n.addEventListener("unload",()=>{setTimeout(()=>{n.closed&&(b.value=b.value.filter(d=>d!==n))},100)}),n.focus()):h("\uD31D\uC5C5\uC774 \uCC28\uB2E8\uB418\uC5C8\uAC70\uB098 \uC5F4\uB9AC\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.")}function Re(o){var l,u,n;if(!o){B.value=null;return}let e=o.split("."),a="";e.length>0&&(a=(l=r.counselTypes.get(e[0]))==null?void 0:l.name),e.length>1&&(a+=` > ${(u=r.counselTypes.get(e[1]))==null?void 0:u.name}`),e.length>2&&(a+=` > ${(n=r.counselTypes.get(e[2]))==null?void 0:n.name}`),B.value=a}return(o,e)=>(H(),ce(Ye,{ref_key:"dialogRef",ref:ve,"no-backdrop-dismiss":"","transition-show":"fade","transition-hide":"fade"},{default:m(()=>[i(Ke,{class:"column fit dialog-body",ref_key:"container",ref:Oe,tabindex:"0",onFocusin:$e,onFocusout:Ae},{default:m(()=>{var a;return[i(so,{title:me(Te),close:!0,onClose:e[0]||(e[0]=l=>o.$emit("close")),class:"col-auto"},null,8,["title"]),t("div",io,[t("div",ro,[e[15]||(e[15]=t("div",{class:"col-auto t-column text-left top-border-left justify-center column q-px-xs full-height"}," \uD2F0\uCF13\uC720\uD615 ",-1)),t("div",co,Q((a=G.value)==null?void 0:a.name),1)]),t("div",mo,[t("div",po,[t("div",fo,[i(S,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:m(()=>e[16]||(e[16]=[p("*")])),_:1}),e[17]||(e[17]=p("\uCC98\uB9AC\uC0C1\uD0DC "))])]),t("div",vo,[i($,{options:be.value,"option-label":"name",modelValue:D.value,"onUpdate:modelValue":e[1]||(e[1]=l=>D.value=l)},null,8,["options","modelValue"])])]),t("div",yo,[e[18]||(e[18]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"}," \uC81C\uD488\uBD84\uB958 ",-1)),t("div",ho,[i(A,{modelValue:Z.value,"onUpdate:modelValue":e[2]||(e[2]=l=>Z.value=l)},null,8,["modelValue"])])]),t("div",go,[t("div",To,[t("div",xo,[i(S,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:m(()=>e[19]||(e[19]=[p("*")])),_:1}),e[20]||(e[20]=p("\uC0C1\uB2F4\uAD6C\uBD84 "))])]),t("div",Co,[i($,{options:Se.value,"option-label":"name",modelValue:w.value,"onUpdate:modelValue":e[3]||(e[3]=l=>w.value=l)},null,8,["options","modelValue"])])]),t("div",_o,[t("div",bo,[t("div",So,[i(S,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:m(()=>e[21]||(e[21]=[p("*")])),_:1}),e[22]||(e[22]=p("\uC0C1\uB2F4\uC720\uD615 "))]),i(Le,{icon:"help",round:"",unelevated:"",style:{width:"24px",height:"24px",padding:"0px"},dense:"",size:"12px",onClick:De},{default:m(()=>[i(je,{anchor:"center right",self:"center start"},{default:m(()=>e[23]||(e[23]=[p("\uC2A4\uD06C\uB9BD\uD2B8")])),_:1})]),_:1})]),t("div",Eo,[t("div",Vo,[i(A,{class:"col q-mb-xs",modelValue:j.value,"onUpdate:modelValue":[e[6]||(e[6]=l=>j.value=l),me(ne)],placeholder:"\uC0C1\uB2F4\uC720\uD615\uC744 \uAC80\uC0C9\uD574\uC8FC\uC138\uC694."},{default:m(()=>[i(We,{modelValue:C.value,"onUpdate:modelValue":e[4]||(e[4]=l=>C.value=l),"auto-close":"","transition-show":"scale","transition-hide":"scale",fit:"","no-focus":"","no-parent-event":"",onHide:e[5]||(e[5]=l=>C.value=!1)},{default:m(()=>[i(He,null,{default:m(()=>[(H(!0),Fe(Qe,null,Me(K.value,(l,u)=>(H(),ce(Be,{key:u,clickable:"",onClick:n=>Ie(l.value)},{default:m(()=>[p(Q(l.name),1)]),_:2},1032,["onClick"]))),128))]),_:1})]),_:1},8,["modelValue"])]),_:1},8,["modelValue","onUpdate:modelValue"]),t("div",wo,[i($,{options:ee.value,modelValue:c.value,"onUpdate:modelValue":e[7]||(e[7]=l=>c.value=l),class:"col","option-label":"name"},null,8,["options","modelValue"]),i($,{options:oe.value,modelValue:v.value,"onUpdate:modelValue":e[8]||(e[8]=l=>v.value=l),class:"col","option-label":"name"},null,8,["options","modelValue"]),i($,{options:le.value,modelValue:y.value,"onUpdate:modelValue":e[9]||(e[9]=l=>y.value=l),class:"col","option-label":"name"},null,8,["options","modelValue"])])])])]),t("div",qo,[t("div",Io,[t("div",Po,[i(S,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:m(()=>e[24]||(e[24]=[p("*")])),_:1}),e[25]||(e[25]=p("\uBB38\uC758"))])]),t("div",Uo,[i(pe,{height:"100%",class:"col",modelValue:R.value,"onUpdate:modelValue":e[10]||(e[10]=l=>R.value=l)},null,8,["modelValue"])])]),t("div",ko,[t("div",Oo,[t("div",$o,[i(S,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:m(()=>e[26]||(e[26]=[p("*")])),_:1}),e[27]||(e[27]=p("\uC0C1\uB2F4\uB0B4\uC6A9 "))])]),t("div",Ao,[i(pe,{height:"100%",class:"col",modelValue:q.value,"onUpdate:modelValue":e[11]||(e[11]=l=>q.value=l)},null,8,["modelValue"])])]),t("div",Do,[e[28]||(e[28]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"}," \uC7AC\uD1B5\uD654\uC608\uC57D ",-1)),t("div",No,[t("div",Ro,[i(A,{type:"date",class:"col",modelValue:I.value,"onUpdate:modelValue":e[12]||(e[12]=l=>I.value=l),min:ke(new Date)},null,8,["modelValue","min"]),i(A,{type:"time",class:"col",modelValue:P.value,"onUpdate:modelValue":e[13]||(e[13]=l=>P.value=l)},null,8,["modelValue"])])])]),t("div",jo,[e[29]||(e[29]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"}," \uBCF4\uACE0\uC790 ",-1)),t("div",Ko,Q(Ee.value)+" ["+Q(Ve.value)+"] ",1)]),t("div",Lo,[t("div",Fo,[t("div",Qo,[i(S,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:m(()=>e[30]||(e[30]=[p("*")])),_:1}),e[31]||(e[31]=p("\uB2F4\uB2F9\uC790"))])]),t("div",Mo,[i(A,{modelValue:ae.value,"onUpdate:modelValue":e[14]||(e[14]=l=>ae.value=l),onClick:we,readonly:!0},null,8,["modelValue"])])]),t("div",Yo,[i(lo,{label:"\uC800\uC7A5",onClick:Pe})])])]}),_:1},512)]),_:1},512))}},Dl=uo(Bo,[["__scopeId","data-v-1e697770"]]);export{Dl as default};