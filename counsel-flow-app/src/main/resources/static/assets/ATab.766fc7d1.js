import{Q as z}from"./QBadge.c1f4e948.js";import{i as E,f as k,r as C,g as u,K as F,y as O,aX as U,I as X,aY as Z,h as s,am as T,V as Y,aZ as G,C as P,v as H,k as J,a_ as D,a$ as ee,e as ae,aD as R,aU as te,X as le,o as m,c as g,w as x,aC as ne,z as B,a0 as w,a1 as S,Z as h,E as I,aF as N}from"./index.02f7c95d.js";import{_ as oe}from"./_plugin-vue_export-helper.cdc0426e.js";let se=0;const re=["click","keydown"],ie={icon:String,label:[Number,String],alert:[Boolean,String],alertIcon:String,name:{type:[Number,String],default:()=>`t_${se++}`},noCaps:Boolean,tabindex:[String,Number],disable:Boolean,contentClass:String,ripple:{type:[Boolean,Object],default:!0}};function ue(a,c,n,l){const e=E(U,k);if(e===k)return console.error("QTab/QRouteTab component needs to be child of QTabs"),k;const{proxy:d}=J(),v=C(null),_=C(null),y=C(null),M=u(()=>a.disable===!0||a.ripple===!1?!1:Object.assign({keyCodes:[13,32],early:!0},a.ripple===!0?{}:a.ripple)),p=u(()=>e.currentModel.value===a.name),Q=u(()=>"q-tab relative-position self-stretch flex flex-center text-center"+(p.value===!0?" q-tab--active"+(e.tabProps.value.activeClass?" "+e.tabProps.value.activeClass:"")+(e.tabProps.value.activeColor?` text-${e.tabProps.value.activeColor}`:"")+(e.tabProps.value.activeBgColor?` bg-${e.tabProps.value.activeBgColor}`:""):" q-tab--inactive")+(a.icon&&a.label&&e.tabProps.value.inlineLabel===!1?" q-tab--full":"")+(a.noCaps===!0||e.tabProps.value.noCaps===!0?" q-tab--no-caps":"")+(a.disable===!0?" disabled":" q-focusable q-hoverable cursor-pointer")+(l!==void 0?l.linkClass.value:"")),K=u(()=>"q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable "+(e.tabProps.value.inlineLabel===!0?"row no-wrap q-tab__content--inline":"column")+(a.contentClass!==void 0?` ${a.contentClass}`:"")),A=u(()=>a.disable===!0||e.hasFocus.value===!0||p.value===!1&&e.hasActiveTab.value===!0?-1:a.tabindex||0);function $(t,o){if(o!==!0&&v.value!==null&&v.value.focus(),a.disable===!0){l!==void 0&&l.hasRouterLink.value===!0&&T(t);return}if(l===void 0){e.updateModel({name:a.name}),n("click",t);return}if(l.hasRouterLink.value===!0){const r=(i={})=>{let f;const W=i.to===void 0||D(i.to,a.to)===!0?e.avoidRouteWatcher=ee():null;return l.navigateToRouterLink(t,{...i,returnRouterError:!0}).catch(b=>{f=b}).then(b=>{if(W===e.avoidRouteWatcher&&(e.avoidRouteWatcher=!1,f===void 0&&(b===void 0||b.message!==void 0&&b.message.startsWith("Avoided redundant navigation")===!0)&&e.updateModel({name:a.name})),i.returnRouterError===!0)return f!==void 0?Promise.reject(f):b})};n("click",t,r),t.defaultPrevented!==!0&&r();return}n("click",t)}function L(t){Y(t,[13,32])?$(t,!0):G(t)!==!0&&t.keyCode>=35&&t.keyCode<=40&&t.altKey!==!0&&t.metaKey!==!0&&e.onKbdNavigate(t.keyCode,d.$el)===!0&&T(t),n("keydown",t)}function V(){const t=e.tabProps.value.narrowIndicator,o=[],r=s("div",{ref:y,class:["q-tab__indicator",e.tabProps.value.indicatorClass]});a.icon!==void 0&&o.push(s(P,{class:"q-tab__icon",name:a.icon})),a.label!==void 0&&o.push(s("div",{class:"q-tab__label"},a.label)),a.alert!==!1&&o.push(a.alertIcon!==void 0?s(P,{class:"q-tab__alert-icon",color:a.alert!==!0?a.alert:void 0,name:a.alertIcon}):s("div",{class:"q-tab__alert"+(a.alert!==!0?` text-${a.alert}`:"")})),t===!0&&o.push(r);const i=[s("div",{class:"q-focus-helper",tabindex:-1,ref:v}),s("div",{class:K.value},H(c.default,o))];return t===!1&&i.push(r),i}const q={name:u(()=>a.name),rootRef:_,tabIndicatorRef:y,routeData:l};F(()=>{e.unregisterTab(q)}),O(()=>{e.registerTab(q)});function j(t,o){const r={ref:_,class:Q.value,tabindex:A.value,role:"tab","aria-selected":p.value===!0?"true":"false","aria-disabled":a.disable===!0?"true":void 0,onClick:$,onKeydown:L,...o};return X(s(t,r,V()),[[Z,M.value]])}return{renderTab:j,$tabs:e}}const ce=ae({name:"QTab",props:ie,emits:re,setup(a,{slots:c,emit:n}){const{renderTab:l}=ue(a,c,n);return()=>l("div")}});const de={class:"row items-center no-wrap"},be={class:"q-px-md"},ve={__name:"ATab",props:R({name:{type:[Number,String],required:!0},label:[Number,String],lockable:Boolean,closable:Boolean,badge:[Number,String]},{locked:{},lockedModifiers:{}}),emits:R(["close"],["update:locked"]),setup(a){te(e=>({"5d660ed8":l.value}));const c=a,n=le(a,"locked"),l=u(()=>{let e=1;return c.closable&&(e+=16,c.lockable&&(e+=18)),`${e}px`});return(e,d)=>(m(),g(ce,{class:"a-tab",name:e.$props.name,ripple:!1,"no-caps":""},{default:x(()=>[ne(e.$slots,"private",{},()=>[B("div",de,[B("div",be,[w(S(e.$props.label)+" ",1),e.$props.badge?(m(),g(z,{key:0,floating:"",rounded:""},{default:x(()=>[w(S(e.$props.badge),1)]),_:1})):h("",!0)]),e.$props.lockable&&e.$props.closable?(m(),g(I,{key:0,dense:"",round:"",flat:"",size:"xs",ripple:!1,icon:n.value?"lock":"lock_open",onClick:d[0]||(d[0]=N(v=>n.value=!n.value,["stop"]))},null,8,["icon"])):h("",!0),e.$props.closable?(m(),g(I,{key:1,disable:n.value,dense:"",round:"",flat:"",size:"xs",ripple:!1,icon:"close",onClick:d[1]||(d[1]=N(v=>e.$emit("close",e.$props.name),["stop"])),style:{"margin-left":"-3px"}},null,8,["disable"])):h("",!0)])],!0)]),_:3},8,["name"]))}},pe=oe(ve,[["__scopeId","data-v-01f08699"]]);export{pe as default};
