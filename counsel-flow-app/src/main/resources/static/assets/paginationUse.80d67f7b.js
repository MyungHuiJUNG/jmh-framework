import h from"./TabulatorGrid.9c80b09d.js";import g from"./ABtn.e24d7e8a.js";import{u as p}from"./userApi.abe7b8c8.js";import{F as m}from"./FlowSystemCode.7be7ce49.js";import{r as o,y as z,o as A,Y as S,a as s,z as v}from"./index.02f7c95d.js";/* empty css                                                             */import"./_plugin-vue_export-helper.cdc0426e.js";import"./axios.816e1a60.js";const _={class:"col-auto column no-wrap q-mb-xs q-pa-xs a-border"},w={class:"row justify-end q-gutter-xs q-pt-xs"},B={__name:"paginationUse",setup(y){const c=m.USE_CD.USE,d=[{title:"#",field:"entityId",hozAlign:"center",headerHozAlign:"center",headerSort:!1},{title:"\uC870\uC9C1 1depth",field:"organization",hozAlign:"center",headerHozAlign:"center",headerSort:!1,formatter:function(e){const t=e.getValue();return t&&t.path&&t.path.split(".")[0]||""}},{title:"\uC870\uC9C1 2depth",field:"organization",hozAlign:"center",headerHozAlign:"center",headerSort:!1,formatter:function(e){const t=e.getValue();return t&&t.path&&t.path.split(".")[1]||""}},{title:"\uC870\uC9C1 3depth",field:"organization",hozAlign:"center",headerHozAlign:"center",headerSort:!1,formatter:function(e){const t=e.getValue();return t&&t.path&&t.path.split(".")[2]||""}},{title:"\uC0AC\uC6A9\uC790\uBA85",field:"name",hozAlign:"center",headerHozAlign:"center",headerSort:!1},{title:"\uC544\uC774\uB514",field:"id",hozAlign:"center",headerHozAlign:"center",headerSort:!1},{title:"\uC0AC\uC6A9\uC5EC\uBD80",field:"useTypeCode",hozAlign:"center",headerHozAlign:"center",headerSort:!1,formatter:function(e){const t=e.getValue();return(t&&t.value?t.value:t)===c?"\uC0AC\uC6A9":"\uC0AC\uC6A9 \uC548\uD568"}},{title:"CTI ID",field:"ctiLoginId",hozAlign:"center",headerHozAlign:"center",headerSort:!1},{title:"\uB0B4\uC120\uBC88\uD638",field:"ctiExtension",hozAlign:"center",headerHozAlign:"center",headerSort:!1}],n=o([]),r=o(0);function l(e){const t={page:e,size:10};return p.getUsers(t).then(a=>{if(a.status===200)return{data:a.data.content,last:a.data.last}}).catch(a=>{a.response&&a.response.data.message?alert(a.response.data.message):alert("\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.")})}async function u(){r.value=0;const e=await l(r.value);e&&e.data.length>0&&(console.log(e),n.value=e.data,r.value+=1)}const i=o(!1);async function f(){try{if(!i.value){const e=await l(r.value);e&&e.data&&(n.value=[...n.value,...e.data],r.value+=1,i.value=e.last)}}catch{alert("\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.")}}return z(()=>{u()}),(e,t)=>(A(),S("div",_,[s(h,{rows:n.value,height:"300px",columns:d,onRowSelected:e.rowSelected,infiniteScroll:f,selectableRows:1,class:"my-grid"},null,8,["rows","onRowSelected"]),v("div",w,[s(g,{label:"\uC2E0\uADDC"})])]))}};export{B as default};