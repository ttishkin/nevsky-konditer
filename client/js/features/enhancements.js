/* js/features/enhancements.js
   Экран лояльности, бюджет на сладкое, редактирование дневника (v20-v29)
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */

S.moreOpen=S.moreOpen||false;
loyaltyCard=function(){
  var l=loyalty();var col=l.name==="Золото"?"#E8C24A":(l.name==="Серебро"?"#C0C5CE":"#CD7F32");
  var h='<div class="loycard" data-act2="loyalty" style="cursor:pointer">'+
    '<div class="loytop"><div><div class="muted" style="font-size:12px">Статус лояльности</div><div style="font-size:22px;font-weight:800;color:'+col+'">'+l.name+'</div></div><div style="display:flex;align-items:center;gap:8px"><span style="font-size:30px">🏅</span><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div></div>';
  if(l.next)h+='<div class="muted" style="font-size:12px;margin:10px 0 6px">До «'+l.next[0]+'» осталось '+money(l.next[1]-l.spent)+'</div><div class="bar"><i style="width:'+l.pct+'%;background:'+col+'"></i></div>';
  else h+='<div class="muted" style="font-size:12px;margin-top:8px">Максимальный статус — спасибо, что с нами!</div>';
  return h+'</div>';
};
function renderLoyalty(){
  var cur=loyalty();var spent=cur.spent;
  var T=[
   {n:"Бронза",min:0,cb:5,col:"#CD7F32",ic:"🥉",perks:["Кэшбэк 5% баллами с каждого заказа","Участие в акциях и промокодах","Каталог за баллы"]},
   {n:"Серебро",min:3000,cb:7,col:"#C0C5CE",ic:"🥈",perks:["Кэшбэк 7% баллами","Ранний доступ к новинкам","Повышенные бонусы за друзей"]},
   {n:"Золото",min:8000,cb:10,col:"#E8C24A",ic:"🥇",perks:["Кэшбэк 10% баллами","Подарок в день рождения","Приоритетная поддержка","Эксклюзивные наборы за баллы"]}
  ];
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Профиль</div><div class="title">Статус лояльности</div><div class="spacer"></div></div>';
  h+='<div class="pad" style="padding-bottom:4px"><div class="muted" style="font-size:13px">Сумма заказов: <b style="color:var(--label)">'+money(spent)+'</b>. Статус и кэшбэк повышаются автоматически.</div></div>';
  T.forEach(function(t){
    var reached=spent>=t.min;var isCur=cur.name===t.n;
    h+='<div class="block" style="margin:8px 16px;border:1px solid '+(isCur?t.col:'var(--sep)')+'">';
    h+='<div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:18px;font-weight:800;color:'+t.col+'">'+t.n+(isCur?' · ваш статус':'')+'</div><div style="font-size:24px">'+t.ic+'</div></div>';
    h+='<div class="muted" style="font-size:12px;margin:2px 0 8px">'+(t.min===0?'стартовый уровень':'от '+money(t.min)+' заказов')+(reached?' · достигнут ✓':' · ещё '+money(t.min-spent))+'</div>';
    h+=t.perks.map(function(p){return '<div style="display:flex;gap:8px;font-size:14px;padding:3px 0"><span style="color:'+t.col+'">✓</span><span>'+p+'</span></div>';}).join('');
    h+='</div>';
  });
  return h+'<div style="height:10px"></div>';
}
(function(){var _r20=render;render=function(){
  var top=S.stack[S.stack.length-1];
  if(top&&top.screen==="loyalty"){var app=$("app");if(!app)return;app.innerHTML=renderLoyalty();renderTabs();app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add('nav-push');return;}
  _r20();
  if(!S.stack.length&&S.tab==="profile"){var ap=$("app");if(!ap)return;var secs=ap.querySelectorAll('.sec');
    for(var i=0;i<secs.length;i++){var s=secs[i];
      if(s.textContent.trim()==='Ещё'){var card=s.nextElementSibling;
        if(card&&card.classList&&card.classList.contains('listcard')){
          s.style.cursor='pointer';s.setAttribute('data-act2','togglemore');
          s.innerHTML='Ещё <span style="color:var(--label3);font-weight:400">'+(S.moreOpen?'▾':'▸')+'</span>';
          if(!S.moreOpen)card.style.display='none';
        }break;
      }
    }
  }
};})();
document.addEventListener("click",function(e){var el=e.target.closest("[data-act2]");if(!el)return;var a=el.getAttribute("data-act2");
  if(a==="loyalty")go("loyalty");
  else if(a==="togglemore"){S.moreOpen=!S.moreOpen;var _c=el.nextElementSibling;if(_c&&_c.classList&&_c.classList.contains("listcard"))_c.style.display=S.moreOpen?"":"none";el.innerHTML='Ещё <span style="color:var(--label3);font-weight:400">'+(S.moreOpen?"▾":"▸")+'</span>';}
});


