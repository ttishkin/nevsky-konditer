/* js/screens/onboarding.js — расчёт нормы и онбординг */
function calcKcal(f){
  var bmr=10*f.weight+6.25*f.height-5*f.age+(f.sex==="m"?5:-161);
  var tdee=bmr*parseFloat(f.act);
  if(f.goal==="lose")tdee*=0.85;else if(f.goal==="gain")tdee*=1.12;
  return Math.round(tdee/10)*10;
}
function renderOnb(){
  var o=$("onb");var f=S.onbForm;
  if(S.onbStep===0){
    o.innerHTML='<div class="onbhero splash">'+
      '<div class="brandbadge"><img src="https://konditer.net/bitrix/templates/nk/images/logo.png" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><span class="brandmono" style="display:none">НК</span></div>'+
      '<div class="brandname">Невский Кондитер</div>'+
      '<div class="brandzozh">ЗОЖ · правильное питание</div>'+
      '<div class="brandslogan">«Потому что хочется сладкого!»</div>'+
      '</div>'+
      '<div class="onbbody"><button class="btn" data-act="onb-next">Начать</button><button class="btn ghost" style="margin-top:8px" data-act="onb-skip">Пропустить</button></div>';
  } else if(S.onbStep===1){
    o.innerHTML='<div class="onbbody" style="padding-top:30px"><span class="pill" style="background:rgba(91,63,160,.12);color:var(--nkA)">Шаг 1 из 2</span>'+
      '<div class="h1" style="margin-bottom:16px">Расскажите о себе</div>'+
      '<div class="field"><label>Пол</label><div class="seg" id="o_sex"><button data-v="m" class="'+(f.sex==="m"?"on":"")+'">Мужской</button><button data-v="f" class="'+(f.sex==="f"?"on":"")+'">Женский</button></div></div>'+
      '<div class="field"><label>Возраст</label><input id="o_age" type="number" inputmode="numeric" value="'+f.age+'"></div>'+
      '<div class="field"><label>Рост, см</label><input id="o_h" type="number" inputmode="numeric" value="'+f.height+'"></div>'+
      '<div class="field"><label>Вес, кг</label><input id="o_w" type="number" inputmode="numeric" value="'+f.weight+'"></div>'+
      '<div class="field"><label>Активность</label><select id="o_act"><option value="1.2"'+sel(f.act,"1.2")+'>Минимальная (сидячий образ)</option><option value="1.375"'+sel(f.act,"1.375")+'>Лёгкая (1–3 трен/нед)</option><option value="1.55"'+sel(f.act,"1.55")+'>Средняя (3–5 трен/нед)</option><option value="1.725"'+sel(f.act,"1.725")+'>Высокая (6–7 трен/нед)</option></select></div>'+
      '<div class="field"><label>Цель</label><div class="seg" id="o_goal"><button data-v="lose" class="'+(f.goal==="lose"?"on":"")+'">Похудеть</button><button data-v="keep" class="'+(f.goal==="keep"?"on":"")+'">Поддержать</button><button data-v="gain" class="'+(f.goal==="gain"?"on":"")+'">Набрать</button></div></div>'+
      '<button class="btn" style="margin-top:8px" data-act="onb-calc">Рассчитать норму</button></div>';
    bindSeg("o_sex","sex");bindSeg("o_goal","goal");
  } else if(S.onbStep===2){
    var k=calcKcal(f);S.onbForm.kcal=k;
    var mt={p:Math.round(k*0.25/4),f:Math.round(k*0.30/9),c:Math.round(k*0.45/4)};
    o.innerHTML='<div class="onbhero" style="min-height:48%"><div class="logo">🎯</div><h1>'+k+' ккал/день</h1><p>Ваша ориентировочная суточная норма по формуле Миффлина–Сан Жеора.</p></div>'+
      '<div class="onbbody"><div class="listcard" style="margin:0 0 16px">'+
        row2("Белки",mt.p+" г")+row2("Жиры",mt.f+" г")+row2("Углеводы",mt.c+" г")+'</div>'+
      '<div class="muted" style="margin-bottom:14px;font-size:13px">Норму можно изменить вручную в профиле в любой момент.</div>'+
      '<button class="btn" data-act="onb-finish">Перейти в приложение</button></div>';
  }
}
function sel(a,b){return a===b?" selected":"";}
function bindSeg(elid,key){var el=$(elid);if(!el)return;el.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
  [].forEach.call(el.children,function(x){x.classList.remove("on");});b.classList.add("on");S.onbForm[key]=b.getAttribute("data-v");});}
function readOnbForm(){var f=S.onbForm;f.age=+$("o_age").value||25;f.height=+$("o_h").value||175;f.weight=+$("o_w").value||70;f.act=$("o_act").value;}
