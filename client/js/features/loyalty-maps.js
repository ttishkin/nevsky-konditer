/* js/features/loyalty-maps.js
   Лояльность, рефералка, FAQ, гид, карты (v14-v15)
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */
/* ===== v14: loyalty, recently viewed, referral, notifications, FAQ, guide ===== */
S.recent=S.recent||LS.get("nk_recent",[]);
S.notifRead=(LS.get("nk_notifread","")==="1");
var NOTIFS=[
 {g:"🏷️",t:"Скидки до −25%",x:"Любимое сладкое сейчас выгоднее — успейте.",w:"сегодня"},
 {g:"✨",t:"Новинки недели",x:"PROBATON и So Crispy в новых вкусах.",w:"вчера"},
 {g:"🎁",t:"Бонусы за заказ",x:"Возвращаем 5% баллами с каждой покупки.",w:"2 дня назад"},
 {g:"🚚",t:"Бесплатная доставка",x:"При заказе от 1000 ₽ по всему городу.",w:"3 дня назад"}
];
function recentShelf(){
  var list=(S.recent||[]).slice(0,10).map(prod).filter(Boolean);
  if(list.length<2)return '';
  return '<div class="sec secrow"><span>Вы недавно смотрели</span></div><div class="hscroll">'+list.map(pcardHTML).join('')+'</div>';
}
function loyalty(){
  var spent=(S.orders||[]).reduce(function(s,o){return s+o.total;},0);
  var tiers=[["Бронза",0],["Серебро",3000],["Золото",8000]];var ti=0;
  for(var i=0;i<tiers.length;i++){if(spent>=tiers[i][1])ti=i;}
  var next=tiers[ti+1];var pct=next?Math.min(100,Math.round(spent/next[1]*100)):100;
  return {name:tiers[ti][0],spent:spent,next:next,pct:pct};
}
function loyaltyCard(){
  var l=loyalty();var col=l.name==="Золото"?"#E8C24A":(l.name==="Серебро"?"#C0C5CE":"#CD7F32");
  var h='<div class="loycard"><div class="loytop"><div><div class="muted" style="font-size:12px">Статус лояльности</div><div style="font-size:22px;font-weight:800;color:'+col+'">'+l.name+'</div></div><div style="font-size:32px">🏅</div></div>';
  if(l.next)h+='<div class="muted" style="font-size:12px;margin:10px 0 6px">До «'+l.next[0]+'» осталось '+money(l.next[1]-l.spent)+'</div><div class="bar"><i style="width:'+l.pct+'%;background:'+col+'"></i></div>';
  else h+='<div class="muted" style="font-size:12px;margin-top:8px">Максимальный статус — спасибо, что с нами!</div>';
  return h+'</div>';
}
function renderNotif(){
  S.notifRead=true;LS.set("nk_notifread","1");
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Каталог</div><div class="title">Уведомления</div><div class="spacer"></div></div>';
  h+='<div class="listcard" style="margin:8px 16px">'+NOTIFS.map(function(n){return '<div class="row" style="cursor:default;align-items:flex-start"><div class="ic" style="background:'+hexA("#C7F94B",.18)+'">'+n.g+'</div><div style="flex:1"><div class="gname">'+n.t+'</div><div class="sub">'+n.x+'</div><div class="sub" style="color:var(--label3);margin-top:2px">'+n.w+'</div></div></div>';}).join('')+'</div>';
  return h;
}
function renderFaq(){
  var Q=[["Это настоящий магазин?","Это прототип дипломного проекта. Заказы и оплата — демонстрационные."],["Откуда берутся КБЖУ?","Из открытых источников; итоговые значения уточняются по упаковке товара."],["Как считается норма калорий?","По формуле Миффлина–Сан Жеора: пол, возраст, вес, рост, активность и цель."],["Что такое бонусы НК?","5% от суммы заказа возвращаются баллами (в прототипе — демонстрационно)."],["Как работает доставка?","Курьер — 199 ₽, бесплатно от 1000 ₽; самовывоз — бесплатно."]];
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Профиль</div><div class="title">Вопросы и ответы</div><div class="spacer"></div></div>';
  Q.forEach(function(q){h+='<div class="block" style="margin:10px 16px"><h3 style="text-transform:none;letter-spacing:0;font-size:15px;color:var(--label)">'+q[0]+'</h3><p style="color:var(--label2)">'+q[1]+'</p></div>';});
  return h+'<div style="height:10px"></div>';
}
function renderRef(){
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Профиль</div><div class="title">Пригласи друга</div><div class="spacer"></div></div>';
  h+='<div class="pad" style="text-align:center"><div style="font-size:56px;margin:10px 0">🤝</div><div class="h1" style="font-size:20px">Дарите 500 ₽ другу</div><div class="muted" style="margin:8px 0 16px">Друг получит −500 ₽ на первый заказ, а вы — 500 бонусов, когда он оформит покупку.</div>';
  h+='<div class="block" style="text-align:center"><div class="muted" style="font-size:12px">Ваш промокод</div><div style="font-size:26px;font-weight:800;letter-spacing:3px;color:var(--acc);margin:4px 0">ДРУГ500</div></div>';
  h+='<button class="btn" data-act2="refshare" style="margin-top:14px">Поделиться приглашением</button></div>';
  return h;
}
var GUIDE=[
 {g:"🛍️",t:"Каталог",s:"Полезные сладости с фото, фильтрами, сортировкой и поиском."},
 {g:"🔥",t:"Дневник КБЖУ",s:"Считайте калории и БЖУ и держите дневную норму."},
 {g:"🎯",t:"Подбор перекуса",s:"Подскажем, что вписать в остаток нормы на сегодня."},
 {g:"🛒",t:"Заказ и бонусы",s:"Корзина, промокод, доставка от 1000 ₽ бесплатно и 5% бонусами."}
];
function openGuide(i){
  var st=GUIDE[i];if(!st)return;S._guide=i;var bg=$("storybg");
  bg.innerHTML='<div class="stfull" style="background:linear-gradient(160deg,#3A2A78,#141019)" data-act2="guidenext">'+
    '<div class="stbars">'+GUIDE.map(function(_,k){return '<span class="'+(k<=i?"on":"")+'"></span>';}).join('')+'</div>'+
    '<div class="stclose" data-act2="guideclose">✕</div>'+
    '<div class="stbody"><div class="sg">'+st.g+'</div><h2>'+st.t+'</h2><p>'+st.s+'</p></div>'+
    '<button class="btn" data-act2="guidenext" style="background:#fff;color:#16240A">'+(i<GUIDE.length-1?"Далее":"Понятно")+'</button>'+
  '</div>';
  bg.classList.add("on");
}
(function(){var _r14=render;render=function(){
  var top=S.stack[S.stack.length-1];var m={notif:renderNotif,faq:renderFaq,ref:renderRef};
  if(top&&m[top.screen]){var app=$("app");if(!app)return;app.innerHTML=m[top.screen]();renderTabs();app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add('nav-push');return;}
  _r14();
  if(!S.stack.length&&S.tab==="catalog"){var lt=$("app").querySelector('.lt');if(lt&&!lt.querySelector('.bell')){lt.style.position='relative';var b=document.createElement('div');b.className='bell';b.setAttribute('data-act2','notif');b.innerHTML='🔔'+(S.notifRead?'':'<span class="bdot"></span>');lt.appendChild(b);}}
  if(!S.stack.length&&S.tab==="profile"){var app2=$("app");var more=null;[].forEach.call(app2.querySelectorAll('.sec'),function(s){if(s.textContent.trim()==='Ещё')more=s;});if(more&&!app2.querySelector('.loycard')){var c=document.createElement('div');c.innerHTML=loyaltyCard();more.parentNode.insertBefore(c.firstChild,more);}}
};})();
document.addEventListener("click",function(e){var o=e.target.closest('[data-act="open"]');if(o){var id=+o.getAttribute("data-id");if(id){S.recent=(S.recent||[]).filter(function(x){return x!==id;});S.recent.unshift(id);S.recent=S.recent.slice(0,10);LS.set("nk_recent",S.recent);}}},true);
document.addEventListener("click",function(e){var el=e.target.closest("[data-act2]");if(!el)return;var a=el.getAttribute("data-act2");
  if(a==="notif")go("notif");
  else if(a==="faq")go("faq");
  else if(a==="ref")go("ref");
  else if(a==="refshare"){var t="Промокод ДРУГ500 — −500 ₽ на первый заказ в «Невский Кондитер · ЗОЖ»";if(navigator.share)navigator.share({title:"Невский Кондитер · ЗОЖ",text:t}).catch(function(){});else if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){toast("Скопировано");},function(){toast("Готово");});else toast("Готово");}
  else if(a==="guide")openGuide(0);
  else if(a==="guideclose")closeStory();
  else if(a==="guidenext"){var n=(S._guide||0)+1;if(n>=GUIDE.length)closeStory();else openGuide(n);}
});
/* bootstrap render() -> js/app.js */

