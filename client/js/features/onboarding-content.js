/* js/features/onboarding-content.js — расширенный онбординг, дашборд, бонусы, о компании */

function odots(step){return '<div class="odots"><span class="'+(step>=1?"on":"")+'"></span><span class="'+(step>=2?"on":"")+'"></span></div>';}
function goalCard(v,label,ic,cur){return '<button data-v="'+v+'" class="goalc'+(cur===v?" on":"")+'"><span class="gci">'+ic+'</span><span>'+label+'</span></button>';}
function goalPicks(g){
  if(g==="lose")return P.filter(function(p){return p.tags.indexOf("sugar")>=0||p.tags.indexOf("fat")>=0||portionKcal(p)<=170;});
  if(g==="gain")return P.filter(function(p){return p.tags.indexOf("prot")>=0||p.tags.indexOf("nut")>=0;});
  return P.filter(function(p){return p.hit;});
}
readOnbForm=function(){var f=S.onbForm;
  var nm=$("o_name");f.name=((nm&&nm.value)||"").trim().slice(0,24);
  f.age=Math.min(100,Math.max(10,+$("o_age").value||25));
  f.height=Math.min(220,Math.max(120,+$("o_h").value||175));
  f.weight=Math.min(250,Math.max(30,+$("o_w").value||70));
  f.act=$("o_act").value;
};
renderOnb=function(){
  var o=$("onb");var f=S.onbForm;
  if(S.onbStep===0){
    o.innerHTML='<div class="onbhero splash">'+
      '<div class="brandbadge"><img src="https://konditer.net/bitrix/templates/nk/images/logo.png" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><span class="brandmono" style="display:none">НК</span></div>'+
      '<div class="brandname">Невский Кондитер</div><div class="brandzozh">ЗОЖ · правильное питание</div>'+
      '<div class="brandslogan">«Потому что хочется сладкого!»</div>'+
      '<div class="vprops"><div class="vp"><div class="vpi">🔥</div>Счёт КБЖУ</div><div class="vp"><div class="vpi">🥗</div>Полезные перекусы</div><div class="vp"><div class="vpi">⚡</div>Заказ за минуту</div></div>'+
      '</div>'+
      '<div class="onbbody"><button class="btn" data-act="onb-next">Начать</button><button class="btn ghost" style="margin-top:8px" data-act="onb-skip">Пропустить</button></div>';
  } else if(S.onbStep===1){
    o.innerHTML='<div class="onbbody" style="padding-top:26px">'+odots(1)+
      '<div class="h1" style="margin-bottom:14px">Расскажите о себе</div>'+
      '<div class="field"><label>Как вас зовут?</label><input id="o_name" value="'+(f.name?f.name.replace(/"/g,"&quot;"):"")+'" placeholder="Имя"></div>'+
      '<div class="field"><label>Пол</label><div class="seg" id="o_sex"><button data-v="m" class="'+(f.sex==="m"?"on":"")+'">Мужской</button><button data-v="f" class="'+(f.sex==="f"?"on":"")+'">Женский</button></div></div>'+
      '<div class="field" style="display:flex;gap:10px"><div style="flex:1"><label>Возраст</label><input id="o_age" type="number" inputmode="numeric" min="10" max="100" value="'+f.age+'"></div><div style="flex:1"><label>Рост, см</label><input id="o_h" type="number" inputmode="numeric" min="120" max="220" value="'+f.height+'"></div><div style="flex:1"><label>Вес, кг</label><input id="o_w" type="number" inputmode="numeric" min="30" max="250" value="'+f.weight+'"></div></div>'+
      '<div class="field"><label>Активность</label><select id="o_act"><option value="1.2"'+sel(f.act,"1.2")+'>Минимальная</option><option value="1.375"'+sel(f.act,"1.375")+'>Лёгкая (1–3 трен/нед)</option><option value="1.55"'+sel(f.act,"1.55")+'>Средняя (3–5 трен/нед)</option><option value="1.725"'+sel(f.act,"1.725")+'>Высокая (6–7 трен/нед)</option></select></div>'+
      '<div class="field"><label>Цель</label><div class="goalcards" id="o_goal">'+goalCard("lose","Похудеть","🔻",f.goal)+goalCard("keep","Поддержать","⚖️",f.goal)+goalCard("gain","Набрать","🔺",f.goal)+'</div></div>'+
      '<button class="btn" style="margin-top:6px" data-act="onb-calc">Рассчитать норму</button></div>';
    bindSeg("o_sex","sex");bindSeg("o_goal","goal");
  } else if(S.onbStep===2){
    var k=calcKcal(f);S.onbForm.kcal=k;
    var mt={p:Math.round(k*0.25/4),f:Math.round(k*0.30/9),c:Math.round(k*0.45/4)};
    var picks=goalPicks(f.goal).slice(0,4);
    o.innerHTML='<div class="onbhero" style="min-height:40%"><div class="logo">🎯</div><h1>'+k+' ккал/день</h1><p>Ваша ориентировочная суточная норма по формуле Миффлина–Сан Жеора.</p></div>'+
      '<div class="onbbody">'+odots(2)+
      '<div class="listcard" style="margin:0 0 14px">'+row2("Белки",mt.p+" г")+row2("Жиры",mt.f+" г")+row2("Углеводы",mt.c+" г")+'</div>'+
      (picks.length?'<div class="sec" style="padding-left:0">Рекомендуем под вашу цель</div><div class="hscroll" style="padding:6px 0 12px">'+picks.map(pcardHTML).join('')+'</div>':'')+
      '<button class="btn" data-act="onb-finish">Перейти в приложение</button></div>';
  }
};
if($("onb")&&$("onb").style.display!=="none"){renderOnb();}


S.points=S.points||LS.get("nk_pts",0);
function statTile(l,v){return '<div class="kb" style="flex:1;min-width:46%"><div class="v">'+v+'</div><div class="l">'+l+'</div></div>';}
function orderStatus(o){
  var map={new:0,processing:0,shipped:1,delivered:2,cancelled:-1};
  var st;
  if(o.status!=null && map[o.status]!==undefined){st=map[o.status];}
  else{var age=Date.now()-o.ts;st=age<86400000?0:(age<172800000?1:2);}
  if(st===-1){return '<div class="otl"><div class="ostep on"><span class="odot" style="background:#FF6B6B"></span><div class="olbl" style="color:#FF6B6B">Заказ отменён</div></div></div>';}
  var lbl0=(o.status==="processing")?"В обработке":"Оформлен";
  var steps=[lbl0,"В пути","Доставлен"];var h='<div class="otl">';
  for(var i=0;i<steps.length;i++){h+='<div class="ostep'+(i<=st?' on':'')+'"><span class="odot"></span><div class="olbl">'+steps[i]+'</div></div>';if(i<steps.length-1)h+='<span class="obar'+(i<st?' on':'')+'"></span>';}
  return h+'</div>';
}
function renderDashboard(){
  var orders=S.orders||[];var rev=0,items=0,cnt=orders.length,byprod={};
  orders.forEach(function(o){rev+=o.total;o.items.forEach(function(it){items+=it.q;byprod[it.id]=(byprod[it.id]||0)+it.q;});});
  var sample=!cnt;
  if(sample){cnt=128;rev=84600;items=372;byprod={5:64,12:51,16:47,9:39,1:33};}
  var avg=cnt?Math.round(rev/cnt):0;
  var top=Object.keys(byprod).map(function(k){return {p:prod(+k),q:byprod[k]};}).filter(function(x){return x.p;}).sort(function(a,b){return b.q-a.q;}).slice(0,5);
  var maxq=top.length?top[0].q:1;
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Профиль</div><div class="title">Аналитика</div><div class="spacer"></div></div>';
  h+='<div class="pad" style="padding-bottom:6px">';
  if(sample)h+='<div class="muted" style="font-size:12px;margin-bottom:8px">Демонстрационные данные для презентации</div>';
  h+='<div style="display:flex;gap:10px;flex-wrap:wrap">'+statTile('Заказов',cnt)+statTile('Выручка',money(rev))+statTile('Средний чек',money(avg))+statTile('Позиций продано',items)+'</div>';
  h+='<div class="sec" style="padding-left:0;margin-top:10px">Топ-5 товаров</div><div class="listcard" style="margin:0">';
  top.forEach(function(x){var pc=Math.round(x.q/maxq*100);h+='<div style="padding:10px 12px;border-bottom:1px solid var(--sep)"><div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px"><span>'+esc(x.p.n)+'</span><b>'+x.q+' шт</b></div><div class="bar"><i style="width:'+pc+'%;background:var(--acc)"></i></div></div>';});
  h+='</div></div>';
  return h;
}
function renderAboutCo(){
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Профиль</div><div class="title">О компании</div><div class="spacer"></div></div>';
  h+='<div class="pad" style="text-align:center;padding-bottom:6px"><div class="brandbadge" style="margin:4px auto 12px;width:84px;height:84px;border-radius:20px"><img src="https://konditer.net/bitrix/templates/nk/images/logo.png" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><span class="brandmono" style="display:none;font-size:32px">НК</span></div><div class="h1" style="font-size:20px">ГК «Невский Кондитер»</div></div>';
  h+='<div style="display:flex;gap:10px;flex-wrap:wrap;padding:0 16px">'+statTile('На рынке','>20 лет')+statTile('Наименований','>500')+statTile('Сотрудников','>1500')+statTile('Стран','20')+'</div>';
  h+='<div class="block" style="margin:12px 16px"><p>Группа компаний «Невский Кондитер» основана в 1996 году в Санкт-Петербурге и сегодня — один из крупнейших производителей кондитерских изделий в России. В составе — несколько фабрик в экологически чистых регионах страны.</p></div>';
  h+='<div class="block" style="margin:12px 16px"><p>Технологи отбирают только качественные ингредиенты: тёртое какао, натуральные красители, цельное и сгущённое молоко, лучшие сухофрукты и орехи. Продукция отмечена наградами всероссийских и международных выставок.</p></div>';
  h+='<div class="muted" style="text-align:center;padding:6px 16px 24px;font-size:12px">По данным официального сайта konditer.net</div>';
  return h;
}
function renderTips(){
  var T=[["Сладкое — в пределах нормы","Десерт можно вписать в дневной калораж: следите за остатком нормы и берите порционные форматы (~40 г)."],["Белок дольше насыщает","Протеиновые и ореховые батончики держат сытость дольше, чем чистый сахар — реже тянет на перекус."],["Читайте состав","Цельные злаки, орехи, сухофрукты и пометка «без сахара» — ориентиры для более полезного выбора."],["Вода важнее, чем кажется","Иногда голод — это жажда. Стакан воды перед перекусом помогает не переесть."]];
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Профиль</div><div class="title">Советы по питанию</div><div class="spacer"></div></div>';
  T.forEach(function(t){h+='<div class="block" style="margin:10px 16px"><h3 style="color:var(--acc)">'+t[0]+'</h3><p>'+t[1]+'</p></div>';});
  h+='<div style="height:10px"></div>';
  return h;
}
(function(){var _r11=render;render=function(){
  var top=S.stack[S.stack.length-1];var m={dash:renderDashboard,aboutco:renderAboutCo,tips:renderTips};
  if(top&&m[top.screen]){var app=$("app");if(!app)return;app.innerHTML=m[top.screen]();renderTabs();app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add('nav-push');return;}
  _r11();
};})();
document.addEventListener("click",function(e){var el=e.target.closest("[data-act2]");if(!el)return;var a=el.getAttribute("data-act2");
  if(a==="dash")go("dash");else if(a==="aboutco")go("aboutco");else if(a==="tips")go("tips");});

