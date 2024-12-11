import{u as Qe}from"./use-quasar.2d4ce40a.js";import S from"./AIconBtn.b6a23ac8.js";import{u as je}from"./authStore.fadf8446.js";import{u as Je,V as o}from"./systemVariableStore.28d075a0.js";import{s as c,a as _}from"./dialog.88ce899f.js";import{u as ze,M as Se}from"./errorHandler.5efe1eb1.js";import Xe from"./CallInLayerPop2.e8496377.js";import Ze from"./CallOutLayerPop.14e656e2.js";import en from"./CallTransferLayerPop.77c94d0c.js";import"./axios.816e1a60.js";import{k as K,r,g as nn,t as tn,y as on,u as ln,o as an,Y as cn,z as R,a1 as Be,aB as sn,a as B,$ as un}from"./index.02f7c95d.js";import"./_plugin-vue_export-helper.cdc0426e.js";import"./header.10137493.js";import"./CommonPopup.2b0ee10b.js";import"./use-dialog-plugin-component.234e0905.js";import"./counsel-hub.145170b4.js";import"./customerInfoApi.4e3b1586.js";import"./codeStore.e69f9e04.js";import"./AInput.398f059b.js";import"./ATitleBar.bbf1d9a4.js";import"./ClosePopup.daa62b28.js";import"./userApi.abe7b8c8.js";import"./TabulatorGrid.9c80b09d.js";import"./ABtn.e24d7e8a.js";/* empty css                                                             */import"./organizationStore.a86bd6ff.js";const fn={class:"row no-wrap q-gutter-x-xs"},xn={__name:"SoftPhone",setup(rn,{expose:he}){he({logoutAndDisconnectWhenUserLogOut:Oe});const v=Je(),V=Qe(),ge=ze(),h=je(),s=K().appContext.config.globalProperties.$emitter,u=K().appContext.config.globalProperties.$counselHub,a=K().appContext.config.globalProperties.$channel,b=CounselFlowHubVoiceType.IPRON_V5,w=r(!1),ve=r("none"),$=r(!1),W=r(null),k=CounselFlowHubVoiceCode.DialType.INTERNAL,E=r(null),O=r(0),I=r(0),A=r(""),P=r(""),H={WORK:o.LeaveSubStateCode.WORK,MEAL:o.LeaveSubStateCode.MEAL,REST:o.LeaveSubStateCode.REST,EDU:o.LeaveSubStateCode.EDU},y=r({isWorkBtn:!1,isMealBtn:!1,isRestBtn:!1,isEduBtn:!1}),U=r(nn(()=>({appName:v.ctiServerInfo.APPNAME,protocol:v.ctiServerInfo.PROTOCOL,activeServer:v.ctiServerInfo.ACTIVESERVER,activePort:v.ctiServerInfo.ACTIVEPORT,standbyServer:v.ctiServerInfo.STANDBYSERVER,standbyPort:v.ctiServerInfo.STANDBYPORT,tenant:v.ctiServerInfo.TENANT,stateAfterLogin:null,stateAfterCall:CounselFlowHubVoiceCode.ChannelState.PROCESS}))),C=r({id:"",name:"",password:"",extension:"",reasonCode:""}),l=r({isOffCallingBtn:!0,isOffAcceptBtn:!0,isOffHangUpBtn:!0,isOffTransBtn:!0,isOffLeaveBtn:!0,isLeaveClicked:!0,isOffHeldBtn:!0,isHeldClicked:!0,isOffReadyBtn:!0,isReadyClicked:!0,isOffCurseBtn:!0,isOffSexualBtn:!0,isOffCardBtn:!0,isOffAgreeBtn:!0,backgroundColor:o.StateBarColor.WHITE,status:o.StateCodeName.NOTLOGIN,callOnOffClass:{"voice-off":!0,"voice-on":!1},timer:"00:00:00"}),q={NOTLOGIN:{channelState:o.StateCodeName.NOTLOGIN,toolbar_backgroundColor:o.StateBarColor.WHITE,changeButtonStateOnOff:{ctiOnBtn:!1,callingBtn:!1,acceptBtn:!1,hangupBtn:!1,readyBtn:!1,transBtn:!1,heldBtn:!1,leaveBtn:!1,curseBtn:!1,SexualBtn:!1},changeButtonStateClickAndUnClick:{readyBtn:!1,heldBtn:!1,leaveBtn:!1},func:Re},READY:{channelState:o.StateCodeName.READY,toolbar_backgroundColor:o.StateBarColor.BLUE,changeButtonStateOnOff:{ctiOnBtn:!0,callingBtn:!0,acceptBtn:!1,hangupBtn:!1,readyBtn:!1,transBtn:!1,heldBtn:!1,leaveBtn:!0,curseBtn:!1,SexualBtn:!1},changeButtonStateClickAndUnClick:{readyBtn:!1,heldBtn:!1,leaveBtn:!0},func:Ve},ABSENCE:{channelState:o.StateCodeName.ABSENCE,changeButtonStateOnOff:{ctiOnBtn:!0,callingBtn:!0,acceptBtn:!1,hangupBtn:!1,readyBtn:!0,transBtn:!1,heldBtn:!1,leaveBtn:!0,curseBtn:!1,SexualBtn:!1},changeButtonStateClickAndUnClick:{readyBtn:!0,heldBtn:!1,leaveBtn:!0},func:Ue},OFFERING:{channelState:o.StateCodeName.OFFERING,toolbar_backgroundColor:o.StateBarColor.BLUE,changeButtonStateOnOff:{ctiOnBtn:!0,callingBtn:!1,acceptBtn:!0,hangupBtn:!0,readyBtn:!1,transBtn:!1,heldBtn:!1,leaveBtn:!1,curseBtn:!1,SexualBtn:!1},changeButtonStateClickAndUnClick:{readyBtn:!1,heldBtn:!0,leaveBtn:!1},func:xe},ACTIVE:{channelState:o.StateCodeName.ACTIVE,toolbar_backgroundColor:o.StateBarColor.BLUE,changeButtonStateOnOff:{ctiOnBtn:!0,callingBtn:!1,acceptBtn:!1,hangupBtn:!0,readyBtn:!1,transBtn:!0,heldBtn:!0,leaveBtn:!1,curseBtn:!0,SexualBtn:!0},changeButtonStateClickAndUnClick:{readyBtn:!1,heldBtn:!0,leaveBtn:!1},func:Me},PROCESS:{channelState:o.StateCodeName.PROCESS,toolbar_backgroundColor:o.StateBarColor.PINK,changeButtonStateOnOff:{ctiOnBtn:!0,callingBtn:!0,acceptBtn:!1,hangupBtn:!1,readyBtn:!0,transBtn:!1,heldBtn:!1,leaveBtn:!0,curseBtn:!1,SexualBtn:!1},changeButtonStateClickAndUnClick:{readyBtn:!0,heldBtn:!1,leaveBtn:!0},func:De},HELD:{channelState:o.StateCodeName.HELD,toolbar_backgroundColor:o.StateBarColor.BLUE,changeButtonStateOnOff:{ctiOnBtn:!0,callingBtn:!1,acceptBtn:!1,hangupBtn:!1,readyBtn:!1,transBtn:!1,heldBtn:!0,leaveBtn:!1,curseBtn:!1,SexualBtn:!1},changeButtonStateClickAndUnClick:{readyBtn:!1,heldBtn:!0,leaveBtn:!1},func:Ge},RINGBACK:{channelState:o.StateCodeName.RINGBACK,toolbar_backgroundColor:o.StateBarColor.BLUE,changeButtonStateOnOff:{ctiOnBtn:!0,callingBtn:!1,acceptBtn:!1,hangupBtn:!0,readyBtn:!1,transBtn:!1,heldBtn:!1,leaveBtn:!1,curseBtn:!1,SexualBtn:!1},changeButtonStateClickAndUnClick:{readyBtn:!1,heldBtn:!1,leaveBtn:!1},func:_e},MISS:{channelState:o.StateCodeName.MISS,toolbar_backgroundColor:o.StateBarColor.PINK,changeButtonStateOnOff:{ctiOnBtn:!0,callingBtn:!0,acceptBtn:!1,hangupBtn:!1,readyBtn:!0,transBtn:!1,heldBtn:!1,leaveBtn:!0,curseBtn:!1,SexualBtn:!1},changeButtonStateClickAndUnClick:{readyBtn:!0,heldBtn:!1,leaveBtn:!0},func:Ke},BUSY:{func:$e}},m=r(null);function Y(){a.options=U.value}tn(U,e=>{Y()},{immediate:!0}),on(()=>{Y(),window.addEventListener("beforeunload",me),s.on("dial",M),s.on("ready",G),s.on("absence",F),s.on("conference",D),s.on("executeAgreeArs",ae),s.on("makeConsultCall",J),pe();try{u.addEventCallback(ne),h.ctiAutoLogin&&j()}catch{}}),ln(()=>{console.log("[SoftPhone Unmounted]");try{u.removeEventCallback(ne)}catch{}s.off("dial",M),s.off("ready",G),s.off("absence",F),s.off("conference",D),s.off("executeAgreeArs",ae),s.off("makeConsultCall",J)});function pe(){C.value.id=h.ctiLoginId?h.ctiLoginId:"",C.value.password=h.ctiLoginPassword?h.ctiLoginPassword:"",C.value.extension=h.ctiExtension?h.ctiExtension:"",C.value.name=h.name}function be(){var e,n;if(a.channelInfo.state===CounselFlowHubVoiceCode.ChannelState.ACTIVE){c("\uD1B5\uD654\uC911\uC5D0\uB294 OFF\uC804\uD658\uC774 \uBD88\uAC00\uB2A5\uD569\uB2C8\uB2E4.");return}if(!((e=C.value)!=null&&e.id)){c("CTI AgentID\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD558\uC138\uC694.");return}if(!((n=C.value)!=null&&n.extension)){c("\uB0B4\uC120\uBC88\uD638\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");return}a.connected?_("\uB85C\uADF8\uC544\uC6C3 \uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?").then(t=>{t&&Pe()}):_("\uB85C\uADF8\uC778 \uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?").then(t=>{t&&j()})}function Oe(){if(!a.connected)return Promise.resolve();let e="";return u.logout([b],e).then(()=>(console.log("[SoftPhone] #\uB85C\uADF8\uC544\uC6C3 \uC131\uACF5"),u.disconnect(e))).then(()=>{console.log("[SoftPhone] #\uC811\uC18D\uD574\uC81C \uC131\uACF5")}).catch(n=>{console.log("[SoftPhone] #\uC624\uB958 \uBC1C\uC0DD : ",n),c(o.GetCounselFlowHubErrorMessage(n))})}function me(e){if(console.log(e),e.returnValue="",a.connected){let n="";u.logout([b],n).then(()=>(console.log("[SoftPhone] #\uB85C\uADF8\uC544\uC6C3 \uC131\uACF5"),u.disconnect(n))).then(()=>{console.log("[SoftPhone] #\uC811\uC18D\uD574\uC81C \uC131\uACF5")}).catch(t=>{console.log("[SoftPhone] #\uC624\uB958 \uBC1C\uC0DD : ",t),c(o.GetCounselFlowHubErrorMessage(t))})}}function Ee(e){a.requestChannelState(e).then(n=>{console.log("[SoftPhone] #agentState \uC131\uACF5 : ",n),Ie(n)}).catch(n=>{console.log("[SoftPhone] #agentState \uC2E4\uD328 : ",n),u.disconnect(),c(o.GetCounselFlowHubErrorMessage(n))})}function Ie(e){e.state!==CounselFlowHubVoiceCode.ChannelState.NOTLOGIN?_("\uC774\uBBF8 \uB85C\uADF8\uC778 \uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uAE30\uC874\uC5F0\uACB0\uC744 \uB04A\uACE0 \uB85C\uADF8\uC778 \uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?").then(n=>{n?u.login([b],C.value).then(()=>{console.log("[SoftPhone] #\uB85C\uADF8\uC778 \uC131\uACF5"),Q()}).catch(t=>{console.log("[SoftPhone] #\uB85C\uADF8\uC778 \uC2E4\uD328 : ",t),u.disconnect(),c(o.GetCounselFlowHubErrorMessage(t))}):u.disconnect()}):u.login([b],C.value).then(()=>{console.log("[SoftPhone] #\uB85C\uADF8\uC778 \uC131\uACF5"),Q()}).catch(n=>{console.log("[SoftPhone] #\uB85C\uADF8\uC778 \uC2E4\uD328 : ",n),u.disconnect(),c(o.GetCounselFlowHubErrorMessage(n))})}function Q(){try{const e=a.getFetcher();e.getQueueList().then(n=>{let t="";n.forEach((f,i)=>{i===0?t+=f.dn:t+="-"+f.dn}),e.reportQueueSubscribe(U.value.tenant,t).then(()=>{}).catch(f=>{console.warn(f)})}).catch(n=>{console.warn(n)})}catch{}}function j(){u.connect().then(()=>{console.log("[SoftPhone] #\uC811\uC18D \uC131\uACF5"),Ee(C.value.id)}).catch(e=>{console.log("[SoftPhone] #\uC811\uC18D \uC2E4\uD328 : ",e),c(o.GetCounselFlowHubErrorMessage(e))})}function x(){u.connect().then(()=>{console.log("[SoftPhone] #\uC811\uC18D \uC131\uACF5"),u.login(null,C).then(()=>{console.log("[SoftPhone] #\uB85C\uADF8\uC778 \uC131\uACF5"),w.value=!0}).catch(e=>{console.log("[SoftPhone] #\uB85C\uADF8\uC778 \uC2E4\uD328 : ",e),console.log("autoLogin"),u.disconnect(),w.value||setTimeout(x,5e3)})}).catch(e=>{console.log("[SoftPhone] #\uC624\uD1A0\uB85C\uADF8\uC778 \uC811\uC18D \uC2E4\uD328 : ",e),w.value||setTimeout(x,5e3)})}function Pe(e){let n=e||"";u.logout([b],n).then(()=>{console.log("[SoftPhone] #\uB85C\uADF8\uC544\uC6C3 \uC131\uACF5")}).catch(t=>{console.log("[SoftPhone] #\uB85C\uADF8\uC544\uC6C3 \uC2E4\uD328 : ",t)}).finally(()=>{u.disconnect(n).then(()=>{console.log("[SoftPhone] #\uC811\uC18D\uD574\uC81C \uC131\uACF5")}).catch(t=>{console.log("[SoftPhone] #\uC811\uC18D\uD574\uC81C \uC2E4\uD328 : ",t),c(o.GetCounselFlowHubErrorMessage(t))})})}function M(e){a.dial({type:k,calledId:e}).then(()=>{console.log("[SoftPhone] #\uAC78\uAE30 \uC131\uACF5 : ",e)}).catch(n=>{console.log("[SoftPhone] #\uAC78\uAE30 \uC2E4\uD328 : ",n),c(o.GetCounselFlowHubErrorMessage(n),"\uC18C\uD504\uD2B8\uD3F0 \uC624\uB958")})}function Te(e){var t;let n={};if(e&&(n.calledId=e),!((t=n==null?void 0:n.calledId)!=null&&t.length)){c("\uD638\uC804\uD658 \uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694.");return}n.type=k,a.transfer(n).then(()=>{console.log("[SoftPhone] #\uD638\uC804\uD658 \uC131\uACF5")}).catch(f=>{console.log("[SoftPhone] #\uD638\uC804\uD658 \uC2E4\uD328 : ",f),c(o.GetCounselFlowHubErrorMessage(f),"\uC18C\uD504\uD2B8\uD3F0 \uC624\uB958")})}function D(e){a.conference({type:k,calledId:e}).then(()=>{console.log("[SoftPhone] #3\uC790\uD1B5\uD654 \uC131\uACF5")}).catch(n=>{console.log("[SoftPhone] #3\uC790\uD1B5\uD654 \uC2E4\uD328 : ",n),c(o.GetCounselFlowHubErrorMessage(n),"\uC18C\uD504\uD2B8\uD3F0 \uC624\uB958")})}function J(e){var t;let n={};if(e&&(n.calledId=e),!((t=n==null?void 0:n.calledId)!=null&&t.length)){c("\uC804\uD654\uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694.");return}n.type=k,a.consult(n).then(()=>{console.log("[SoftPhone] #\uD611\uC758\uC804\uD654 \uC131\uACF5")}).catch(f=>{console.log("[SoftPhone] #\uD611\uC758\uC804\uD654 \uC2E4\uD328 : ",f),c(o.GetCounselFlowHubErrorMessage(f),"\uC18C\uD504\uD2B8\uD3F0 \uC624\uB958")})}function Ne(){m.value=V.dialog({component:en}).onOk(e=>{e.callType===CounselFlowHubVoiceCode.CallType.TRANSFER?Te(e.dial):e.callType===CounselFlowHubVoiceCode.CallType.CONFERENCE?D(e.dial):e.callType==="retrieve"&&E.value.channelInfo.callInfo.callType===CounselFlowHubVoiceCode.CallType.CONSULT&&Z()}).onCancel(()=>{m.value=null})}function we(){V.dialog({component:Ze}).onOk(e=>{M(e),X()})}function ke(e){m.value=V.dialog({component:Xe,componentProps:{signalInfo:e}}).onOk(()=>{Ae(),X()}).onCancel(()=>{He(),m.value=null})}function z(){m.value&&m.value.hide()}function X(){ge.addTab({name:Se.CALL_CONSULT.name,label:Se.CALL_CONSULT.label})}function G(){l.value.isOffReadyBtn||a.channelInfo.state!=="READY"&&u.ready().then(()=>{console.log("[SoftPhone] #\uB300\uAE30 \uC131\uACF5")}).catch(e=>{console.log("[SoftPhone] #\uB300\uAE30 \uC2E4\uD328 : ",e)})}function F(e){let n=e;n||(n="4"),u.absence([b],n).then(()=>{console.log("[SoftPhone] #\uC774\uC11D \uC131\uACF5")}).catch(t=>{console.log("[SoftPhone] #\uC774\uC11D \uC2E4\uD328 : ",t)})}function Ae(){l.value.isOffAcceptBtn||a.acceptCall().then(e=>{console.log("[SoftPhone] #\uC804\uD654\uBC1B\uAE30 \uC131\uACF5",e)}).catch(e=>{console.log("[SoftPhone] #\uC804\uD654\uBC1B\uAE30 \uC2E4\uD328 : ",e),c(o.GetCounselFlowHubErrorMessage(e),"\uC18C\uD504\uD2B8\uD3F0 \uC624\uB958")})}function He(){console.log("rejectCall"),a.rejectCall().then(()=>{console.log("[SoftPhone] #\uD1B5\uD654\uAC70\uC808 \uC131\uACF5")}).catch(e=>{console.log("[SoftPhone] #\uD1B5\uD654\uAC70\uC808 \uC2E4\uD328 : ",e),c(o.GetCounselFlowHubErrorMessage(e),"\uC18C\uD504\uD2B8\uD3F0 \uC624\uB958")})}function Z(){if(!l.value.isOffHangUpBtn)return new Promise((e,n)=>{a.hangup().then(()=>{console.log("[SoftPhone] #\uD1B5\uD654\uC885\uB8CC \uC131\uACF5"),e()}).catch(t=>{console.log("[SoftPhone] #\uD1B5\uD654\uC885\uB8CC \uC2E4\uD328 : ",t),c(o.GetCounselFlowHubErrorMessage(t),"\uC18C\uD504\uD2B8\uD3F0 \uC624\uB958"),n(t)})})}function ye(){l.value.isOffHeldBtn||(a.channelInfo.state===CounselFlowHubVoiceCode.ChannelState.ACTIVE?a.hold().then(()=>{console.log("[SoftPhone] #\uBCF4\uB958 \uC131\uACF5")}).catch(e=>{try{ee()}catch{console.log("[SoftPhone] #\uBCF4\uB958 \uC2E4\uD328 : ",e),c(o.GetCounselFlowHubErrorMessage(e),"\uC18C\uD504\uD2B8\uD3F0 \uC624\uB958")}}):a.channelInfo.state===CounselFlowHubVoiceCode.ChannelState.HELD&&ee())}function ee(){a.retrieve().then(()=>{console.log("[SoftPhone] #\uBCF4\uB958\uD574\uC81C \uC131\uACF5 \uC131\uACF5")}).catch(e=>{console.log("[SoftPhone] #\uBCF4\uB958\uD574\uC81C \uC2E4\uD328 : ",e),c(o.GetCounselFlowHubErrorMessage(e),"\uC18C\uD504\uD2B8\uD3F0 \uC624\uB958")})}function Fe(e){for(let n in q)if(n===e)return q[n]}function Le(e,n){let t=Fe(e);t.func(t,n)}function g(e){l.value.status=e.channelState,l.value.backgroundColor=e.toolbar_backgroundColor,te(e.changeButtonStateOnOff),oe(e.changeButtonStateClickAndUnClick)}function Re(e){g(e),qe(),a.channelInfo.subState===-1e3&&(w.value=!1,x())}function Ve(e){g(e),ve.value="none",le(),p(),$.value=!1}function Ue(e,n){var t,f,i;if((i=(f=(t=n==null?void 0:n.channelInfo)==null?void 0:t.callInfo)==null?void 0:f.extraData)!=null&&i.isDiverted){F("4");return}We(a.channelInfo.subState),te(e.changeButtonStateOnOff),oe(e.changeButtonStateClickAndUnClick),p()}function xe(e,n){ke(n),g(e),p()}function Me(e,n){var t,f,i,d,T,N;console.log("UEI log",n.channelInfo.callInfo.extraData),console.log("channel",a),(f=(t=n.channelInfo)==null?void 0:t.callInfo)!=null&&f.extraData&&(console.log("[SoftPhone] \uD1B5\uD654\uC911 \uC18C\uD504\uD2B8\uD3F0 UCID : ",n.channelInfo.callInfo.extraData.ucid),console.log("[SoftPhone] #\uC0C1\uB2F4\uD1B5\uD654\uC2DC\uC791")),((d=(i=n.channelInfo)==null?void 0:i.callInfo)==null?void 0:d.callType)===CounselFlowHubVoiceCode.CallType.CONFERENCE?e.changeButtonStateOnOff.transBtn=!1:e.changeButtonStateOnOff.transBtn=!0,g(e),(N=(T=W.value)==null?void 0:T.callInfo)!=null&&N.extraData&&p()}function De(e,n){console.log("[SoftPhone] #\uC0C1\uB2F4\uD1B5\uD654\uC885\uB8CC"),g(e),p(),$.value=!1}function Ge(e){g(e)}function _e(e,n){g(e),p()}function Ke(e){g(e),p()}function $e(){console.log("funcBusy")}function ne(e){var T,N,ie,re,Ce,de;console.log("========================Event Started========================="),console.log("[processEvent] : ",JSON.parse(JSON.stringify(e)));const n=E.value,t=n==null?void 0:n.channelInfo.state,f=(N=(T=n==null?void 0:n.channelInfo)==null?void 0:T.callInfo)==null?void 0:N.callType;E.value=JSON.parse(JSON.stringify(e));const i=(ie=E.value)==null?void 0:ie.channelInfo.state,d=(de=(Ce=(re=E.value)==null?void 0:re.channelInfo)==null?void 0:Ce.callInfo)==null?void 0:de.callType;console.log(`[state]: ${t} => ${i}`),console.log(`[callType]: ${f} => ${d}`),console.log("========================Event Ended==========================="),!(!fe(e.queueReportInfo)&&!fe(e.queueReportInfo.method)&&e.queueReportInfo.method===3006)&&(W.value=e.channelInfo,!(e.channelInfo.state===CounselFlowHubVoiceCode.ChannelState.ABSENCE&&a.channelInfo.subState===-999)&&(t===CounselFlowHubVoiceCode.ChannelState.OFFERING&&i===CounselFlowHubVoiceCode.ChannelState.ACTIVE&&s.emit("callInStarted",e),t===CounselFlowHubVoiceCode.ChannelState.RINGBACK&&i===CounselFlowHubVoiceCode.ChannelState.ACTIVE&&s.emit("callOutStarted",e),t===CounselFlowHubVoiceCode.ChannelState.ACTIVE&&i===CounselFlowHubVoiceCode.ChannelState.PROCESS&&(s.emit("callEnded",e),z()),t===CounselFlowHubVoiceCode.ChannelState.PROCESS&&t!==i&&s.emit("processEnded",e),t===CounselFlowHubVoiceCode.ChannelState.OFFERING&&i===CounselFlowHubVoiceCode.ChannelState.PROCESS&&z(),t===CounselFlowHubVoiceCode.ChannelState.ACTIVE&&i===CounselFlowHubVoiceCode.ChannelState.ACTIVE&&(d===CounselFlowHubVoiceCode.CallType.TRANSFER||d===CounselFlowHubVoiceCode.CallType.CONFERENCE)&&s.emit("callInStarted",e),i===CounselFlowHubVoiceCode.ChannelState.RINGBACK&&d===CounselFlowHubVoiceCode.CallType.CONSULT&&s.emit("consultCallRequested"),t===CounselFlowHubVoiceCode.ChannelState.RINGBACK&&i===CounselFlowHubVoiceCode.ChannelState.ACTIVE&&d===CounselFlowHubVoiceCode.CallType.CONSULT&&s.emit("consultCallResponse",!0),f===CounselFlowHubVoiceCode.CallType.CONSULT&&d!==f&&s.emit("consultCallResponse",!1),Le(e.channelInfo.state,e)))}function L(e){le(),F(e)}function te(e){l.value.isOffCallingBtn=!e.callingBtn,l.value.isOffAcceptBtn=!e.acceptBtn,l.value.isOffHangUpBtn=!e.hangupBtn,l.value.isOffReadyBtn=!e.readyBtn,l.value.isOffTransBtn=!e.transBtn,l.value.isOffHeldBtn=!e.heldBtn,l.value.isOffLeaveBtn=!e.leaveBtn,l.value.isOffCurseBtn=!e.curseBtn,l.value.isOffSexualBtn=!e.SexualBtn,l.value.callOnOffClass["voice-on"]=e.ctiOnBtn,l.value.callOnOffClass["voice-off"]=!e.ctiOnBtn,l.value.isOffCardBtn=!e.SexualBtn,l.value.isOffAgreeBtn=!e.SexualBtn}function oe(e){l.value.isReadyClicked=!e.readyBtn,l.value.isHeldClicked=!e.heldBtn,l.value.isLeaveClicked=!e.leaveBtn}function We(e){e===0?(l.value.status=o.LeaveSubStateCodeName.REST,l.value.backgroundColor=o.StateBarColor.PINK):e===1?(l.value.status=o.LeaveSubStateCodeName.MEAL,l.value.backgroundColor=o.StateBarColor.PINK):e===2?(l.value.status=o.LeaveSubStateCodeName.EDU,l.value.backgroundColor=o.StateBarColor.PINK):e===3?(l.value.status=o.LeaveSubStateCodeName.WORK,l.value.backgroundColor=o.StateBarColor.PINK):e===4?(l.value.status=o.StateCodeName.MISS,l.value.backgroundColor=o.StateBarColor.PINK):e===-999?(l.value.status=o.StateCodeName.LOGIN,l.value.backgroundColor=o.StateBarColor.BLUE):(l.value.status=o.StateCodeName.ABSENCE,l.value.backgroundColor=o.StateBarColor.PINK)}function le(){y.value.isWorkBtn=!1,y.value.isMealBtn=!1,y.value.isRestBtn=!1,y.value.isEduBtn=!1}function ae(e){}function qe(){ce()}function p(){ce(),Ye(),se()}function Ye(){I.value===1?(I.value=0,A.value=new Date,O.value=A.value.getTime()-P.value.getTime()):(I.value=1,P.value=new Date,P.value.setTime(P.value.getTime()-O.value))}function ce(){I.value=0,O.value=0,l.value.timer=ue(parseInt(O.value/1e3))}function se(){setTimeout(()=>{se()},1e3),I.value===1&&(A.value=new Date,O.value=A.value.getTime()-P.value.getTime(),l.value.timer=ue(parseInt(O.value/1e3)))}function ue(e){let n=function(t){return t<10?"0"+t:t};return n(parseInt(e/(60*60)))+":"+n(parseInt(e/60%60))+":"+n(e%60)}function fe(e){return!e||e==="null"||e==="undefined"}return(e,n)=>(an(),cn("div",fn,[R("div",{class:sn(["text-white q-px-sm rounded-borders shadow-1 q-mr-md",l.value.status==="OFF"?"bg-grey-6":"bg-primary"])},[R("div",{class:"fit column items-center justify-center text-weight-bold",onClick:be,style:{cursor:"pointer"}},[R("span",null,Be(l.value.status),1),R("span",null,Be(l.value.timer),1)])],2),B(S,{label:"\uAC78\uAE30",icon:"phone_forwarded",disable:l.value.isOffCallingBtn,onClick:we},null,8,["disable"]),B(S,{label:"\uB04A\uAE30",icon:"call_end",disable:l.value.isOffHangUpBtn,onClick:Z},null,8,["disable"]),B(S,{label:"\uB300\uAE30",icon:"hourglass_empty",disable:l.value.isOffReadyBtn,onClick:G},null,8,["disable"]),B(S,{label:l.value.status===un(o).StateCodeName.HELD?"\uBCF4\uB958\uD574\uC81C":"\uBCF4\uB958",icon:"watch_later",disable:l.value.isOffHeldBtn,onClick:ye},null,8,["label","disable"]),B(S,{label:"\uD638\uC804\uD658",icon:"timeline",disable:l.value.isOffTransBtn,onClick:Ne},null,8,["disable"]),B(S,{label:"\uD734\uC2DD",icon:"local_cafe",disable:l.value.isOffLeaveBtn,onClick:n[0]||(n[0]=t=>L(H.REST))},null,8,["disable"]),B(S,{label:"\uC2DD\uC0AC",icon:"restaurant",disable:l.value.isOffLeaveBtn,onClick:n[1]||(n[1]=t=>L(H.MEAL))},null,8,["disable"]),B(S,{label:"\uAD50\uC721",icon:"school",disable:l.value.isOffLeaveBtn,onClick:n[2]||(n[2]=t=>L(H.EDU))},null,8,["disable"]),B(S,{label:"\uD0C0\uC5C5\uBB34",icon:"work",disable:l.value.isOffLeaveBtn,onClick:n[3]||(n[3]=t=>L(H.WORK))},null,8,["disable"])]))}};export{xn as default};
