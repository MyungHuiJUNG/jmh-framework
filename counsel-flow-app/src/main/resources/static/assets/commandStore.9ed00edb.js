import{d as C,g as u}from"./index.02f7c95d.js";import{api as p}from"./axios.816e1a60.js";import{g as y}from"./header.10137493.js";import{u as h}from"./authStore.fadf8446.js";import{F as s}from"./FlowSystemCode.7be7ce49.js";const I=e=>p.get(`/rest/api/v1/users/${e}/command/commands`,y()),l=(e,t)=>p.post(`/rest/api/v1/users/${e}/command/commands`,t,{headers:{...y().headers,"Content-Type":"application/x-www-form-urlencoded"}}),E=(e,t,a)=>p.put(`/rest/api/v1/users/${e}/command/commands/${t}`,a,{headers:{...y().headers,"Content-Type":"application/x-www-form-urlencoded"}}),_=(e,t)=>{const a={commandEntityIds:t};return p.delete(`/rest/api/v1/users/${e}/command/commands`,{params:a,...y()})},S=(e,t)=>{const a={entities:t};return p.post(`/rest/api/v1/commands/${e}/short-cut-key/short-cut-keys/multiple`,a,{headers:{...y().headers,"Content-Type":"application/json"}})},r={getCommands:I,saveCommand:l,updateCommand:E,deleteCommands:_,saveShortCutKeys:S},f=h(),R=C("commandStore",{state:()=>({userEntityId:u(()=>f.entityId),commandMap:new Map,initialLoaded:!1}),actions:{async loadCommand(){try{const e=await r.getCommands(this.userEntityId);if(e.data.length!==20)for(let t=0;t<10;t++){const a=[s.COMMAND_TYPE.COUNSEL_TYPE,s.COMMAND_TYPE.TEXT];for(const o of a){const d={"entity.commandType":o,"entity.user.entityId":this.userEntityId},n=await r.saveCommand(this.userEntityId,d);if(n.status===200){const m=n.data.entityId,c=t<9?`${t+1}`:"0",T=[{keyType:s.SHORT_CUT_KEY_TYPE.SPECIFIC,customKey:s.SHORT_CUT_SPECIFIC.CTRL,orderNumber:1,personalCommand:{entityId:m}},{keyType:s.SHORT_CUT_KEY_TYPE.DIGIT,customKey:c,orderNumber:2,personalCommand:{entityId:m}}];await r.saveShortCutKeys(m,T);const i=`${s.SHORT_CUT_KEY_TYPE.SPECIFIC}-${s.SHORT_CUT_SPECIFIC.CTRL}-${s.SHORT_CUT_KEY_TYPE.DIGIT}-${c}`;this.commandMap.has(i)||this.commandMap.set(i,[]),this.commandMap.get(i).push({commandType:o,command:null,description:null,entityId:m})}}}else this.createShortCupMap(e.data)}catch(e){throw e}},async fetchInitialData(){if(this.initialLoaded)return Promise.resolve();this.initialLoaded=!0;try{const e=await r.getCommands(this.userEntityId);if(e.data.length!==20)for(let t=0;t<10;t++){const a=[s.COMMAND_TYPE.COUNSEL_TYPE,s.COMMAND_TYPE.TEXT];for(const o of a){const d={"entity.commandType":o,"entity.user.entityId":this.userEntityId},n=await r.saveCommand(this.userEntityId,d);if(n.status===200){const m=n.data.entityId,c=t<9?`${t+1}`:"0",T=[{keyType:s.SHORT_CUT_KEY_TYPE.SPECIFIC,customKey:s.SHORT_CUT_SPECIFIC.CTRL,orderNumber:1,personalCommand:{entityId:m}},{keyType:s.SHORT_CUT_KEY_TYPE.DIGIT,customKey:c,orderNumber:2,personalCommand:{entityId:m}}];await r.saveShortCutKeys(m,T);const i=`${s.SHORT_CUT_KEY_TYPE.SPECIFIC}-${s.SHORT_CUT_SPECIFIC.CTRL}-${s.SHORT_CUT_KEY_TYPE.DIGIT}-${c}`;this.commandMap.has(i)||this.commandMap.set(i,[]),this.commandMap.get(i).push({commandType:o,command:null,description:null,entityId:m})}}}else this.createShortCupMap(e.data)}catch(e){throw this.initialLoaded=!1,e}},createShortCupMap(e){e.forEach(t=>{let a="";t.shortCutKeys.forEach(n=>{a+=`${n.keyType}-${n.customKey}-`}),a=a.slice(0,-1),this.commandMap.has(a)||this.commandMap.set(a,[]);const o=this.commandMap.get(a),d=o.findIndex(n=>n.commandType===t.commandType);d!==-1?o[d]={commandType:t.commandType,command:t.command,description:t.description,entityId:t.entityId}:o.push({commandType:t.commandType,command:t.command,description:t.description,entityId:t.entityId}),this.commandMap.set(a,o)})},clearInitialData(){this.initialLoaded=!1,this.commandMap=new Map}},getters:{}});export{r as c,R as u};
