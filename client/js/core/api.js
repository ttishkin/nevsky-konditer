/* js/core/api.js — интеграция с бэкендом (необязательная, с фолбэком на localStorage). */
(function(){
  "use strict";
  var auto=(location.protocol==="http:"||location.protocol==="https:")?"":"http://localhost:3000";
  var API=(window.APP_CONFIG&&APP_CONFIG.apiBaseOverride!=null)?APP_CONFIG.apiBaseOverride:auto;
  try{
    fetch(API+"/api/products").then(function(r){return r.ok?r.json():null;}).then(function(list){
      if(Array.isArray(list)&&list.length&&typeof P!=="undefined"){P.length=0;list.forEach(function(p){P.push(p);});if(typeof render==="function")render();if(window.console)console.log("[НК] каталог с сервера:",list.length);}
    }).catch(function(){});
  }catch(e){}
  document.addEventListener("click",function(e){
    if(!e.target.closest('[data-act="pay"]'))return;
    setTimeout(function(){try{if(typeof S==="undefined"||!S.orders||!S.orders.length)return;fetch(API+"/api/orders",{method:"POST",headers:Object.assign({"Content-Type":"application/json"},S.token?{Authorization:"Bearer "+S.token}:{}),body:JSON.stringify(S.orders[0])}).catch(function(){});}catch(e){}},50);
  });
})();