function sweetBudget(){return Math.round(norm()*0.20);}
renderDiary=function(){
  var t=diaryTotals();var k=sweetBudget();var rem=k-t.kcal;
  var h='<div class="lt">Дневник сладкого</div><div class="muted" style="padding:0 20px 4px">Сегодня · бюджет на сладкое и перекусы</div>';
  h+='<div class="ringwrap">'+
     '<div class="ring">'+ringSVG(t.kcal,k)+'<div class="ctr"><div class="big">'+(rem>=0?rem:0)+'</div><div class="sm">'+(rem>=0?"ккал осталось":"на сегодня всё")+'</div></div></div>'+
     '<div class="macros">'+
       '<div style="font-size:14px;font-weight:600">Бюджет на сладкое</div>'+
       '<div style="font-size:13px;color:var(--label2)">Съедено '+t.kcal+' из '+k+' ккал</div>'+
       '<div style="font-size:12px;color:var(--label3);line-height:1.45">≈20% дневной нормы ('+norm()+' ккал)<br>Б '+t.p+' · Ж '+t.f+' · У '+t.c+' г</div>'+
     '</div></div>';
  if(rem>=0){h+='<div style="padding:8px 16px"><button class="btn green" data-act="recommend">Подобрать перекус под остаток'+(rem>0?" ("+rem+" ккал)":"")+'</button></div>';}else{h+='<div style="margin:10px 16px;padding:14px 16px;border-radius:16px;background:rgba(255,178,62,.12);border:1px solid rgba(255,178,62,.32)"><div style="font-size:15px;font-weight:700;color:#FFB23E">🍫 Сегодня вы порадовали себя!</div><div style="font-size:13px;color:var(--label2);margin:4px 0 11px;line-height:1.45">Это нормально — завтра бюджет на сладкое обновится. А пока подберём лёгкие снэки на завтра.</div><button class="btn green" data-act="recommend">Подобрать лёгкие снэки ›</button></div>';}
  if(!S.diary.length){
    h+='<div class="empty"><span class="gl">🍬</span>Пока пусто.<br>Добавляйте сладости и перекусы — увидите, сколько ещё можно сегодня без вреда.</div>';
  } else {
    var meals={"Завтрак":[],"Обед":[],"Ужин":[],"Перекус":[]};
    S.diary.forEach(function(e,i){(meals[e.meal]||meals["Перекус"]).push({e:e,i:i});});
    for(var m in meals){
      if(!meals[m].length)continue;
      h+='<div class="meal"><div class="mh"><span>'+m+'</span></div><div class="listcard">';
      meals[m].forEach(function(o){var p=prod(o.e.id);if(!p)return;var ct=CATS[p.cat];
        h+='<div class="row"><div class="ic" style="background:'+hexA(ct.c,.20)+'">'+ct.gl+'</div>'+
           '<div style="flex:1"><div class="gname">'+esc(p.n)+'</div><div class="sub">'+(o.e.qty?o.e.qty+' шт':o.e.grams+' г')+' · '+Math.round(p.kcal*o.e.grams/100)+' ккал</div></div>'+
           '<div class="heart" style="width:32px;height:32px;box-shadow:none;background:rgba(118,118,128,.12)" data-act="deldiary" data-i="'+o.i+'">✕</div></div>';
      });
      h+='</div></div>';
    }
    h+='<div style="height:10px"></div>';
  }
  return h;
};
renderOnb=function(){
  var o=$("onb");var f=S.onbForm;
  if(S.onbStep===0){
    o.innerHTML='<div class="onbhero splash">'+
      '<div class="brandbadge"><img src="https://konditer.net/bitrix/templates/nk/images/logo.png" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><span class="brandmono" style="display:none">НК</span></div>'+
      '<div class="brandname">Невский Кондитер</div><div class="brandzozh">ЗОЖ · правильное питание</div>'+
      '<div class="brandslogan">«Потому что хочется сладкого!»</div>'+
      '<div class="vprops"><div class="vp"><div class="vpi">🍬</div>Сладкое в меру</div><div class="vp"><div class="vpi">🥗</div>Полезные перекусы</div><div class="vp"><div class="vpi">⚡</div>Заказ за минуту</div></div>'+
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
      '<button class="btn" style="margin-top:6px" data-act="onb-calc">Рассчитать бюджет</button></div>';
    bindSeg("o_sex","sex");bindSeg("o_goal","goal");
  } else if(S.onbStep===2){
    var k=calcKcal(f);S.onbForm.kcal=k;var sb=Math.round(k*0.2);
    var picks=goalPicks(f.goal).slice(0,4);
    o.innerHTML='<div class="onbhero" style="min-height:40%"><div class="logo">🍬</div><h1>'+sb+' ккал</h1><p>Ваш дневной бюджет на сладкое — это ~20% суточной нормы ('+k+' ккал). Столько сладкого можно без вреда для фигуры.</p></div>'+
      '<div class="onbbody">'+odots(2)+
      '<div class="muted" style="font-size:13px;margin-bottom:12px">Норма рассчитана по формуле Миффлина–Сан Жеора. В дневнике приложение помогает оставаться в пределах бюджета на сладкое.</div>'+
      (picks.length?'<div class="sec" style="padding-left:0">Рекомендуем под вашу цель</div><div class="hscroll" style="padding:6px 0 12px">'+picks.map(pcardHTML).join('')+'</div>':'')+
      '<button class="btn" data-act="onb-finish">Перейти в приложение</button></div>';
  }
};
if($("onb")&&$("onb").style.display!=="none"){renderOnb();}



