/* js/features/orders-scanner.js
   Заказы, экраны about/план, сканер, дополнение экранов (v2)
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */

S.orders = LS.get("nk_orders", []);
S.plan = LS.get("nk_plan", null);

function pushOrder(){
  var ids=Object.keys(S.cart).filter(function(k){return S.cart[k]>0;});
  if(!ids.length)return;
  S.orders.unshift({no:"NK"+String(Date.now()).slice(-6),ts:Date.now(),items:ids.map(function(k){return{id:+k,q:S.cart[k]};}),total:payable()});
  S.orders[0].bonus=Math.round(cartTotal()*cashbackPct()/100);var _sp=bonusSpend();LS.set("nk_orders",S.orders);S.promo=0;S.points=Math.max(0,(S.points||0)-_sp)+S.orders[0].bonus;S.useBonus=false;LS.set("nk_pts",S.points);
}
function fmtDate(ts){var d=new Date(ts);var m=["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];return d.getDate()+" "+m[d.getMonth()]+" "+d.getFullYear()+", "+d.getHours()+":"+String(d.getMinutes()).padStart(2,"0");}
function thumbMini(p){var ct=CATS[p.cat];var u=IMG[p.id];
  if(u)return '<div class="ic" style="background:#fff;overflow:hidden;padding:3px"><img src="'+u+'" style="width:100%;height:100%;object-fit:contain" onerror="imgFallback(this)"><span class="gf" style="display:none">'+ct.gl+'</span></div>';
  return '<div class="ic" style="background:'+hexA(ct.c,.20)+'">'+ct.gl+'</div>';}

function renderOrders(){
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Профиль</div><div class="title">История заказов</div><div class="spacer"></div></div>';
  if(!S.orders.length){h+='<div class="empty"><span class="gl">🧾</span>Заказов пока нет.<br>Оформите заказ в корзине — он появится здесь.</div>';return h;}
  S.orders.forEach(function(o){
    h+='<div class="block" style="margin:10px 16px">';
    h+='<div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-weight:700">Заказ '+o.no+'</div><div class="muted" style="font-size:12px">'+fmtDate(o.ts)+'</div></div><div class="h1" style="font-size:20px">'+money(o.total)+'</div></div>';
    h+='<div style="margin-top:12px;display:flex;flex-direction:column;gap:9px">';
    o.items.forEach(function(it){var p=prod(it.id);if(!p)return;h+='<div style="display:flex;align-items:center;gap:10px">'+thumbMini(p)+'<div style="flex:1;font-size:14px">'+esc(p.n)+'</div><div class="muted" style="font-size:13px">×'+it.q+'</div></div>';});
    h+='</div>'+orderStatus(o)+'<button class="btn sec" style="margin-top:12px" data-act2="reorder" data-id="'+o.ts+'">Повторить заказ</button></div>';
  });
  return h;
}

function renderAbout(){
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Профиль</div><div class="title">О приложении</div><div class="spacer"></div></div>';
  h+='<div class="pad" style="text-align:center;padding-top:8px"><div class="brandbadge" style="margin:0 auto 14px;width:92px;height:92px;border-radius:22px"><img src="https://konditer.net/bitrix/templates/nk/images/logo.png" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><span class="brandmono" style="display:none;font-size:36px">НК</span></div>';
  h+='<div class="h1" style="font-size:22px">Невский Кондитер · ЗОЖ</div><div class="muted" style="margin-top:4px">Версия 1.0 · прототип</div></div>';
  h+='<div class="block"><h3>О проекте</h3><p>Дипломный проект: мобильное приложение по организации правильного питания на базе ассортимента ГК «Невский Кондитер». Помогает следить за калориями и БЖУ, составлять дневной план полезных перекусов и заказывать ЗОЖ-продукцию фабрики.</p></div>';
  h+='<div class="block"><h3>Как это работает</h3><p>1. Рассчитываем суточную норму калорий по профилю.<br>2. Ведём дневник питания и показываем остаток нормы.<br>3. Подбираем полезные перекусы, которые в неё помещаются, и собираем заказ.</p></div>';
  h+='<div class="block"><h3>Технологии</h3><p>Кроссплатформенное веб-приложение (PWA) в тёмной теме в стиле iOS. Каталог и значения КБЖУ — на основе данных «Невского Кондитера».</p></div>';
  h+='<div class="block"><h3>Важно</h3><p>Значения КБЖУ ориентировочные (открытые источники) и уточняются по упаковке. Регистрация и оплата в прототипе — демонстрационные.</p></div>';
  h+='<div class="muted" style="text-align:center;padding:14px 16px 26px">Выполнил: Слава · 2026<br>Практика в ГК «Невский Кондитер»</div>';
  return h;
}

function planBudget(){return Math.max(250,Math.min(600,Math.round(norm()*0.2)));}
function buildPlan(){
  var budget=planBudget();var slots=["Завтрак","Перекус","Полдник","Ужин"];
  var pool=P.filter(function(p){return portionKcal(p)<=budget;});
  for(var i=pool.length-1;i>0;i--){var j=(Math.random()*(i+1))|0;var t=pool[i];pool[i]=pool[j];pool[j]=t;}
  var chosen=[],sum=0;
  for(var k=0;k<pool.length&&chosen.length<slots.length;k++){var pk=portionKcal(pool[k]);if(sum+pk<=budget){chosen.push(pool[k].id);sum+=pk;}}
  return {budget:budget,sum:sum,items:chosen.map(function(id,ix){return {slot:slots[ix]||"Перекус",id:id};})};
}
function renderPlan(){
  if(!S.plan)S.plan=buildPlan();var pl=S.plan;
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Дневник</div><div class="title">План на день</div><div class="spacer"></div></div>';
  h+='<div class="pad" style="padding-bottom:4px"><div class="block" style="margin-top:0"><p>Полезные перекусы на день в рамках <b>'+pl.budget+' ккал</b> (≈20% нормы). Сейчас в плане: <b>'+pl.sum+' ккал</b>.</p></div></div>';
  if(!pl.items.length){h+='<div class="empty"><span class="gl">📋</span>Не удалось собрать план.<br>Обновите попытку.</div>';}
  else{h+='<div class="listcard">';
    pl.items.forEach(function(it){var p=prod(it.id);if(!p)return;h+='<div class="row" data-act="open" data-id="'+p.id+'">'+thumbMini(p)+'<div style="flex:1"><div class="gname">'+esc(p.n)+'</div><div class="sub">'+it.slot+' · '+portionKcal(p)+' ккал</div></div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>';});
    h+='</div>';}
  h+='<div class="pad"><button class="btn" data-act2="plan-apply">Добавить всё в дневник</button><button class="btn sec" style="margin-top:8px" data-act2="plan-regen">Обновить план</button></div>';
  return h;
}
function applyPlan(){if(!S.plan)return;S.plan.items.forEach(function(it){var p=prod(it.id);if(p)S.diary.push({id:it.id,grams:p.g,meal:(it.slot==="Полдник"?"Перекус":it.slot)});});save();S.stack=[];S.tab="diary";render();toast("План добавлен в дневник");}

var _cam=null;
function startCam(){try{var v=document.getElementById("cam");if(!v||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return;
  navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(function(st){_cam=st;var vv=document.getElementById("cam");if(vv){vv.srcObject=st;}else{st.getTracks().forEach(function(t){t.stop();});}}).catch(function(){var f=document.getElementById("camfb");if(f)f.style.display="flex";});
}catch(e){}}
function stopCam(){if(_cam){_cam.getTracks().forEach(function(t){t.stop();});_cam=null;}}
function scanDemo(){var pool=P.filter(function(p){return p.tags.length;});var p=pool[(Math.random()*pool.length)|0]||P[0];stopCam();toast("Штрих-код распознан");S.stack=[{screen:"product",id:p.id}];render();}
function renderScanner(){
  var h='<div class="navbar"><div class="back" data-act2="closecam">'+icon("back","#C7F94B")+'Каталог</div><div class="title">Сканер</div><div class="spacer"></div></div>';
  h+='<div class="pad" style="padding-top:6px"><div class="scanbox"><video id="cam" autoplay playsinline muted></video><div id="camfb" class="camfb"><span class="gl" style="font-size:42px">📷</span><div class="muted" style="margin-top:8px;text-align:center">Камера недоступна или нет доступа.<br>Используйте демо-скан ниже.</div></div><div class="scanframe"></div><div class="scanline"></div></div>';
  h+='<div class="muted" style="text-align:center;margin:14px 4px">Наведите камеру на штрих-код товара</div>';
  h+='<button class="btn" data-act2="scan-demo">Демо-скан товара</button>';
  h+='<div class="muted" style="font-size:12px;text-align:center;margin-top:10px">В прототипе распознавание имитируется: «скан» открывает карточку товара.</div></div>';
  return h;
}

function augmentProfile(){var app=$("app");if(!app)return;
  var box=document.createElement("div");
  box.innerHTML='<div class="sec">Ещё</div><div class="listcard">'+
    '<div class="row" data-act2="plan"><div class="ic" style="background:'+hexA("#34C759",.22)+'">📋</div><div class="gname" style="flex:1">План питания на день</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="orders"><div class="ic" style="background:'+hexA("#8B7BFF",.26)+'">🧾</div><div class="gname" style="flex:1">История заказов</div>'+(S.orders.length?'<span class="sub" style="margin-right:6px">'+S.orders.length+'</span>':'')+'<span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="about"><div class="ic" style="background:'+hexA("#FF9F0A",.22)+'">ℹ️</div><div class="gname" style="flex:1">О приложении</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="delivery"><div class="ic" style="background:'+hexA("#30B0C7",.22)+'">🚚</div><div class="gname" style="flex:1">Доставка и оплата</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="bonuses"><div class="ic" style="background:'+hexA("#C7F94B",.22)+'">🎁</div><div class="gname" style="flex:1">Бонусы НК</div><b style="color:var(--acc);margin-right:6px">'+(S.points||0)+'</b><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="dash"><div class="ic" style="background:'+hexA("#5E5CE6",.26)+'">📊</div><div class="gname" style="flex:1">Аналитика (для фабрики)</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="aboutco"><div class="ic" style="background:'+hexA("#FF9F0A",.20)+'">🏭</div><div class="gname" style="flex:1">О компании</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="tips"><div class="ic" style="background:'+hexA("#34C759",.20)+'">💡</div><div class="gname" style="flex:1">Советы по питанию</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="ref"><div class="ic" style="background:'+hexA("#FF375F",.20)+'">🤝</div><div class="gname" style="flex:1">Пригласи друга</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="guide"><div class="ic" style="background:'+hexA("#8B7BFF",.24)+'">🧭</div><div class="gname" style="flex:1">Как пользоваться (гид)</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="faq"><div class="ic" style="background:'+hexA("#30B0C7",.20)+'">❓</div><div class="gname" style="flex:1">Вопросы и ответы</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '<div class="row" data-act2="theme"><div class="ic" style="background:'+hexA("#8B7BFF",.24)+'">🌓</div><div class="gname" style="flex:1">Тема оформления</div><span class="sub">'+(S.theme==="light"?"Светлая":"Тёмная")+'</span></div>'+
    '<div class="row" data-act2="reset"><div class="ic" style="background:'+hexA("#FF375F",.20)+'">↺</div><div class="gname" style="flex:1">Показать с начала (демо)</div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>'+
    '</div>';
  var foot=app.querySelector('.muted[style*="padding:18px"]');
  if(foot&&foot.parentNode===app){app.insertBefore(box,foot);}else{app.appendChild(box);}
}
function augmentDiary(){var rec=$("app").querySelector('[data-act="recommend"]');if(!rec)return;var wrap=rec.parentNode;
  var d=document.createElement("div");d.style.padding="0 16px 4px";
  d.innerHTML='<button class="btn sec" data-act2="plan">Составить план на день</button>';
  wrap.parentNode.insertBefore(d,wrap.nextSibling);
}
function augmentCatalog(){var s=$("app").querySelector('.search');if(!s||s.querySelector('[data-act2="scanner"]'))return;
  var b=document.createElement("div");b.setAttribute("data-act2","scanner");b.style.cssText="flex:none;display:flex;align-items:center;cursor:pointer;color:var(--acc);padding-left:8px";
  b.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 8v8M11 8v8M15 8v8"/></svg>';
  s.appendChild(b);
}

var _origRender=render;
render=function(){
  var top=S.stack[S.stack.length-1];
  var map={orders:renderOrders,about:renderAbout,plan:renderPlan,scanner:renderScanner};
  if(top&&map[top.screen]){$("app").innerHTML=map[top.screen]();$("app").scrollTop=(top&&top._st)||0;renderTabs();return;}
  _origRender();
  if(!S.stack.length){if(S.tab==="profile")augmentProfile();else if(S.tab==="diary")augmentDiary();else if(S.tab==="catalog")augmentCatalog();}
};

document.addEventListener("click",function(e){
  var el=e.target.closest("[data-act2]");if(!el)return;
  var a=el.getAttribute("data-act2");var id=+el.getAttribute("data-id");
  if(a==="orders")go("orders");
  else if(a==="about")go("about");
  else if(a==="plan")go("plan");
  else if(a==="scanner"){go("scanner");startCam();}
  else if(a==="plan-regen"){S.plan=buildPlan();LS.set("nk_plan",S.plan);render();}
  else if(a==="plan-apply"){applyPlan();}
  else if(a==="scan-demo"){scanDemo();}
  else if(a==="closecam"){stopCam();back();}
  else if(a==="reset"){try{['nk_cart','nk_fav','nk_diary','nk_profile','nk_orders','nk_plan'].forEach(function(k){localStorage.removeItem(k);});}catch(e){}S.cart={};S.fav=[];S.diary=[];S.orders=[];S.plan=null;S.profile=null;S.stack=[];S.tab="catalog";S.filter="all";S.query="";S.onbStep=0;var ob=document.getElementById("onb");if(ob)ob.style.display="flex";renderOnb();render();}
  else if(a==="reorder"){var o=S.orders.filter(function(x){return x.ts==id;})[0];if(o){o.items.forEach(function(it){S.cart[it.id]=(S.cart[it.id]||0)+it.q;});save();S.stack=[];S.tab="cart";render();toast("Товары добавлены в корзину");}}
});


