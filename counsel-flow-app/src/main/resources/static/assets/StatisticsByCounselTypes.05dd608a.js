import z from"./TabulatorGrid.9c80b09d.js";import C from"./ATitleBar.bbf1d9a4.js";import w from"./StatisticsByCounselTypesSearchBar.cbf03dff.js";import{u as S}from"./counselTypeStore.5faa86f9.js";import{u as E}from"./permissionStore.29c18612.js";import{s as v}from"./dialog.88ce899f.js";import{s as x}from"./statisticApi.e43184a6.js";import{h as k}from"./errorHandler.5efe1eb1.js";import{F as H}from"./FlowRoleCode.12cdb02e.js";import B from"./ALoadingSpinner.ca275fb8.js";import{r as i,g as F,y as R,o as V,Y as L,z as d,a as l}from"./index.02f7c95d.js";import"./ClosePopup.daa62b28.js";import"./ASelect.a02a29e0.js";import"./QItem.1bce08e7.js";import"./QSelect.b17c746f.js";import"./QMenu.3c9cf304.js";import"./position-engine.53490cc8.js";import"./rtl.276c3f1b.js";import"./format.2cae61da.js";import"./_plugin-vue_export-helper.cdc0426e.js";import"./AInput.398f059b.js";import"./ABtn.e24d7e8a.js";/* empty css                                                             */import"./ACheckbox.923db872.js";import"./axios.816e1a60.js";import"./header.10137493.js";import"./permissionApi.ffe0b82d.js";import"./CommonPopup.2b0ee10b.js";import"./use-dialog-plugin-component.234e0905.js";import"./authStore.fadf8446.js";import"./counsel-hub.145170b4.js";const M={class:"column no-wrap fit a-border q-pa-xs",style:{"min-height":"680px"}},P={class:"col-auto q-mb-xs"},b={class:"col column no-wrap a-border q-pa-xs"},q="\uC0C1\uB2F4\uC720\uD615\uBCC4 \uD2F0\uCF13\uD1B5\uACC4",Te={__name:"StatisticsByCounselTypes",setup(I){const r=i(!1),s=i(null),a=S(),p=E(),f=F(()=>p.hasPermission(H.STATISTICS_COUNSEL_TYPE_ROLE.READ)),c=i([]),g=[{title:"\uB0A0\uC9DC",field:"fromDate",headerHozAlign:"center",hozAlign:"center",width:200,formatter:function(o){const e=o.getData();return e.fromDate+` ~ ${e.toDate}`}},{title:"\uC0C1\uB2F4\uC720\uD615(\uB300)",field:"counselTypeCodeLarge",headerHozAlign:"center",hozAlign:"left",formatter:function(o){var t,n;const e=o.getValue()||null;return(n=(t=a.counselTypes.get(e))==null?void 0:t.name)!=null?n:e}},{title:"\uC0C1\uB2F4\uC720\uD615(\uC911)",field:"counselTypeCodeMedium",headerHozAlign:"center",hozAlign:"left",formatter:function(o){var t,n;const e=o.getValue()||null;return(n=(t=a.counselTypes.get(e))==null?void 0:t.name)!=null?n:e}},{title:"\uC0C1\uB2F4\uC720\uD615(\uC18C)",field:"counselTypeCodeSmall",headerHozAlign:"center",hozAlign:"left",formatter:function(o){var t,n;const e=o.getValue()||null;return(n=(t=a.counselTypes.get(e))==null?void 0:t.name)!=null?n:e}},{title:"\uBC1C\uD589\uD2F0\uCF13\uC218",field:"totalTicketCount",headerHozAlign:"center",hozAlign:"center"},{title:"\uBBF8\uCC98\uB9AC\uD2F0\uCF13\uC218",field:"unprocessedTicketCount",headerHozAlign:"center",hozAlign:"center"},{title:"\uCC98\uB9AC\uC911\uD2F0\uCF13\uC218",field:"inProcessTicketCount",headerHozAlign:"center",hozAlign:"center"},{title:"\uC644\uB8CC\uD2F0\uCF13\uC218",field:"completedTicketCount",headerHozAlign:"center",hozAlign:"center"},{title:"\uCC98\uB9AC\uC728",field:"processingRate",headerHozAlign:"center",hozAlign:"center",formatter:function(o){const e=o.getData();return(e.completedTicketCount/e.totalTicketCount*100).toFixed(1)+"%"}},{title:"\uC774\uAD00\uD2F0\uCF13\uC218",field:"transmitTicketCount",headerHozAlign:"center",hozAlign:"center"}],h=m(new Date(new Date().setMonth(new Date().getMonth()-1))),A=m(new Date),T=i({fromDate:h,toDate:A});R(()=>{_()});function m(o){const e=new Date(o);let t=""+(e.getMonth()+1),n=""+e.getDate();const D=e.getFullYear();return t.length<2&&(t="0"+t),n.length<2&&(n="0"+n),[D,t,n].join("-")}function u(o){if(!f.value){v("\uC0C1\uB2F4\uC720\uD615\uBCC4 \uD1B5\uACC4 \uC870\uD68C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");return}r.value=!0,x.getStatisticsByCounselType(o).then(e=>{c.value=e.data}).catch(e=>{k(e)}).finally(()=>{r.value=!1})}function _(){u(T.value)}function y(){s.value.excelDownload(q)}return(o,e)=>(V(),L("div",M,[d("div",P,[l(w,{onSearch:u,onExcelDownload:y})]),d("div",b,[l(C,{title:"\uC0C1\uB2F4\uC720\uD615\uBCC4 \uD2F0\uCF13 \uD1B5\uACC4",class:"col-auto full-width q-mb-xs"}),l(z,{rows:c.value,columns:g,class:"col",ref_key:"grid",ref:s},null,8,["rows"])]),l(B,{modelValue:r.value,"onUpdate:modelValue":e[0]||(e[0]=t=>r.value=t)},null,8,["modelValue"])]))}};export{Te as default};