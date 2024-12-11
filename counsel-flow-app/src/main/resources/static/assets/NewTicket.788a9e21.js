import{Q as O}from"./QBadge.c1f4e948.js";import{Q as He}from"./QTooltip.86ca1c0e.js";import{r as a,g as C,t as D,R as X,y as pe,K as ye,o as P,Y as F,a as r,z as t,a1 as h,w as g,a0 as f,E as We,ab as ze,az as Ge,c as Je,$ as Xe,Z as Ze}from"./index.02f7c95d.js";import{Q as el}from"./QItem.1bce08e7.js";import{Q as ll}from"./QList.4c243fc6.js";import{Q as tl}from"./QMenu.3c9cf304.js";import{u as ol}from"./use-quasar.2d4ce40a.js";import{u as ul}from"./counselTypeStore.5faa86f9.js";import{u as al}from"./authStore.fadf8446.js";import{l as sl}from"./lodash.33ed51ec.js";import nl from"./ABtn.e24d7e8a.js";import M from"./ASelect.a02a29e0.js";import K from"./AInput.398f059b.js";import il from"./UserPopup.4dc2e487.js";import rl from"./ATitleBar.bbf1d9a4.js";import he from"./ATextarea.94103f28.js";import{u as dl}from"./codeStore.e69f9e04.js";import{t as ge}from"./ticketApi.d3774daa.js";import{s as x}from"./dialog.88ce899f.js";import{h as te}from"./errorHandler.5efe1eb1.js";import{F as T}from"./FlowSystemCode.7be7ce49.js";import{u as cl}from"./commandStore.9ed00edb.js";import vl from"./ALoadingSpinner.ca275fb8.js";import{s as ml}from"./scriptApi.ab757ee5.js";import{_ as fl}from"./_plugin-vue_export-helper.cdc0426e.js";import"./position-engine.53490cc8.js";import"./axios.816e1a60.js";import"./header.10137493.js";import"./_commonjsHelpers.c10bf6cb.js";/* empty css                                                             */import"./QSelect.b17c746f.js";import"./rtl.276c3f1b.js";import"./format.2cae61da.js";import"./TabulatorGrid.9c80b09d.js";import"./ACheckbox.923db872.js";import"./use-dialog-plugin-component.234e0905.js";import"./organizationStore.a86bd6ff.js";import"./userApi.abe7b8c8.js";import"./ClosePopup.daa62b28.js";import"./CommonPopup.2b0ee10b.js";import"./counsel-hub.145170b4.js";/* empty css                                                                  */const pl={class:"col q-pa-xs b-border column table-container full-width"},yl={class:"col-auto row fixed-height full-width"},hl={class:"col top-border-right justify-center column q-px-xs full-height"},gl={class:"col-auto row fixed-height full-width"},xl={class:"col body-border-right justify-center column q-px-xs full-height"},Tl={class:"col-auto row fixed-height full-width"},bl={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},Cl={class:"row"},_l={class:"col body-border-right justify-center column q-px-xs full-height"},wl={class:"col-auto row fixed-height full-width"},ql={class:"col body-border-right justify-center column q-px-xs full-height"},Sl={class:"col-auto row fixed-height full-width"},Vl={class:"col body-border-right justify-center column q-px-xs full-height"},Il={class:"col-auto row fixed-height full-width"},Ul={class:"col body-border-right justify-center column q-px-xs full-height"},El={class:"col-auto row fixed-height full-width"},kl={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},Nl={class:"row"},jl={class:"col body-border-right justify-center column q-px-xs full-height"},Ol={class:"col-auto row fixed-height full-width"},Dl={class:"col body-border-right justify-center column q-px-xs full-height"},Pl={class:"col-auto row full-width"},Al={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},$l={class:"row"},Ll={class:"col body-border-right justify-center column q-pa-xs full-height"},Bl={class:"fit"},Rl={class:"col row"},Fl={class:"col-1 row full-width"},Ml={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},Kl={class:"row"},Yl={class:"col body-border-right justify-center column q-pa-xs full-height"},Ql={class:"col row full-width"},Hl={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},Wl={class:"row"},zl={class:"col body-border-right justify-center column q-pa-xs full-height"},Gl={class:"col-auto row fixed-height full-width"},Jl={class:"col body-border-right justify-center column q-px-xs full-height"},Xl={class:"row no-wrap"},Zl={class:"col-auto row fixed-height full-width"},et={key:0,class:"col body-border-right justify-center column q-px-xs full-height"},lt={key:1,class:"col body-border-right justify-center column q-px-xs"},tt={class:"col-auto row fixed-height full-width"},ot={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},ut={class:"row"},at={class:"col body-border-right justify-center column q-px-xs full-height"},st={class:"col-auto row fixed-height full-width"},nt={class:"col body-border-right justify-center column q-px-xs full-height"},it={class:"col-auto row fixed-height full-width"},rt={class:"col body-border-right justify-center column q-px-xs full-height"},dt={key:0,class:"text-right q-mt-xs col-auto full-width bg-grey-5 q-pa-xs"},ct="\uD2F0\uCF13 \uC0C1\uC138",vt={__name:"NewTicket",props:["newTicket"],emits:["update"],setup(xe,{emit:Te}){const Y=a(!1),oe=xe,be=Te,Ce=ol(),A=al(),d=ul(),w=dl(),_e=cl(),u=a(oe.newTicket),we=T.CODES.COUNSEL_CATEGORY,qe=T.CODES.TICKET_PROCESS_STATUS,ue=a(),$=a({name:"\uC120\uD0DD",value:null}),U=a({name:"\uC120\uD0DD",value:null}),v=a({name:"\uC120\uD0DD",value:null}),p=a({name:"\uC120\uD0DD",value:null}),y=a({name:"\uC120\uD0DD",value:null}),E=a(),q=a(),ae=a(),se=a(),Q=a(A.entityId),H=a(A.id),W=a(A.name),S=a(),V=a(),Se=a(C(()=>A.name)),Ve=a(C(()=>A.id)),ne=C(()=>W.value&&H.value?`${W.value} [${H.value}]`:null),Ie=T.CHANNEL_CONTACT_TYPE.INBOUND,Ue=T.CHANNEL_CONTACT_TYPE.OUTBOUND,Ee=C(()=>{var l,e;return((l=u.value.channels)==null?void 0:l.length)&&u.value.channels[0].contactCode===Ie?(e=w.codes.get(u.value.channels[0].typeCode))==null?void 0:e.name:null}),ke=C(()=>{var l,e;return((l=u.value.channels)==null?void 0:l.length)&&u.value.channels[0].contactCode===Ue?(e=w.codes.get(u.value.channels[0].typeCode))==null?void 0:e.name:null}),Ne=a(C(()=>{var l;return(l=w.codes.get(qe))==null?void 0:l.children})),je=a(C(()=>{var l;return(l=w.codes.get(we))==null?void 0:l.children})),ie=a(C(()=>d.counselTypeArray.map(l=>({name:l.name,value:l})))),re=a([{name:"\uC120\uD0DD",value:null}]),de=a([{name:"\uC120\uD0DD",value:null}]),z=a(),L=a(),I=a(!0);D(()=>oe.newTicket,l=>{u.value=l,Z()},{deep:!0}),D(u,l=>{l&&(I.value=!0,Oe(),X(()=>I.value=!1))}),D(ie,l=>{l.length>0&&!v.value&&(v.value={name:"\uC120\uD0DD",value:null})},{immediate:!0}),D(v,l=>{l&&(re.value=d.getChildrenCounselTypesByTopParentCodeValue(l.code).map(e=>({name:e.name,value:e})),I.value||(p.value={name:"\uC120\uD0DD",value:null},y.value={name:"\uC120\uD0DD",value:null}))},{immediate:!0}),D(p,l=>{l&&(de.value=d.getChildrenCounselTypesByTopParentCodeValue(l.code).map(e=>({name:e.name,value:e})),I.value||(y.value={name:"\uC120\uD0DD",value:null}))},{immediate:!0}),pe(()=>{I.value=!1,Z(),ve()}),ye(()=>{me.cancel()});function Oe(){var l;ue.value=w.codes.get(u.value.typeCode),$.value=w.codes.get(u.value.statusCode),U.value=w.codes.get(u.value.counselCategoryCode)||{name:"\uC120\uD0DD",value:null},v.value=d.counselTypes.get(u.value.counselTypeCodeLarge)||{name:"\uC120\uD0DD",value:null},p.value=d.counselTypes.get(u.value.counselTypeCodeMedium)||{name:"\uC120\uD0DD",value:null},y.value=d.counselTypes.get(u.value.counselTypeCodeSmall)||{name:"\uC120\uD0DD",value:null},E.value=u.value.contents,q.value=u.value.callbackReservationDate,ae.value=u.value.customerName,se.value=u.value.tel,Q.value=((l=u.value.manager)==null?void 0:l.entityId)||null,H.value=u.value.managerUserId,W.value=u.value.managerUserName,Z(),z.value=u.value.productType,L.value=u.value.inquiry}function Z(){if(q.value){const[l,e]=q.value.split(" "),s=e?e.substring(0,5):"";S.value=l,V.value=s}else S.value=null,V.value=null}function De(){S.value&&V.value?q.value=`${S.value} ${V.value}:00`:q.value=null}function Pe(){var e,s,o,i,n,m,b;if(!u.value.entityId)return;if(!$.value){x("\uCC98\uB9AC\uC0C1\uD0DC\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}if(((e=U.value)==null?void 0:e.value)===null||!U.value){x("\uC0C1\uB2F4\uAD6C\uBD84\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}if(((s=v.value)==null?void 0:s.value)===null||!v.value){x("\uC0C1\uB2F4\uC720\uD615\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}if(!L.value){x("\uBB38\uC758\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.");return}if(!E.value){x("\uC0C1\uB2F4\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");return}if(S.value&&!V.value){x("\uC7AC\uD1B5\uD654\uC608\uC57D \uC2DC\uAC04\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}if(!Q.value){x("\uB2F4\uB2F9\uC790\uB97C \uC9C0\uC815\uD574\uC8FC\uC138\uC694.");return}Y.value=!0,De();let l;l={statusCode:$.value.code,productType:z.value,counselCategoryCode:U.value.code,counselTypeCodeLarge:((o=v.value)==null?void 0:o.code)||"",counselTypeCodeMedium:((i=p.value)==null?void 0:i.code)||"",counselTypeCodeSmall:((n=y.value)==null?void 0:n.code)||"",inquiry:L.value,contents:E.value,"manager.entityId":Q.value},(m=u.value)!=null&&m.startDate&&(l.startDate=u.value.startDate),(b=u.value)!=null&&b.endDate&&(l.endDate=u.value.endDate),q.value&&(l.callbackReservationDate=q.value),ge.updateTicket(u.value.entityId,l).then(_=>{_.status===200&&x("\uC800\uC7A5\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4").then(()=>{ge.getTicketByEntityId(u.value.entityId).then(c=>{c.status===200&&(u.value=c.data)}).catch(c=>{te(c)}),be("update",se.value)})}).catch(_=>{te(_)}).finally(()=>{Y.value=!1})}function Ae(){Ce.dialog({component:il,componentProps:{enableRowDblClick:!0}}).onOk(l=>{Q.value=l.payload[0].entityId,W.value=l.payload[0].name,H.value=l.payload[0].id})}const G=a(),J=a(),k=a(!1),B=a([]),ce=a(C(()=>d.counselTypeArray));D(ce,l=>{ve()});function ve(){B.value=[];let l,e,s;ce.value.forEach(o=>{var i;l=o.name,B.value.push({name:`${l}`,value:o}),(i=o.children)!=null&&i.length&&o.children.forEach(n=>{var m;e=n.name,B.value.push({name:`${l} > ${e}`,value:n}),(m=n.children)!=null&&m.length&&n.children.forEach(b=>{s=b.name,B.value.push({name:`${l} > ${e} > ${s}`,value:b})})})})}function $e(){var l;if(G.value.trim()){let e=B.value.filter(s=>s.name.includes(G.value));J.value=e}else J.value=[];(l=J.value)!=null&&l.length?k.value=!0:k.value=!1}const me=sl.exports.debounce(()=>{$e()},500);function Le(l){const e=l.path.split(".");if(e.length){const s=d.counselTypes.get(e[0]);v.value=s}X(()=>{e.length>1&&(p.value=d.counselTypes.get(e[1])),X(()=>{e.length>2&&(y.value=d.counselTypes.get(e[2]))})}),k.value=!1}function Be(l){const e=l.getFullYear(),s=String(l.getMonth()+1).padStart(2,"0"),o=String(l.getDate()).padStart(2,"0");return`${e}-${s}-${o}`}const Re=a(null),ee=a(!1);function fe(l){var e;if(!!ee.value)for(let[s,o]of _e.commandMap.entries()){const i=s.split("-");let n=null,m=null;if(i[0]===T.SHORT_CUT_KEY_TYPE.SPECIFIC&&(i[1]===T.SHORT_CUT_SPECIFIC.CTRL?n=l.ctrlKey:i[1]===T.SHORT_CUT_SPECIFIC.ALT?n=l.altKey:i[1]===T.SHORT_CUT_SPECIFIC.SHIFT&&(n=l.shiftKey)),i[2]===T.SHORT_CUT_KEY_TYPE.DIGIT&&(m=i[3]),n!==null&&m!==null&&n&&l.code===`Digit${m}`){l.preventDefault();const b=o.find(c=>c.commandType===T.COMMAND_TYPE.COUNSEL_TYPE),_=o.find(c=>c.commandType===T.COMMAND_TYPE.TEXT);if(b!=null&&b.command){I.value=!0;const c=((e=b.command)==null?void 0:e.split("."))||[];c.length===1&&(v.value=d.counselTypes.get(c[0]),p.value={name:"\uC120\uD0DD",value:null},y.value={name:"\uC120\uD0DD",value:null}),c.length===2&&(v.value=d.counselTypes.get(c[0]),p.value=d.counselTypes.get(c[1]),y.value={name:"\uC120\uD0DD",value:null}),c.length===3&&(v.value=d.counselTypes.get(c[0]),p.value=d.counselTypes.get(c[1]),y.value=d.counselTypes.get(c[2]))}_!=null&&_.command&&(E.value=_.command),X(()=>I.value=!1);break}}}function Fe(){ee.value=!0}function Me(){ee.value=!1}pe(()=>{window.addEventListener("keydown",fe)}),ye(()=>{window.removeEventListener("keydown",fe)});const N=a(null),R=a(),j=a([]),le=a(null);function Ke(){var e,s,o;if((e=v.value)!=null&&e.entityId&&(N.value=v.value.entityId),(s=p.value)!=null&&s.entityId&&(N.value=p.value.entityId),(o=y.value)!=null&&o.entityId&&(N.value=y.value.entityId),!N.value){x("\uC0C1\uB2F4\uC720\uD615\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");return}const l={};l["entity.counselType.entityId"]=N.value,ml.getScript(l).then(i=>{var n;if(i.status===200){if(!i.data.length){x("\uB4F1\uB85D\uB41C \uC2A4\uD06C\uB9BD\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");return}R.value=i.data[0],Qe((n=R.value.counselType)==null?void 0:n.path),R.value.counselTypeNameWithPath=le.value,Ye(N.value)}}).catch(i=>{te(i)})}function Ye(l){const e=R.value.entityId,s=100*j.value.length,o=100*j.value.length;j.value.forEach(m=>{m.closed||m.focus()});const i=`script-${l}`;localStorage.setItem(i,JSON.stringify(R.value));const n=window.open(`/view/counselTypeScript?popupKey=${i}`,e,`width=1200,height=600,left=${s},top=${o}`);n?(j.value.push(n),n.addEventListener("unload",()=>{setTimeout(()=>{n.closed&&(j.value=j.value.filter(m=>m!==n))},100)}),n.focus()):x("\uD31D\uC5C5\uC774 \uCC28\uB2E8\uB418\uC5C8\uAC70\uB098 \uC5F4\uB9AC\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.")}function Qe(l){var o,i,n;if(!l){le.value=null;return}let e=l.split("."),s="";e.length>0&&(s=(o=d.counselTypes.get(e[0]))==null?void 0:o.name),e.length>1&&(s+=` > ${(i=d.counselTypes.get(e[1]))==null?void 0:i.name}`),e.length>2&&(s+=` > ${(n=d.counselTypes.get(e[2]))==null?void 0:n.name}`),le.value=s}return(l,e)=>{var s;return P(),F("div",{class:"detail q-ml-xs column",ref_key:"container",ref:Re,tabindex:"0",onFocusin:Fe,onFocusout:Me},[r(rl,{title:ct,class:"col-auto full-width"}),t("div",pl,[t("div",yl,[e[15]||(e[15]=t("div",{class:"col-auto t-column text-left top-border-left justify-center column q-px-xs full-height"}," \uD2F0\uCF13\uC720\uD615 ",-1)),t("div",hl,h((s=ue.value)==null?void 0:s.name),1)]),t("div",gl,[e[16]||(e[16]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"}," \uD2F0\uCF13\uBC88\uD638 ",-1)),t("div",xl,h(u.value.entityId),1)]),t("div",Tl,[t("div",bl,[t("div",Cl,[r(O,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:g(()=>e[17]||(e[17]=[f("*")])),_:1}),e[18]||(e[18]=f("\uCC98\uB9AC\uC0C1\uD0DC"))])]),t("div",_l,[r(M,{options:Ne.value,"option-label":"name",modelValue:$.value,"onUpdate:modelValue":e[0]||(e[0]=o=>$.value=o)},null,8,["options","modelValue"])])]),t("div",wl,[e[19]||(e[19]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},"IN\uCC44\uB110",-1)),t("div",ql,h(Ee.value),1)]),t("div",Sl,[e[20]||(e[20]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"}," OUT\uCC44\uB110 ",-1)),t("div",Vl,h(ke.value),1)]),t("div",Il,[e[21]||(e[21]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"}," \uC81C\uD488\uBD84\uB958 ",-1)),t("div",Ul,[r(K,{modelValue:z.value,"onUpdate:modelValue":e[1]||(e[1]=o=>z.value=o)},null,8,["modelValue"])])]),t("div",El,[t("div",kl,[t("div",Nl,[r(O,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:g(()=>e[22]||(e[22]=[f("*")])),_:1}),e[23]||(e[23]=f("\uC0C1\uB2F4\uAD6C\uBD84"))])]),t("div",jl,[r(M,{options:je.value,modelValue:U.value,"onUpdate:modelValue":e[2]||(e[2]=o=>U.value=o),"option-label":"name"},null,8,["options","modelValue"])])]),t("div",Ol,[e[24]||(e[24]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"}," \uC778\uC785\uACBD\uB85C ",-1)),t("div",Dl,h(u.value.inboundPath),1)]),t("div",Pl,[t("div",Al,[t("div",$l,[r(O,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:g(()=>e[25]||(e[25]=[f("*")])),_:1}),e[26]||(e[26]=f("\uC0C1\uB2F4\uC720\uD615"))]),r(We,{icon:"help",round:"",unelevated:"",style:{width:"24px",height:"24px",padding:"0px"},dense:"",size:"12px",onClick:Ke},{default:g(()=>[r(He,{anchor:"center right",self:"center start"},{default:g(()=>e[27]||(e[27]=[f("\uC2A4\uD06C\uB9BD\uD2B8")])),_:1})]),_:1})]),t("div",Ll,[t("div",Bl,[r(K,{class:"col q-mb-xs",modelValue:G.value,"onUpdate:modelValue":[e[5]||(e[5]=o=>G.value=o),Xe(me)],placeholder:"\uC0C1\uB2F4\uC720\uD615\uC744 \uAC80\uC0C9\uD574\uC8FC\uC138\uC694."},{default:g(()=>[r(tl,{modelValue:k.value,"onUpdate:modelValue":e[3]||(e[3]=o=>k.value=o),"auto-close":"","transition-show":"scale","transition-hide":"scale",fit:"","no-focus":"","no-parent-event":"",onHide:e[4]||(e[4]=o=>k.value=!1)},{default:g(()=>[r(ll,null,{default:g(()=>[(P(!0),F(ze,null,Ge(J.value,(o,i)=>(P(),Je(el,{key:i,clickable:"",onClick:n=>Le(o.value)},{default:g(()=>[f(h(o.name),1)]),_:2},1032,["onClick"]))),128))]),_:1})]),_:1},8,["modelValue"])]),_:1},8,["modelValue","onUpdate:modelValue"]),t("div",Rl,[r(M,{options:ie.value,modelValue:v.value,"onUpdate:modelValue":e[6]||(e[6]=o=>v.value=o),"option-label":"name",class:"col"},null,8,["options","modelValue"]),r(M,{options:re.value,modelValue:p.value,"onUpdate:modelValue":e[7]||(e[7]=o=>p.value=o),"option-label":"name",class:"col"},null,8,["options","modelValue"]),r(M,{options:de.value,modelValue:y.value,"onUpdate:modelValue":e[8]||(e[8]=o=>y.value=o),"option-label":"name",class:"col"},null,8,["options","modelValue"])])])])]),t("div",Fl,[t("div",Ml,[t("div",Kl,[r(O,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:g(()=>e[28]||(e[28]=[f("*")])),_:1}),e[29]||(e[29]=f("\uBB38\uC758"))])]),t("div",Yl,[r(he,{height:"100%",class:"col",modelValue:L.value,"onUpdate:modelValue":e[9]||(e[9]=o=>L.value=o)},null,8,["modelValue"])])]),t("div",Ql,[t("div",Hl,[t("div",Wl,[r(O,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:g(()=>e[30]||(e[30]=[f("*")])),_:1}),e[31]||(e[31]=f("\uC0C1\uB2F4\uB0B4\uC6A9"))])]),t("div",zl,[r(he,{height:"100%",class:"col",modelValue:E.value,"onUpdate:modelValue":e[10]||(e[10]=o=>E.value=o)},null,8,["modelValue"])])]),t("div",Gl,[e[32]||(e[32]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"}," \uC7AC\uD1B5\uD654\uC608\uC57D ",-1)),t("div",Jl,[t("div",Xl,[r(K,{type:"date",class:"col",modelValue:S.value,"onUpdate:modelValue":e[11]||(e[11]=o=>S.value=o),min:Be(new Date)},null,8,["modelValue","min"]),r(K,{type:"time",class:"col",modelValue:V.value,"onUpdate:modelValue":e[12]||(e[12]=o=>V.value=o)},null,8,["modelValue"])])])]),t("div",Zl,[e[33]||(e[33]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},"\uBCF4\uACE0\uC790",-1)),u.value.createdByUserName&&u.value.createdByUserId?(P(),F("div",et,h(u.value.createdByUserName)+" ["+h(u.value.createdByUserId)+"] ",1)):(P(),F("div",lt,h(Se.value)+" ["+h(Ve.value)+"]",1))]),t("div",tt,[t("div",ot,[t("div",ut,[r(O,{class:"q-pa-none q-mr-xs",color:"grey-2","text-color":"red"},{default:g(()=>e[34]||(e[34]=[f("*")])),_:1}),e[35]||(e[35]=f("\uB2F4\uB2F9\uC790"))])]),t("div",at,[r(K,{onClick:Ae,modelValue:ne.value,"onUpdate:modelValue":e[13]||(e[13]=o=>ne.value=o),readonly:!0},null,8,["modelValue"])])]),t("div",st,[e[36]||(e[36]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"},"\uACE0\uAC1D\uBA85",-1)),t("div",nt,h(ae.value),1)]),t("div",it,[e[37]||(e[37]=t("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs full-height"}," \uC804\uD654\uBC88\uD638 ",-1)),t("div",rt,h(u.value.tel),1)]),u.value.entityId?(P(),F("div",dt,[r(nl,{label:"\uC800\uC7A5",onClick:Pe})])):Ze("",!0)]),r(vl,{modelValue:Y.value,"onUpdate:modelValue":e[14]||(e[14]=o=>Y.value=o)},null,8,["modelValue"])],544)}}},lo=fl(vt,[["__scopeId","data-v-1d61887d"]]);export{lo as default};