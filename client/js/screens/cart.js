/* js/screens/cart.js
   Экран корзины
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */
function renderCart(){
  var ids=Object.keys(S.cart).filter(function(k){return S.cart[k]>0;});
  var h='<div class="lt">Корзина</div>';
  if(!ids.length){h+='<div class="empty"><span class="gl">🛒</span>Корзина пуста.<br>Добавьте полезные сладости из каталога.</div>';h+='<div class="sec">Хиты продаж</div><div class="hscroll">'+P.filter(function(p){return p.hit;}).map(pcardHTML).join('')+'</div>';return h;}
  h+='<div class="listcard">';
  ids.forEach(function(k){var p=prod(+k);if(!p)return;var ct=CATS[p.cat];var q=S.cart[k];
    h+='<div class="row" style="cursor:default"><div class="ic" style="background:'+hexA(ct.c,.20)+'">'+ct.gl+'</div>'+
       '<div style="flex:1"><div class="gname">'+esc(p.n)+'</div><div class="sub">'+money(priceOf(p))+' · '+p.g+' г</div></div>'+
       '<div class="heart" style="width:36px;height:36px;box-shadow:none;background:rgba(118,118,128,.14);margin-right:8px;font-size:18px" data-act="todiary" data-id="'+p.id+'" title="В дневник">📋</div>'+
       '<div class="qty qbig"><button data-act="dec" data-id="'+p.id+'">−</button><b>'+q+'</b><button data-act="inc" data-id="'+p.id+'">+</button></div></div>';
  });
  h+='</div>';
  h+='<div class="pad">'+deliveryBar()+'<div class="totalbar"><span>Итого</span><b>'+money(cartTotal())+'</b></div>'+
     '<button class="btn" data-act="checkout">Оформить заказ</button>'+
     '<div class="muted" style="font-size:12px;text-align:center;margin-top:10px">Оплата демонстрационная (прототип).</div></div>';
  return h;
}

/* ---------------- RENDER: PROFILE ---------------- */