renderDiary=function(){
  var t=diaryTotals();var k=sweetBudget();var rem=k-t.kcal;
  var pgoal=15;var pcur=t.p;var ppct=Math.min(Math.round(pcur/pgoal*100),100);
  var h='<div class="lt">Дневник сладкого</div><div class="muted" style="padding:0 20px 4px">Сегодня · бюджет на сладкое и перекусы</div>';
  h+='<div class="ringwrap">'+
     '<div class="ring">'+ringSVG(t.kcal,k)+'<div class="ctr"><div class="big">'+(rem>=0?rem:0)+'</div><div class="sm">'+(rem>=0?"ккал осталось":"на сегодня всё")+'</div></div></div>'+
     '<div class="macros">'+
       '<div style="font-size:14px;font-weight:600">Бюджет на сладкое</div>'+
       '<div style="font-size:13px;color:var(--label2)">Съедено '+t.kcal+' из '+k+' ккал</div>'+
       '<div style="font-size:12px;color:var(--label3);line-height:1.45">≈20% дневной нормы ('+norm()+' ккал)<br>Б '+t.p+' · Ж '+t.f+' · У '+t.c+' г</div>'+
     '</div></div>';
  h+='<div style="margin:10px 16px;padding:14px 16px;border-radius:16px;background:var(--card2);border:1px solid var(--sep)">'+
       '<div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-size:15px;font-weight:700">💪 Белок из перекусов</div><div style="font-size:13px;color:var(--label2)">'+pcur+' / '+pgoal+' г</div></div>'+
       '<div class="bar" style="margin:9px 0 7px"><i style="width:'+ppct+'%;background:var(--acc)"></i></div>'+
       '<div style="font-size:12px;color:var(--label3);line-height:1.4">'+(pcur>=pgoal?'Цель по белку на сегодня закрыта ✓':'Протеиновые снэки НК помогают добрать белок без лишнего сахара')+'</div>'+
       (pcur<pgoal?'<button class="btn sec" style="margin-top:11px" data-act2="proteinsnacks">Протеиновые снэки НК ›</button>':'')+
     '</div>';
  if(rem>=0){h+='<div style="padding:8px 16px"><button class="btn green" data-act="recommend">Подобрать перекус под остаток'+(rem>0?" ("+rem+" ккал)":"")+'</button></div>';}
  else{h+='<div style="margin:10px 16px;padding:14px 16px;border-radius:16px;background:rgba(255,178,62,.12);border:1px solid rgba(255,178,62,.32)"><div style="font-size:15px;font-weight:700;color:#FFB23E">🍫 Сегодня вы порадовали себя!</div><div style="font-size:13px;color:var(--label2);margin:4px 0 0;line-height:1.45">Это нормально — завтра бюджет на сладкое обновится.</div></div>';}
  if(!S.diary.length){
    h+='<div class="empty"><span class="gl">🍬</span>Пока пусто.<br>Добавляйте сладости и перекусы — увидите, сколько ещё можно сегодня без вреда.</div>';
  } else {
    var meals={"Завтрак":[],"Обед":[],"Ужин":[],"Перекус":[]};
    S.diary.forEach(function(e,i){(meals[e.meal]||meals["Перекус"]).push({e:e,i:i});});
    for(var m in meals){
      if(!meals[m].length)continue;
      h+='<div class="meal"><div class="mh"><span>'+m+'</span></div><div class="listcard">';
      meals[m].forEach(function(o){var p=prod(o.e.id);if(!p)return;var ct=CATS[p.cat];
        h+='<div class="row"><div class="ic" style="background:'+hexA(ct.c,.20)+'">'+ct.gl+'</div>'+
           '<div style="flex:1"><div class="gname">'+esc(p.n)+'</div><div class="sub">'+(o.e.qty?o.e.qty+' шт':o.e.grams+' г')+' · '+Math.round(p.kcal*o.e.grams/100)+' ккал</div></div>'+
           '<div class="heart" style="width:32px;height:32px;box-shadow:none;background:rgba(118,118,128,.12)" data-act="deldiary" data-i="'+o.i+'">✕</div></div>';
      });
      h+='</div></div>';
    }
    h+='<div style="height:10px"></div>';
  }
  return h;
};
document.addEventListener("click",function(e){
  if(e.target.closest('[data-act2="proteinsnacks"]')){if(typeof go==="function")go("category",{c:"Злаковые батончики"});}
});


