/* js/ui/sheets.js
   Нижние шторки: добавление в дневник, оформление
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */
function openSheet(html){$("sheet").innerHTML='<div class="grip"></div>'+html;$("sheetbg").classList.add("on");}
function closeSheet(){$("sheetbg").classList.remove("on");}
function sheetAddDiary(id){
  var p=prod(id);
  openSheet('<div style="font-size:20px;font-weight:800;margin-bottom:4px">В дневник</div><div class="muted" style="margin-bottom:10px">'+esc(p.n)+'</div>'+
    '<div class="field"><label>Приём пищи</label><div class="seg" id="mealseg">'+
      ["Завтрак","Обед","Ужин","Перекус"].map(function(m,i){return '<button data-m="'+m+'" class="'+(i===3?"on":"")+'">'+m+'</button>';}).join('')+'</div></div>'+
    '<div class="field"><label>Количество, шт</label><div class="qty qbig" style="justify-content:flex-start;gap:20px;width:fit-content"><button type="button" id="qdec">−</button><b id="qn">1</b><button type="button" id="qinc">+</button></div></div>'+
    '<div class="muted" id="grk" style="margin:-2px 2px 12px">≈ '+portionKcal(p)+' ккал · 1 шт ('+p.g+' г)</div>'+
    '<button class="btn" data-act="confirmdiary" data-id="'+id+'">Добавить</button>');
  var seg=$("mealseg");seg.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
    [].forEach.call(seg.children,function(x){x.classList.remove("on");});b.classList.add("on");});
  var _pcs=1;function _updqn(){$("qn").textContent=_pcs;$("grk").textContent="≈ "+(portionKcal(p)*_pcs)+" ккал · "+_pcs+" шт ("+(p.g*_pcs)+" г)";}
  $("qinc").addEventListener("click",function(){if(_pcs<99){_pcs++;_updqn();}});
  $("qdec").addEventListener("click",function(){if(_pcs>1){_pcs--;_updqn();}});
}
function sheetCheckout(){
  openSheet('<div style="font-size:20px;font-weight:800;margin-bottom:10px">Оформление заказа</div>'+
    '<div class="field"><label>Имя получателя</label><input id="ck_name" value="'+(S.profile&&S.profile.name?esc(S.profile.name):"")+'" placeholder="Ваше имя"></div>'+
    deliveryField()+
    '<div class="field"><label>Способ оплаты</label><div class="seg"><button class="on">Картой</button><button>При получении</button></div></div>'+
    '<div class="field"><label>Промокод</label><div style="display:flex;gap:8px"><input id="ck_promo" placeholder="Напр. ЗОЖ10" value="'+(S.promo?"ЗОЖ10":"")+'"><button class="btn sec" style="width:auto;padding:13px 18px" data-act2="promo">ОК</button></div></div>'+
    bonusField()+
    '<div class="cobreak"><div class="corow"><span>Товары</span><span>'+money(cartTotal())+'</span></div>'+(S.promo?'<div class="corow"><span>Скидка '+S.promo+'%</span><span style="color:var(--acc)">−'+money(promoDisc())+'</span></div>':'')+'<div class="corow"><span>Доставка</span><span>'+(shipping()?money(shipping()):'бесплатно')+'</span></div>'+(bonusSpend()?'<div class="corow"><span>Списано баллами</span><span style="color:var(--acc)">−'+money(bonusSpend())+'</span></div>':'')+'</div>'+
    '<div class="totalbar"><span>К оплате</span><b>'+money(payable())+'</b></div>'+
    '<button class="btn green" data-act="pay">Оплатить</button>'+
    '<div class="muted" style="font-size:12px;text-align:center;margin-top:10px">Демонстрация: реальная оплата не производится.</div>');
}

/* ---------------- ONBOARDING ---------------- */
