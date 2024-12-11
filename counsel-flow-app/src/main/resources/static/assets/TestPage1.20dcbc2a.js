import{e as C,bO as g,bP as _,h as k,W as f,bQ as d,bR as x,o as b,Y as v,z as h,a as i,E as s,a0 as m}from"./index.02f7c95d.js";import P from"./AppPopupBase.f9fc2ca7.js";import{A as u}from"./app-util.f29d8347.js";import L from"./TestPagePopup.b1523941.js";import N from"./TestPageWinPopup.0e7be7f8.js";import{_ as T}from"./_plugin-vue_export-helper.cdc0426e.js";import"./use-dialog-plugin-component.234e0905.js";import"./QSelect.b17c746f.js";import"./QItem.1bce08e7.js";import"./QMenu.3c9cf304.js";import"./position-engine.53490cc8.js";import"./rtl.276c3f1b.js";import"./format.2cae61da.js";const B='<g transform="translate(-20,-20)"><path d="M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z" fill="currentColor"><animateTransform attributeName="transform" type="rotate" from="90 50 50" to="0 50 50" dur="1s" repeatCount="indefinite"></animateTransform></path></g><g transform="translate(20,20) rotate(15 50 50)"><path d="M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z" fill="currentColor"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="90 50 50" dur="1s" repeatCount="indefinite"></animateTransform></path></g>',A=C({name:"QSpinnerGears",props:g,setup(o){const{cSize:t,classes:n}=_(o);return()=>k("svg",{class:n.value,width:t.value,height:t.value,viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid",xmlns:"http://www.w3.org/2000/svg",innerHTML:B})}});function e(){}e.showAlert=function(o,t,n){f.create({title:o,message:t,ok:"\uD655\uC778"})};e.showConfirm=function(o,t){const n={yesFunc:null,noFunc:null};return f.create({title:o,message:t,cancel:"\uCDE8\uC18C",ok:"\uD655\uC778"}).onOk(()=>{n.yesFunc()}).onCancel(()=>{n.noFunc()}),{yes:function(r){return n.yesFunc=r,this},no:function(r){return n.noFunc=r,this}}};e.showBlock=function(o,t){d.show({spinner:t?A:null,message:o!==null?o:null})};e.hideBlock=function(){d.hide()};e.openWindow=function(o){const t=o.width,n=o.height,r=`/view/winpopup?comp=${o.component.__name}`,a=window.open(r,"_blank",`width=${t},height=${n}`);localStorage.setItem("flow-winpopup-props",JSON.stringify(o.props)),a.focus()};e.showNotify=function(o,t){let n=u.isEmpty(t.color)?"white":t.color,r=u.isEmpty(t.textColor)?"black":t.textColor;x.create({message:o,color:n,textColor:r,position:"center",timeout:0,actions:[{icon:"close","aria-label":"Dismiss"}]})};e.openLayered=function(o){f.create({component:P,componentProps:{title:o.title,width:o.width,height:o.height,component:o.component,propData:o.propData,position:o.position,top:o.top,left:o.left}}).onOk(t=>{o.callbackFunc(t)}).onCancel(()=>{})};const F={class:"row"},M={class:"col-6"},S={class:"row",id:"test"},z={__name:"TestPage1",setup(o){function t(){e.openLayered({title:"\uD14C\uC2A4\uD2B8 \uD398\uC774\uC9C0",component:L,width:500,height:500,callbackFunc:c=>{console.log(c),e.showAlert("Return Value : ","value1: "+c.test+", value2: "+c.test1)}})}function n(){e.showConfirm("\uC54C\uB9BC","\uC218\uB77D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?").yes(()=>{a("Confirm: Yes")}).no(()=>{a("Confirm: No")})}function r(){e.showNotify("Nofify",{color:"black",textColor:"white"})}function a(c,l){let p="TEST \uBA54\uC138\uC9C0 \uC785\uB2C8\uB2E4.";u.isEmpty(c)||(p=c),e.showAlert("\uC54C\uB9BC\uC785\uB2C8\uB2F9.",p)}function w(){e.showBlock("\uC900\uBE44\uC911 \uC785\uB2C8\uB2E4...",!0),setTimeout(()=>{e.hideBlock()},1e3)}function y(){let l={component:N,props:{data1:"1",data2:"2"},width:500,height:500};e.openWindow(l)}return(c,l)=>(b(),v("div",F,[h("div",M,[h("div",S,[i(s,{color:"primary",label:"Layered Popup",style:{width:"100px"},onClick:t}),l[1]||(l[1]=m(" \xA0 ")),i(s,{color:"primary",label:"Confirm Popup",style:{width:"100px"},onClick:n}),l[2]||(l[2]=m(" \xA0 ")),i(s,{color:"primary",label:"Alert Popup",style:{width:"100px"},onClick:l[0]||(l[0]=p=>a(""))}),l[3]||(l[3]=m(" \xA0 ")),i(s,{color:"primary",label:"Block",style:{width:"100px"},onClick:w}),i(s,{color:"primary",label:"Notify",style:{width:"100px"},onClick:r}),i(s,{color:"primary",label:"Window Popup",style:{width:"100px"},onClick:y})])])]))}},U=T(z,[["__scopeId","data-v-2699a6df"]]);export{U as default};
