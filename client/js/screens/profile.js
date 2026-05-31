/* js/screens/profile.js
   Экран профиля
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */
function actLabel(a){return {"1.2":"Минимальная","1.375":"Лёгкая","1.55":"Средняя","1.725":"Высокая"}[a]||a;}
function goalLabel(g){return {lose:"Похудение",keep:"Поддержание",gain:"Набор массы"}[g]||g;}
function renderProfile(){
  var pr=S.profile;var mt=macroTargets();
  var h='<div class="lt">Профиль</div>';
  if(pr){
    h+='<div class="ringwrap" style="display:block">'+
       '<div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:13px;color:var(--label2)">Бюджет на сладкое в день</div><div class="h1" style="font-size:30px">'+Math.round(pr.kcal*0.2)+' ккал</div></div><div style="text-align:right;font-size:12px;color:var(--label2)">20% от нормы<br>'+pr.kcal+' ккал/день</div></div>'+
       '</div>';
    h+='<div class="listcard">'+
       row2("Цель",goalLabel(pr.goal))+row2("Пол",pr.sex==="m"?"Мужской":"Женский")+
       row2("Возраст",pr.age+" лет")+row2("Рост",pr.height+" см")+row2("Вес",pr.weight+" кг")+
       row2("Активность",actLabel(pr.act))+'</div>';
    h+='<div class="pad"><button class="btn sec" data-act="editprofile">Изменить данные</button></div>';
  } else {
    h+='<div class="empty"><span class="gl">⚙️</span>Профиль не заполнен.<br>Рассчитайте свою норму калорий.</div>';
    h+='<div class="pad"><button class="btn" data-act="editprofile">Рассчитать норму</button></div>';
  }
  var favs=S.fav.map(prod).filter(Boolean);
  h+='<div class="sec" style="margin-top:8px">Избранное</div>';
  if(!favs.length){h+='<div class="muted" style="padding:0 20px 14px">Пока пусто — добавляйте товары через ♥</div>';}
  else{h+='<div class="listcard">'+favs.map(function(p){var ct=CATS[p.cat];
    return '<div class="row" data-act="open" data-id="'+p.id+'"><div class="ic" style="background:'+hexA(ct.c,.20)+'">'+ct.gl+'</div><div style="flex:1"><div class="gname">'+esc(p.n)+'</div><div class="sub">'+portionKcal(p)+' ккал · '+money(p.price)+'</div></div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>';
  }).join('')+'</div>';}
  h+='<div class="muted" style="font-size:12px;text-align:center;padding:18px">Невский Кондитер · ЗОЖ · прототип<br>Дипломный проект</div>';
  return h;
}
function row2(a,b){return '<div class="row" style="cursor:default"><div class="gname" style="flex:1">'+a+'</div><div class="sub" style="font-size:16px;color:var(--label)">'+esc(String(b))+'</div></div>';}

/* ---------------- MAIN RENDER ---------------- */