/* ===== v15: Yandex map address + pickup points ===== */
S.delivery=S.delivery||LS.get("nk_delivery",null);
S.mapMode=S.mapMode||"courier";
var SPB=[[59.70,29.55],[60.15,30.75]];
var PVZ=[
 {n:"Невский проспект, 100",h:"ежедневно 10:00–22:00",c:[59.9325,30.3601]},
 {n:"Лиговский проспект, 30 («Галерея»)",h:"10:00–22:00",c:[59.9273,30.3603]},
 {n:"Московский проспект, 150",h:"10:00–21:00",c:[59.8790,30.3185]},
 {n:"проспект Просвещения, 19",h:"10:00–22:00",c:[60.0510,30.3340]},
 {n:"Богатырский проспект, 14",h:"10:00–22:00",c:[59.9990,30.2540]}
];
function deliveryField(){
  var d=S.delivery;
  var label=d?(d.mode==='pickup'?'Самовывоз: '+d.label:'Доставка: '+d.label):'Указать на карте';
  return '<div class="field"><label>Получение (Санкт-Петербург)</label><div class="row" style="cursor:pointer;border:1px solid var(--sep);border-radius:11px;background:var(--card)" data-act2="openmap"><div class="ic" style="background:'+hexA("#30B0C7",.2)+'">🗺️</div><div style="flex:1"><div class="gname" style="font-size:14px">'+esc(label)+'</div><div class="sub">'+(d?'нажмите, чтобы изменить':'адрес или пункт выдачи')+'</div></div><span style="color:var(--acc);font-size:13px">'+(d?'Изменить':'Выбрать')+'</span></div></div>';
}
function renderMap(){
  var mode=S.mapMode||'courier';
  var h='<div class="navbar"><div class="back" data-act2="mapback">'+icon("back","#C7F94B")+'Назад</div><div class="title">Куда доставить</div><div class="spacer"></div></div>';
  h+='<div class="pad" style="padding-bottom:6px">';
  h+='<div class="seg" style="margin-bottom:12px"><button data-act2="mapmode" data-m="courier" class="'+(mode==='courier'?'on':'')+'">Курьер</button><button data-act2="mapmode" data-m="pickup" class="'+(mode==='pickup'?'on':'')+'">Самовывоз</button></div>';
  if(mode==='courier'){
    h+='<div class="field" style="margin-top:0"><label>Адрес</label><input id="ymsuggest" placeholder="Улица, дом — Санкт-Петербург" value="'+(S._mapAddr?esc(S._mapAddr):'')+'" autocomplete="off"></div>';
    h+='<div id="ymap" class="ymap"></div>';
    h+='<div class="muted" id="mapsel" style="margin:10px 2px">'+(S._mapAddr?'Адрес: '+esc(S._mapAddr):'Начните вводить адрес или перетащите метку на карте')+'</div>';
  } else {
    h+='<div id="ymap" class="ymap"></div>';
    h+='<div class="muted" id="mapsel" style="margin:10px 2px">'+((typeof S._pvz==='number'&&PVZ[S._pvz])?'Пункт: '+esc(PVZ[S._pvz].n):'Выберите пункт выдачи на карте или в списке')+'</div>';
    h+='<div class="listcard" style="margin:0">'+PVZ.map(function(p,i){return '<div class="row" data-act2="pickpvz" data-i="'+i+'"><div class="ic" style="background:'+hexA("#34C759",.2)+'">📍</div><div style="flex:1"><div class="gname" style="font-size:14px">'+p.n+'</div><div class="sub">'+p.h+'</div></div>'+((typeof S._pvz==='number'&&S._pvz===i)?'<span style="color:var(--acc);font-size:18px">✓</span>':'')+'</div>';}).join('')+'</div>';
  }
  h+='<button class="btn" style="margin-top:12px" data-act2="mapconfirm">'+(mode==='courier'?'Подтвердить адрес':'Выбрать пункт')+'</button>';
  return h+'</div>';
}
function showMapFallback(){var b=document.getElementById('ymap');if(b){b.style.height='150px';b.innerHTML='<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:18px;color:var(--label2)"><div style="font-size:32px">🗺️</div><div style="margin-top:8px;font-size:12px;line-height:1.4">Карта появится после добавления бесплатного API-ключа Яндекс.Карт в код приложения. Ввод адреса и выбор пункта работают и сейчас.</div></div>';}}
function wireMap(){
  var box=document.getElementById('ymap');if(!box)return;
  if(typeof ymaps==='undefined'||!ymaps.ready){showMapFallback();return;}
  ymaps.ready(function(){
    try{
      if(window._ym){try{window._ym.destroy();}catch(e){}window._ym=null;}
      var center=[59.9386,30.3141];
      var map=new ymaps.Map('ymap',{center:center,zoom:11,controls:['zoomControl']});window._ym=map;
      if((S.mapMode||'courier')==='pickup'){
        PVZ.forEach(function(p,i){var pm=new ymaps.Placemark(p.c,{iconCaption:p.n,balloonContent:p.n+'<br>'+p.h},{preset:'islands#greenDotIconWithCaption'});
          pm.events.add('click',function(){S._pvz=i;var l=document.getElementById('mapsel');if(l)l.textContent='Пункт: '+p.n;});map.geoObjects.add(pm);});
        try{map.setBounds(map.geoObjects.getBounds(),{checkZoomRange:true,zoomMargin:30});}catch(e){}
      } else {
        var pin=new ymaps.Placemark(center,{},{preset:'islands#redDotIcon',draggable:true});map.geoObjects.add(pin);
        var inp=document.getElementById('ymsuggest');
        if(inp){var sv=new ymaps.SuggestView('ymsuggest',{boundedBy:SPB,strictBounds:true,results:6});
          sv.events.add('select',function(e){var v=e.get('item').value;
            ymaps.geocode(v,{boundedBy:SPB,results:1}).then(function(res){var o=res.geoObjects.get(0);if(!o)return;var c=o.geometry.getCoordinates();map.setCenter(c,16);pin.geometry.setCoordinates(c);S._mapAddr=o.getAddressLine();var l=document.getElementById('mapsel');if(l)l.textContent='Адрес: '+S._mapAddr;inp.value=S._mapAddr;});});
        }
        pin.events.add('dragend',function(){var c=pin.geometry.getCoordinates();ymaps.geocode(c,{results:1}).then(function(res){var o=res.geoObjects.get(0);if(!o)return;S._mapAddr=o.getAddressLine();var l=document.getElementById('mapsel');if(l)l.textContent='Адрес: '+S._mapAddr;var i2=document.getElementById('ymsuggest');if(i2)i2.value=S._mapAddr;});});
      }
    }catch(e){showMapFallback();}
  });
}
(function(){var _r15=render;render=function(){
  var top=S.stack[S.stack.length-1];
  if(top&&top.screen==="map"){var app=$("app");if(!app)return;app.innerHTML=renderMap();renderTabs();app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add('nav-push');setTimeout(wireMap,40);return;}
  _r15();
};})();
document.addEventListener("click",function(e){var el=e.target.closest("[data-act2]");if(!el)return;var a=el.getAttribute("data-act2");
  if(a==="openmap"){closeSheet();go("map");}
  else if(a==="mapback"){S.stack.pop();render();setTimeout(sheetCheckout,40);}
  else if(a==="mapmode"){S.mapMode=el.getAttribute("data-m");render();}
  else if(a==="pickpvz"){S._pvz=+el.getAttribute("data-i");render();}
  else if(a==="mapconfirm"){
    if((S.mapMode||'courier')==='courier'){var v=((document.getElementById('ymsuggest')||{}).value||S._mapAddr||'').trim();if(!v){toast("Введите адрес");return;}S.delivery={mode:'courier',label:v};}
    else{if(typeof S._pvz!=='number'){toast("Выберите пункт");return;}S.delivery={mode:'pickup',label:PVZ[S._pvz].n};}
    LS.set("nk_delivery",S.delivery);S.stack.pop();render();setTimeout(sheetCheckout,40);toast("Сохранено");
  }
});

