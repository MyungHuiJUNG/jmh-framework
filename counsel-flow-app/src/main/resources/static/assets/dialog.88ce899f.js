import{W as r}from"./index.02f7c95d.js";import s from"./CommonPopup.2b0ee10b.js";function u(n,t=!0,e=!1){return new Promise(o=>{r.create({component:s,componentProps:{msg:n,showOkButton:t,showCancelButton:e}}).onOk(()=>{o()}).onCancel(()=>{o()})})}function i(n,t=!0,e=!0){return new Promise((o,a)=>{r.create({component:s,componentProps:{msg:n,showOkButton:t,showCancelButton:e}}).onOk(()=>{o(!0)}).onCancel(()=>{o(!1)})})}export{i as a,u as s};