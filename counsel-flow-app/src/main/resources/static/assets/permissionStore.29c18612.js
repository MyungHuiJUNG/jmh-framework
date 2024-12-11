import{d as t}from"./index.02f7c95d.js";import{p as e}from"./permissionApi.ffe0b82d.js";import{h as r}from"./errorHandler.5efe1eb1.js";const d=t("permissionStore",{state:()=>({entityId:null,menuIds:[],roleIds:[]}),actions:{setEntityId(s){this.entityId=s},setMenuIds(s){this.menuIds=s},setRoleIds(s){this.roleIds=s},clearIds(){this.menuIds=[],this.roleIds=[],this.entityId=null}}}),l=t("permissionRoleStore",{state:()=>({permissions:[],initialLoaded:!1}),actions:{async loadPermissions(s){if(!s){this.permissions=[];return}try{const i=await e.getRolesByPermission(s);i.status===200&&(this.permissions=i.data)}catch(i){r(i)}},fetchInitialData(s){if(!s){this.permissions=[];return}return this.initialLoaded?Promise.resolve():(this.initialLoaded=!0,e.getRolesByPermission(s).then(i=>{this.permissions=i.data}).catch(i=>{throw this.initialLoaded=!1,i}))},clearInitialData(){this.initialLoaded=!1,this.permissions=[]},hasPermission(s){return this.permissions.some(i=>i.code===s)}},getters:{}});export{d as a,l as u};