function adjustDiary(i,delta){var e=S.diary[i];if(!e)return;var p=prod(e.id);var g=(p&&p.g)?p.g:(e.grams||1);var q=e.qty||Math.max(1,Math.round((e.grams||g)/g));q=Math.max(1,q+delta);e.qty=q;e.grams=q*g;save();render();}
renderDiary=function(){
  var t=diaryTotals();var k=sweetBudget();var rem=k-t.kcal;
  var h='<div class="lt">Дневник сладкого</div><div class="muted" style="padding:0 20px 4px">Сегодня · бюджет на сладкое и перекусы</div>';
  h+='<div class="ringwrap">'+
     '<div class="ring">'+ringSVG(t.kcal,k)+'<div class="ctr"><div class="big">'+(rem>=0?rem:0)+'</div><div class="sm">'+(rem>=0?"ккал осталось":"на сегодня всё")+'</div></div></div>'+
     '<div class="macros">'+
       '<div style="font-size:14px;font-weight:600">Бюджет на сладкое</div>'+
       '<div style="font-size:13px;color:var(--label2)">Съедено '+t.kcal+' из '+k+' ккал</div>'+
       '<div style="font-size:12px;color:var(--label3);line-height:1.45">≈20% дневной нормы ('+norm()+' ккал)<br>Б '+t.p+' · Ж '+t.f+' · У '+t.c+' г</div>'+
     '</div></div>';
  if(rem>=0){h+='<div style="padding:8px 16px"><button class="btn green" data-act="recommend">Подобрать перекус под остаток'+(rem>0?" ("+rem+" ккал)":"")+'</button></div>';}
  else{h+='<div style="margin:10px 16px;padding:14px 16px;border-radius:16px;background:rgba(255,178,62,.12);border:1px solid rgba(255,178,62,.32)"><div style="font-size:15px;font-weight:700;color:#FFB23E">🍫 Сегодня вы порадовали себя!</div><div style="font-size:13px;color:var(--label2);margin:4px 0 0;line-height:1.45">Это нормально — завтра бюджет на сладкое обновится.</div></div>';}
  if(!S.diary.length){
    h+='<div class="empty"><span class="gl">🍬</span>Пока пусто.<br>Добавляйте сладости и перекусы — увидите, сколько ещё можно сегодня без вреда.</div>';
  } else {
    var meals={"Завтрак":[],"Обед":[],"Ужин":[],"Перекус":[]};
    S.diary.forEach(function(e,i){(meals[e.meal]||meals["Перекус"]).push({e:e,i:i});});
    for(var m in meals){
      if(!meals[m].length)continue;
      h+='<div class="meal"><div class="mh"><span>'+m+'</span></div><div class="listcard">';
      meals[m].forEach(function(o){var p=prod(o.e.id);if(!p)return;var ct=CATS[p.cat];
        var qn=o.e.qty||Math.max(1,Math.round(o.e.grams/(p.g||o.e.grams||1)));
        h+='<div class="row"><div class="ic" style="background:'+hexA(ct.c,.20)+'">'+ct.gl+'</div>'+
           '<div style="flex:1;min-width:0"><div class="gname">'+esc(p.n)+'</div><div class="sub">'+Math.round(p.kcal*o.e.grams/100)+' ккал</div></div>'+
           '<div class="qty" style="gap:11px;margin-right:4px"><button data-act="diarydec" data-i="'+o.i+'">−</button><b style="min-width:16px;text-align:center;font-size:16px">'+qn+'</b><button data-act="diaryinc" data-i="'+o.i+'">+</button></div>'+
           '<div class="heart" style="width:30px;height:30px;box-shadow:none;background:rgba(118,118,128,.12)" data-act="deldiary" data-i="'+o.i+'">✕</div></div>';
      });
      h+='</div></div>';
    }
    h+='<div style="height:10px"></div>';
  }
  return h;
};
document.addEventListener("click",function(ev){
  var inc=ev.target.closest('[data-act="diaryinc"]');if(inc){adjustDiary(+inc.getAttribute("data-i"),1);return;}
  var dec=ev.target.closest('[data-act="diarydec"]');if(dec){adjustDiary(+dec.getAttribute("data-i"),-1);return;}
});
