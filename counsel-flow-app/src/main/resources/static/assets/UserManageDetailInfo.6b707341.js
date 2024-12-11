import{Q as P}from"./QBadge.c1f4e948.js";import{Q as Ue}from"./QSelect.b17c746f.js";import{u as qe}from"./use-quasar.2d4ce40a.js";import C from"./AInput.398f059b.js";import O from"./ASelect.a02a29e0.js";import k from"./ABtn.e24d7e8a.js";import Ie from"./ATitleBar.bbf1d9a4.js";import{u as j}from"./userApi.abe7b8c8.js";import{C as De}from"./index.9642ecdd.js";import Ce from"./PermissionPopup.f4613141.js";import{u as je}from"./organizationStore.a86bd6ff.js";import{u as Ee}from"./permissionStore.29c18612.js";import{s as f,a as Se}from"./dialog.88ce899f.js";import{h as Q}from"./errorHandler.5efe1eb1.js";import{F as ae}from"./FlowSystemCode.7be7ce49.js";import{F as Z}from"./FlowRoleCode.12cdb02e.js";import{_ as Re}from"./_plugin-vue_export-helper.cdc0426e.js";import{g as z,r as s,t as H,ac as Ne,y as Oe,o as b,Y as se,a as c,z as l,w as J,a0 as w,ab as ke,a1 as E,c as S,Z as A,R as ie}from"./index.02f7c95d.js";import"./QItem.1bce08e7.js";import"./QMenu.3c9cf304.js";import"./position-engine.53490cc8.js";import"./rtl.276c3f1b.js";import"./format.2cae61da.js";/* empty css                                                             */import"./ClosePopup.daa62b28.js";import"./axios.816e1a60.js";import"./_commonjsHelpers.c10bf6cb.js";import"./_commonjs-dynamic-modules.30ae7933.js";import"./TabulatorGrid.9c80b09d.js";import"./ACheckbox.923db872.js";import"./use-dialog-plugin-component.234e0905.js";import"./permissionApi.ffe0b82d.js";import"./ALoadingSpinner.ca275fb8.js";import"./header.10137493.js";import"./CommonPopup.2b0ee10b.js";import"./authStore.fadf8446.js";import"./counsel-hub.145170b4.js";const ze={class:"detail q-ml-xs column"},Ae={class:"col q-pa-xs b-border column table-container full-width"},Be={class:"col-auto row fixed-height full-width"},Le={class:"col-auto t-column text-left top-border-left justify-center column q-px-xs"},$e={class:"col top-border-right justify-center column q-px-xs"},Ve={class:"col-auto row fixed-height full-width"},Me={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},Te={class:"col body-border-right justify-center column q-px-xs"},Fe={class:"col-auto row full-width"},Ge={class:"col body-border-right justify-center column q-pa-xs full-width"},Pe={class:"col-auto row fixed-height full-width"},Qe={class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},Ze={class:"col body-border-right justify-center column q-px-xs"},He={class:"col row full-width"},Je={class:"col body-border-right justify-center q-px-xs"},Ye={class:"q-pa-xs"},Ke={class:"full-height column no-wrap text-no-wrap full-width items-center overflow-auto"},We={class:"col-auto row fixed-height full-width"},Xe={class:"col body-border-right justify-center column q-px-xs"},et={class:"col-auto row fixed-height full-width"},tt={class:"col body-border-right justify-center column q-px-xs"},ot={class:"col-auto row full-width"},lt={class:"col body-border-right justify-center column q-pa-xs"},at={class:"col-auto row fixed-height full-width"},st={class:"col body-border-right justify-center column q-px-xs"},it={class:"col-auto row fixed-height full-width"},nt={class:"col body-border-right justify-center column q-px-xs"},rt={class:"col-auto row fixed-height full-width"},ut={class:"col body-border-right justify-center column q-px-xs"},dt={class:"col-auto row fixed-height full-width"},ct={class:"col body-border-right justify-center column q-px-xs"},mt={class:"row q-pt-xs justify-end q-gutter-xs no-wrap full-width"},vt={__name:"UserManageDetailInfo",props:{userData:{type:Object,required:!1,defalut:()=>({})}},emits:["close","fetchData"],setup(ne,{emit:re}){const B=ae.USE_CD.USE,ue=ae.USE_CD.UNUSE,L=je(),$=Ee(),de=qe();function ce(){return new Promise(t=>{de.dialog({component:Ce}).onOk(e=>{q.value=e.payload.name,_.value=e.payload.entityId}).onCancel(()=>{t(null)})})}const V=ne,R=re,me=z(()=>p.value?"\uC0AC\uC6A9\uC790 \uC0C1\uC138\uC815\uBCF4":"\uC0AC\uC6A9\uC790 \uC0DD\uC131"),p=s(null),y=s(""),x=s(""),Y=[{label:"\uC0AC\uC6A9",value:B},{label:"\uC0AC\uC6A9 \uC548\uD568",value:ue}],U=s(B),_=s(""),q=s(""),g=s(""),I=s(""),D=s(""),ve=s(""),K=s(""),W=s(""),X=s(""),ee=s(""),M=s(["\uC120\uD0DD"]),h=s(["\uC120\uD0DD"]),m=s(["\uC120\uD0DD"]),d=s("\uC120\uD0DD"),u=s("\uC120\uD0DD"),n=s("\uC120\uD0DD"),v=s([]),te=s(!1),fe=s(!1),pe=z(()=>$.hasPermission(Z.USER_ROLE.DELETE)),ye=z(()=>$.hasPermission(Z.USER_ROLE.SAVE)),xe=z(()=>$.hasPermission(Z.USER_ROLE.ADD));async function N(t){var o;if(fe.value=!0,p.value=t.entityId||null,y.value=t.id||"",x.value=t.name||"",t.organization&&t.organization.path){const a=t.organization.path.split(".");await ge(a)}else F();const e=Y.find(a=>a.value===t.useTypeCode);U.value=e?e.value:B,_.value=t.roleGroup&&t.roleGroup.entityId||null,q.value=((o=t.roleGroup)==null?void 0:o.name)||"",g.value=t.email||"",I.value=t.ctiLoginId||"",D.value=t.ctiExtension||"",ve.value="\uBCF4\uD5D8\uC0C1\uD488",K.value=t.createdDate||"",W.value=t.createdByUserName?t.createdByUserName+" ["+(t.createdByUserId||"")+"]":"",X.value=t.lastModifiedDate||"",ee.value=t.lastModifiedByUserName?t.lastModifiedByUserName+" ["+(t.lastModifiedByUserId||"")+"]":""}async function ge(t){try{if(t[0]){const e=t[0];d.value=T(e),await oe(1,e),await ie()}if(t[1]){const e=t[1];u.value=T(e),await oe(2,e),await ie()}if(t[2]){const e=t[2];n.value=T(e)}}catch{F()}}function T(t){const e=L.organizations.get(t);return e?e.name:"\uC120\uD0DD"}async function oe(t){return new Promise(e=>{var o;if(t===1){const a=v.value.find(i=>i.name===d.value);a&&a.children?(h.value=["\uC120\uD0DD",...a.children.map(i=>i.name)],u.value="\uC120\uD0DD",m.value=["\uC120\uD0DD"],n.value="\uC120\uD0DD"):F()}else if(t===2){const a=v.value.find(r=>r.name===d.value),i=(o=a==null?void 0:a.children)==null?void 0:o.find(r=>r.name===u.value);i&&i.children?(m.value=["\uC120\uD0DD",...i.children.map(r=>r.name)],n.value="\uC120\uD0DD"):(m.value=["\uC120\uD0DD"],n.value="\uC120\uD0DD")}e()})}async function he(){v.value=Array.from(L.organizations.values()),M.value=["\uC120\uD0DD",...v.value.filter(t=>t.parentEntityId===null).map(t=>t.name)],te.value=!0,V.userData&&await N(V.userData)}function F(){d.value="\uC120\uD0DD",u.value="\uC120\uD0DD",n.value="\uC120\uD0DD",h.value=["\uC120\uD0DD"],m.value=["\uC120\uD0DD"]}H(d,t=>{if(t!=="\uC120\uD0DD"){const e=v.value.find(o=>o.name===t);e&&e.children?(h.value=["\uC120\uD0DD",...e.children.map(o=>o.name)],u.value="\uC120\uD0DD",n.value="\uC120\uD0DD",m.value=["\uC120\uD0DD"]):(h.value=["\uC120\uD0DD"],m.value=["\uC120\uD0DD"],u.value="\uC120\uD0DD",n.value="\uC120\uD0DD")}else h.value=["\uC120\uD0DD"],m.value=["\uC120\uD0DD"],u.value="\uC120\uD0DD",n.value="\uC120\uD0DD"}),H(u,t=>{var e;if(t!=="\uC120\uD0DD"){const o=v.value.find(i=>i.name===d.value),a=(e=o==null?void 0:o.children)==null?void 0:e.find(i=>i.name===t);a&&a.children?(m.value=["\uC120\uD0DD",...a.children.map(i=>i.name)],n.value="\uC120\uD0DD"):(m.value=["\uC120\uD0DD"],n.value="\uC120\uD0DD")}else m.value=["\uC120\uD0DD"],n.value="\uC120\uD0DD"});async function be(){const t=/^[a-zA-Z0-9]+$/,e=/^[가-힣a-zA-Z0-9]+$/,o=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(!y.value||!x.value){f("\uC544\uC774\uB514\uC640 \uC774\uB984\uC740 \uD544\uC218 \uC785\uB825 \uC785\uB2C8\uB2E4.");return}if(!t.test(y.value)){f("\uC544\uC774\uB514\uB294 \uC601\uBB38 \uB300\uC18C\uBB38\uC790\uC640 \uC22B\uC790\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");return}if(!e.test(x.value)){f("\uC774\uB984\uC740 \uD55C\uAE00, \uC601\uBB38 \uB300\uC18C\uBB38\uC790\uC640 \uC22B\uC790\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");return}if(g.value&&!o.test(g.value)){f("\uC62C\uBC14\uB978 \uC774\uBA54\uC77C \uD615\uC2DD\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");return}const a=le(),i={entity:{id:y.value,name:x.value,password:De.SHA256("12345678").toString(),email:g.value,useTypeCode:U.value,ctiLoginId:I.value,ctiExtension:D.value,..._.value&&{roleGroup:{entityId:_.value}},...a&&{organization:{entityId:a}}}};try{const r=await j.postUser(i);if(r.status===200){const G=await j.getUser(r.data.entityId);await N(G.data),R("fetchData"),f("\uC800\uC7A5 \uB418\uC5C8\uC2B5\uB2C8\uB2E4.")}}catch(r){Q(r)}}function le(){var e,o;let t=null;if(d.value!=="\uC120\uD0DD"&&(t=v.value.find(a=>a.name===d.value)),t&&u.value!=="\uC120\uD0DD"){const a=(e=t.children)==null?void 0:e.find(i=>i.name===u.value);if(a)t=a;else return t?t.entityId:null}if(t&&n.value!=="\uC120\uD0DD"){const a=(o=t.children)==null?void 0:o.find(i=>i.name===n.value);if(a)t=a;else return t?t.entityId:null}return t?t.entityId:null}async function we(){const t=/^[a-zA-Z0-9]+$/,e=/^[가-힣a-zA-Z0-9]+$/,o=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(!y.value||!x.value){f("\uC774\uB984\uC740 \uD544\uC218 \uC785\uB825 \uC785\uB2C8\uB2E4.");return}if(!t.test(y.value)){f("\uC544\uC774\uB514\uB294 \uC601\uBB38 \uB300\uC18C\uBB38\uC790\uC640 \uC22B\uC790\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");return}if(!e.test(x.value)){f("\uC774\uB984\uC740 \uD55C\uAE00, \uC601\uBB38 \uB300\uC18C\uBB38\uC790\uC640 \uC22B\uC790\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");return}if(g.value&&!o.test(g.value)){f("\uC62C\uBC14\uB978 \uC774\uBA54\uC77C \uD615\uC2DD\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");return}const a=le(),i={entity:{name:x.value,email:g.value,useTypeCode:U.value,ctiLoginId:I.value,ctiExtension:D.value,..._.value&&{roleGroup:{entityId:_.value}},...a&&{organization:{entityId:a}}}};try{const r=await j.putUser(p.value,i);if(r.status===200){const G=await j.getUser(r.data.entityId);await N(G.data),R("fetchData"),f("\uC800\uC7A5 \uB418\uC5C8\uC2B5\uB2C8\uB2E4.")}}catch(r){Q(r)}}async function _e(){if(await Se("\uC0AD\uC81C \uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?")){if(y.value==="admin"){f("admin \uACC4\uC815\uC740 \uC0AD\uC81C \uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");return}j.deleteUser(p.value).then(e=>{e.status===200&&(R("fetchData"),R("close"))}).catch(e=>{Q(e)})}}return H(()=>V.userData,async t=>{t&&te.value&&await N(t)},{immediate:!0}),Ne(()=>{var t,e;if(v.value=L.organizationArray,M.value=["\uC120\uD0DD",...v.value.filter(o=>o.parentEntityId===null).map(o=>o.name)],d.value!=="\uC120\uD0DD"){const o=v.value.find(a=>a.name===d.value);h.value=o!=null&&o.children?["\uC120\uD0DD",...o.children.map(a=>a.name)]:["\uC120\uD0DD"]}if(u.value!=="\uC120\uD0DD"){const o=(e=(t=v.value.find(a=>a.name===d.value))==null?void 0:t.children)==null?void 0:e.find(a=>a.name===u.value);m.value=o!=null&&o.children?["\uC120\uD0DD",...o.children.map(a=>a.name)]:["\uC120\uD0DD"]}}),Oe(()=>{he()}),(t,e)=>(b(),se("div",ze,[c(Ie,{title:me.value,close:!0,onClose:e[0]||(e[0]=o=>t.$emit("close")),class:"col-auto"},null,8,["title"]),l("div",Ae,[l("div",Be,[l("div",Le,[l("div",null,[c(P,{class:"q-pa-none vertical-top",color:"grey-2","text-color":"red"},{default:J(()=>e[10]||(e[10]=[w("*")])),_:1}),e[11]||(e[11]=w(" \uC544\uC774\uB514 "))])]),l("div",$e,[p.value?(b(),se(ke,{key:0},[w(E(y.value),1)],64)):(b(),S(C,{key:1,modelValue:y.value,"onUpdate:modelValue":e[1]||(e[1]=o=>y.value=o)},null,8,["modelValue"]))])]),l("div",Ve,[l("div",Me,[l("div",null,[c(P,{class:"q-pa-none vertical-top",color:"grey-2","text-color":"red"},{default:J(()=>e[12]||(e[12]=[w("*")])),_:1}),e[13]||(e[13]=w(" \uC0AC\uC6A9\uC790\uBA85 "))])]),l("div",Te,[c(C,{modelValue:x.value,"onUpdate:modelValue":e[2]||(e[2]=o=>x.value=o)},null,8,["modelValue"])])]),l("div",Fe,[e[14]||(e[14]=l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"\uC870\uC9C1(\uBD80\uC11C)",-1)),l("div",Ge,[c(O,{class:"col q-pb-xs full-width",modelValue:d.value,"onUpdate:modelValue":e[3]||(e[3]=o=>d.value=o),options:M.value},null,8,["modelValue","options"]),c(O,{class:"col q-pb-xs full-width",modelValue:u.value,"onUpdate:modelValue":e[4]||(e[4]=o=>u.value=o),options:h.value},null,8,["modelValue","options"]),c(O,{class:"col full-width",modelValue:n.value,"onUpdate:modelValue":e[5]||(e[5]=o=>n.value=o),options:m.value},null,8,["modelValue","options"])])]),l("div",Pe,[l("div",Qe,[l("div",null,[c(P,{class:"q-pa-none vertical-top",color:"grey-2","text-color":"red"},{default:J(()=>e[15]||(e[15]=[w("*")])),_:1}),e[16]||(e[16]=w(" \uC0AC\uC6A9\uC5EC\uBD80 "))])]),l("div",Ze,[c(O,{modelValue:U.value,"onUpdate:modelValue":e[6]||(e[6]=o=>U.value=o),options:Y},null,8,["modelValue"])])]),l("div",He,[e[17]||(e[17]=l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"\uAD8C\uD55C\uBA85",-1)),l("div",Je,[l("div",Ye,[c(k,{label:"\uAD8C\uD55C\uC124\uC815",onClick:ce})]),l("div",Ke,[q.value&&q.value!==""?(b(),S(Ue,{key:0,class:"chip q-ma-xs",color:"primary",label:q.value,"text-color":"white",size:"md",style:{width:"80%"},clickable:""},null,8,["label"])):A("",!0)])])]),l("div",We,[e[18]||(e[18]=l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"\uC774\uBA54\uC77C",-1)),l("div",Xe,[c(C,{modelValue:g.value,"onUpdate:modelValue":e[7]||(e[7]=o=>g.value=o)},null,8,["modelValue"])])]),l("div",et,[e[19]||(e[19]=l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"CTI ID",-1)),l("div",tt,[c(C,{modelValue:I.value,"onUpdate:modelValue":e[8]||(e[8]=o=>I.value=o),maxlength:"50"},null,8,["modelValue"])])]),l("div",ot,[e[20]||(e[20]=l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"\uB0B4\uC120\uBC88\uD638",-1)),l("div",lt,[c(C,{modelValue:D.value,"onUpdate:modelValue":e[9]||(e[9]=o=>D.value=o),maxlength:"50"},null,8,["modelValue"])])]),e[25]||(e[25]=l("div",{class:"col-auto row fixed-height full-width"},[l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"\uBCF4\uC720\uC2A4\uD0AC"),l("div",{class:"col body-border-right justify-center column q-px-xs"})],-1)),l("div",at,[e[21]||(e[21]=l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"\uB4F1\uB85D\uC77C\uC2DC",-1)),l("div",st,E(K.value),1)]),l("div",it,[e[22]||(e[22]=l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"\uB4F1\uB85D\uC790\uBA85",-1)),l("div",nt,E(W.value),1)]),l("div",rt,[e[23]||(e[23]=l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"\uBCC0\uACBD\uC77C\uC2DC",-1)),l("div",ut,E(X.value),1)]),l("div",dt,[e[24]||(e[24]=l("div",{class:"col-auto t-column text-left body-border-left justify-center column q-px-xs"},"\uBCC0\uACBD\uC790\uBA85",-1)),l("div",ct,E(ee.value),1)]),l("div",mt,[p.value&&p.value!==""&&pe.value?(b(),S(k,{key:0,label:"\uC0AD\uC81C",onClick:_e})):A("",!0),p.value&&p.value!==""&&ye.value?(b(),S(k,{key:1,label:"\uC800\uC7A5",onClick:we})):A("",!0),!p.value&&xe.value?(b(),S(k,{key:2,label:"\uC800\uC7A5",onClick:be})):A("",!0)])])]))}},Kt=Re(vt,[["__scopeId","data-v-1b717f3e"]]);export{Kt as default};
