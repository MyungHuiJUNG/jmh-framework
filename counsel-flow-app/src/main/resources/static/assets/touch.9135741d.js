const r={left:!0,right:!0,up:!0,down:!0,horizontal:!0,vertical:!0},o=Object.keys(r);r.all=!0;function n(t){const e={};for(const i of o)t[i]===!0&&(e[i]=!0);return Object.keys(e).length===0?r:(e.horizontal===!0?e.left=e.right=!0:e.left===!0&&e.right===!0&&(e.horizontal=!0),e.vertical===!0?e.up=e.down=!0:e.up===!0&&e.down===!0&&(e.vertical=!0),e.horizontal===!0&&e.vertical===!0&&(e.all=!0),e)}const u=["INPUT","TEXTAREA"];function l(t,e){return e.event===void 0&&t.target!==void 0&&t.target.draggable!==!0&&typeof e.handler=="function"&&u.includes(t.target.nodeName.toUpperCase())===!1&&(t.qClonedBy===void 0||t.qClonedBy.indexOf(e.uid)===-1)}export{n as g,l as s};
