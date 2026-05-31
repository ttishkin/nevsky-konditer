/* js/screens/product.js
   Экран карточки товара
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */
function renderProduct(id){
  var p=prod(id);if(!p)return renderCatalog();if(!S._q)S._q=1;
  var ct=CATS[p.cat];var fav=S.fav.indexOf(id)>=0;
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Назад</div><div class="title">'+esc(p.cat)+'</div><div class="shareb" data-act2="share" data-id="'+id+'"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.7 13.5l6.6 3.9M15.3 6.6l-6.6 3.9"/></svg></div></div>';
  h+=galleryHTML(p);
  h+='<div class="pad">';
  h+='<div class="h1">'+esc(p.n)+'</div>';
  h+=tagPills(p);h+='<div style="margin-top:8px">'+stars(p)+'</div>';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px">'+priceBlockDetail(p)+'<span class="muted">порция '+p.g+' г</span></div>';
  h+='<div class="kbju">'+
     '<div class="kb"><div class="v">'+portionKcal(p)+'</div><div class="l">ккал / порция</div></div>'+
     '<div class="kb"><div class="v">'+p.p+'</div><div class="l">белки /100 г</div></div>'+
     '<div class="kb"><div class="v">'+p.f+'</div><div class="l">жиры /100 г</div></div>'+
     '<div class="kb"><div class="v">'+p.c+'</div><div class="l">углев /100 г</div></div></div>';
  h+='<div class="block"><h3>Состав</h3><p>'+esc(p.sostav)+'</p></div>';h+=specsBlock(p);
  h+='<div class="block"><h3>Чем полезно</h3><p>'+esc(p.benefit)+'</p></div>';h+=reviewsBlock(p);
  h+='<div class="muted" style="font-size:12px;padding:0 2px">КБЖУ ориентировочные (открытые источники), уточняются по упаковке.</div>';
  h+='</div>';
  h+=relatedBlock(p);
  h+='<div class="qrow"><span class="muted">Количество</span><div class="qty qbig"><button data-act2="qdec">−</button><b id="qv">'+(S._q||1)+'</b><button data-act2="qinc">+</button></div></div>';
  h+='<div class="stickybar">'+
     '<div class="heart" data-act="fav" data-id="'+id+'">'+icon("heart",fav?"#FF375F":"#5F6470")+'</div>'+
     '<button class="btn sec" style="flex:1" data-act="todiary" data-id="'+id+'">В дневник</button>'+
     '<button class="btn" style="flex:1.3" data-act2="addq" data-id="'+id+'">В корзину</button></div>';
  return h;
}

/* ---------------- RENDER: DIARY ---------------- */
