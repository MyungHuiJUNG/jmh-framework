import{e as Ae,aH as j,au as te,r as v,g as d,t as P,p as Re,K as Ie,ao as ke,ap as Be,h as R,j as Me,C as ne,aX as $e,k as Pe,o as De,c as xe,w as Ee,z as oe,aC as Fe}from"./index.02f7c95d.js";import{Q as Ve}from"./QResizeObserver.dd2c8de3.js";import{r as We}from"./rtl.276c3f1b.js";import{_ as ze}from"./_plugin-vue_export-helper.cdc0426e.js";function He(n,h,D){const T=D===!0?["left","right"]:["top","bottom"];return`absolute-${h===!0?T[0]:T[1]}${n?` text-${n}`:""}`}const Qe=["left","center","right","justify"],je=Ae({name:"QTabs",props:{modelValue:[Number,String],align:{type:String,default:"center",validator:n=>Qe.includes(n)},breakpoint:{type:[String,Number],default:600},vertical:Boolean,shrink:Boolean,stretch:Boolean,activeClass:String,activeColor:String,activeBgColor:String,indicatorColor:String,leftIcon:String,rightIcon:String,outsideArrows:Boolean,mobileArrows:Boolean,switchIndicator:Boolean,narrowIndicator:Boolean,inlineLabel:Boolean,noCaps:Boolean,dense:Boolean,contentClass:String,"onUpdate:modelValue":[Function,Array]},setup(n,{slots:h,emit:D}){const{proxy:T}=Pe(),{$q:x}=T,{registerTick:ae}=j(),{registerTick:le}=j(),{registerTick:re}=j(),{registerTimeout:ie,removeTimeout:se}=te(),{registerTimeout:O,removeTimeout:ue}=te(),S=v(null),u=v(null),w=v(n.modelValue),y=v(!1),E=v(!0),F=v(!1),U=v(!1),c=[],V=v(0),I=v(!1);let _=null,C=null,g;const ce=d(()=>({activeClass:n.activeClass,activeColor:n.activeColor,activeBgColor:n.activeBgColor,indicatorClass:He(n.indicatorColor,n.switchIndicator,n.vertical),narrowIndicator:n.narrowIndicator,inlineLabel:n.inlineLabel,noCaps:n.noCaps})),fe=d(()=>{const e=V.value,t=w.value;for(let o=0;o<e;o++)if(c[o].name.value===t)return!0;return!1}),ve=d(()=>`q-tabs__content--align-${y.value===!0?"left":U.value===!0?"justify":n.align}`),de=d(()=>`q-tabs row no-wrap items-center q-tabs--${y.value===!0?"":"not-"}scrollable q-tabs--${n.vertical===!0?"vertical":"horizontal"} q-tabs__arrows--${n.outsideArrows===!0?"outside":"inside"} q-tabs--mobile-with${n.mobileArrows===!0?"":"out"}-arrows`+(n.dense===!0?" q-tabs--dense":"")+(n.shrink===!0?" col-shrink":"")+(n.stretch===!0?" self-stretch":"")),he=d(()=>"q-tabs__content scroll--mobile row no-wrap items-center self-stretch hide-scrollbar relative-position "+ve.value+(n.contentClass!==void 0?` ${n.contentClass}`:"")),k=d(()=>n.vertical===!0?{container:"height",content:"offsetHeight",scroll:"scrollHeight"}:{container:"width",content:"offsetWidth",scroll:"scrollWidth"}),B=d(()=>n.vertical!==!0&&x.lang.rtl===!0),W=d(()=>We===!1&&B.value===!0);P(B,L),P(()=>n.modelValue,e=>{z({name:e,setCurrent:!0,skipEmit:!0})}),P(()=>n.outsideArrows,M);function z({name:e,setCurrent:t,skipEmit:o}){w.value!==e&&(o!==!0&&n["onUpdate:modelValue"]!==void 0&&D("update:modelValue",e),(t===!0||n["onUpdate:modelValue"]===void 0)&&(ge(w.value,e),w.value=e))}function M(){ae(()=>{K({width:S.value.offsetWidth,height:S.value.offsetHeight})})}function K(e){if(k.value===void 0||u.value===null)return;const t=e[k.value.container],o=Math.min(u.value[k.value.scroll],Array.prototype.reduce.call(u.value.children,(i,l)=>i+(l[k.value.content]||0),0)),r=t>0&&o>t;y.value=r,r===!0&&le(L),U.value=t<parseInt(n.breakpoint,10)}function ge(e,t){const o=e!=null&&e!==""?c.find(i=>i.name.value===e):null,r=t!=null&&t!==""?c.find(i=>i.name.value===t):null;if($===!0)$=!1;else if(o&&r){const i=o.tabIndicatorRef.value,l=r.tabIndicatorRef.value;_!==null&&(clearTimeout(_),_=null),i.style.transition="none",i.style.transform="none",l.style.transition="none",l.style.transform="none";const a=i.getBoundingClientRect(),s=l.getBoundingClientRect();l.style.transform=n.vertical===!0?`translate3d(0,${a.top-s.top}px,0) scale3d(1,${s.height?a.height/s.height:1},1)`:`translate3d(${a.left-s.left}px,0,0) scale3d(${s.width?a.width/s.width:1},1,1)`,re(()=>{_=setTimeout(()=>{_=null,l.style.transition="transform .25s cubic-bezier(.4, 0, .2, 1)",l.style.transform="none"},70)})}r&&y.value===!0&&q(r.rootRef.value)}function q(e){const{left:t,width:o,top:r,height:i}=u.value.getBoundingClientRect(),l=e.getBoundingClientRect();let a=n.vertical===!0?l.top-r:l.left-t;if(a<0){u.value[n.vertical===!0?"scrollTop":"scrollLeft"]+=Math.floor(a),L();return}a+=n.vertical===!0?l.height-i:l.width-o,a>0&&(u.value[n.vertical===!0?"scrollTop":"scrollLeft"]+=Math.ceil(a),L())}function L(){const e=u.value;if(e===null)return;const t=e.getBoundingClientRect(),o=n.vertical===!0?e.scrollTop:Math.abs(e.scrollLeft);B.value===!0?(E.value=Math.ceil(o+t.width)<e.scrollWidth-1,F.value=o>0):(E.value=o>0,F.value=n.vertical===!0?Math.ceil(o+t.height)<e.scrollHeight:Math.ceil(o+t.width)<e.scrollWidth)}function N(e){C!==null&&clearInterval(C),C=setInterval(()=>{Te(e)===!0&&b()},5)}function X(){N(W.value===!0?Number.MAX_SAFE_INTEGER:0)}function G(){N(W.value===!0?0:Number.MAX_SAFE_INTEGER)}function b(){C!==null&&(clearInterval(C),C=null)}function be(e,t){const o=Array.prototype.filter.call(u.value.children,s=>s===t||s.matches&&s.matches(".q-tab.q-focusable")===!0),r=o.length;if(r===0)return;if(e===36)return q(o[0]),o[0].focus(),!0;if(e===35)return q(o[r-1]),o[r-1].focus(),!0;const i=e===(n.vertical===!0?38:37),l=e===(n.vertical===!0?40:39),a=i===!0?-1:l===!0?1:void 0;if(a!==void 0){const s=B.value===!0?-1:1,f=o.indexOf(t)+a*s;return f>=0&&f<r&&(q(o[f]),o[f].focus({preventScroll:!0})),!0}}const me=d(()=>W.value===!0?{get:e=>Math.abs(e.scrollLeft),set:(e,t)=>{e.scrollLeft=-t}}:n.vertical===!0?{get:e=>e.scrollTop,set:(e,t)=>{e.scrollTop=t}}:{get:e=>e.scrollLeft,set:(e,t)=>{e.scrollLeft=t}});function Te(e){const t=u.value,{get:o,set:r}=me.value;let i=!1,l=o(t);const a=e<l?-1:1;return l+=a*5,l<0?(i=!0,l=0):(a===-1&&l<=e||a===1&&l>=e)&&(i=!0,l=e),r(t,l),L(),i}function J(e,t){for(const o in e)if(e[o]!==t[o])return!1;return!0}function we(){let e=null,t={matchedLen:0,queryDiff:9999,hrefLen:0};const o=c.filter(a=>a.routeData!==void 0&&a.routeData.hasRouterLink.value===!0),{hash:r,query:i}=T.$route,l=Object.keys(i).length;for(const a of o){const s=a.routeData.exact.value===!0;if(a.routeData[s===!0?"linkIsExactActive":"linkIsActive"].value!==!0)continue;const{hash:f,query:H,matched:Le,href:Se}=a.routeData.resolvedLink.value,Q=Object.keys(H).length;if(s===!0){if(f!==r||Q!==l||J(i,H)===!1)continue;e=a.name.value;break}if(f!==""&&f!==r||Q!==0&&J(H,i)===!1)continue;const m={matchedLen:Le.length,queryDiff:l-Q,hrefLen:Se.length-f.length};if(m.matchedLen>t.matchedLen){e=a.name.value,t=m;continue}else if(m.matchedLen!==t.matchedLen)continue;if(m.queryDiff<t.queryDiff)e=a.name.value,t=m;else if(m.queryDiff!==t.queryDiff)continue;m.hrefLen>t.hrefLen&&(e=a.name.value,t=m)}if(e===null&&c.some(a=>a.routeData===void 0&&a.name.value===w.value)===!0){$=!1;return}z({name:e,setCurrent:!0})}function _e(e){if(se(),I.value!==!0&&S.value!==null&&e.target&&typeof e.target.closest=="function"){const t=e.target.closest(".q-tab");t&&S.value.contains(t)===!0&&(I.value=!0,y.value===!0&&q(t))}}function ye(){ie(()=>{I.value=!1},30)}function A(){Z.avoidRouteWatcher===!1?O(we):ue()}function Y(){if(g===void 0){const e=P(()=>T.$route.fullPath,A);g=()=>{e(),g=void 0}}}function Ce(e){c.push(e),V.value++,M(),e.routeData===void 0||T.$route===void 0?O(()=>{if(y.value===!0){const t=w.value,o=t!=null&&t!==""?c.find(r=>r.name.value===t):null;o&&q(o.rootRef.value)}}):(Y(),e.routeData.hasRouterLink.value===!0&&A())}function qe(e){c.splice(c.indexOf(e),1),V.value--,M(),g!==void 0&&e.routeData!==void 0&&(c.every(t=>t.routeData===void 0)===!0&&g(),A())}const Z={currentModel:w,tabProps:ce,hasFocus:I,hasActiveTab:fe,registerTab:Ce,unregisterTab:qe,verifyRouteModel:A,updateModel:z,onKbdNavigate:be,avoidRouteWatcher:!1};Re($e,Z);function p(){_!==null&&clearTimeout(_),b(),g!==void 0&&g()}let ee,$;return Ie(p),ke(()=>{ee=g!==void 0,p()}),Be(()=>{ee===!0&&(Y(),$=!0,A()),M()}),()=>R("div",{ref:S,class:de.value,role:"tablist",onFocusin:_e,onFocusout:ye},[R(Ve,{onResize:K}),R("div",{ref:u,class:he.value,onScroll:L},Me(h.default)),R(ne,{class:"q-tabs__arrow q-tabs__arrow--left absolute q-tab__icon"+(E.value===!0?"":" q-tabs__arrow--faded"),name:n.leftIcon||x.iconSet.tabs[n.vertical===!0?"up":"left"],onMousedownPassive:X,onTouchstartPassive:X,onMouseupPassive:b,onMouseleavePassive:b,onTouchendPassive:b}),R(ne,{class:"q-tabs__arrow q-tabs__arrow--right absolute q-tab__icon"+(F.value===!0?"":" q-tabs__arrow--faded"),name:n.rightIcon||x.iconSet.tabs[n.vertical===!0?"down":"right"],onMousedownPassive:G,onTouchstartPassive:G,onMouseupPassive:b,onMouseleavePassive:b,onTouchendPassive:b})])}});const Oe={};function Ue(n,h){return De(),xe(je,{class:"a-tabs",align:"left","indicator-color":"transparent",breakpoint:"0",dense:""},{default:Ee(()=>[h[0]||(h[0]=oe("div",{class:"space"},null,-1)),Fe(n.$slots,"default",{},void 0,!0),h[1]||(h[1]=oe("div",{class:"space"},null,-1))]),_:3})}const Je=ze(Oe,[["render",Ue],["__scopeId","data-v-91fcbe25"]]);export{Je as default};
