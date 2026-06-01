/* js/features/commerce.js — доставка, рейтинги, скидки/промокоды, баннеры, share */

function deliveryBar(){
  var t=cartTotal();var FREE=1000;
  if(t>=FREE)return '<div class="delivok">🚚 Бесплатная доставка подключена</div>';
  var pct=Math.max(4,Math.round(t/FREE*100));
  return '<div class="delivbar"><div class="dtxt">До бесплатной доставки осталось <b>'+(FREE-t)+' ₽</b></div><div class="dprog"><i style="width:'+pct+'%"></i></div></div>';
}
(function(){
  var _r3=render;var lastLen=S.stack.length;
  render=function(){
    _r3();
    var app=$("app");if(!app)return;
    var cur=S.stack.length;
    var cls=cur>lastLen?'nav-push':(cur<lastLen?'nav-pop':'nav-fade');
    app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add(cls);
    lastLen=cur;
    var imgs=app.querySelectorAll('img.pimg,img.himg');
    for(var i=0;i<imgs.length;i++){var im=imgs[i];
      if(im.complete&&im.naturalWidth>0){im.classList.add('ld');}
      else{im.addEventListener('load',function(){this.classList.add('ld');});}
    }
  };
})();
function rating(p){return {s:(4.3+((p.id*7)%6)/10).toFixed(1), c:14+((p.id*37)%230)};}
function stars(p){var r=rating(p);return '<span class="rate"><span class="st">★</span> '+r.s+' <span class="muted" style="font-size:12px;font-weight:400">· '+r.c+' оценок</span></span>';}
function relatedBlock(p){
  var same=P.filter(function(x){return x.cat===p.cat&&x.id!==p.id;});
  var other=P.filter(function(x){return x.cat!==p.cat&&x.id!==p.id;});
  var list=same.concat(other).slice(0,8);
  if(!list.length)return '';
  return '<div class="sec" style="margin-top:4px">С этим часто покупают</div><div class="hscroll">'+list.map(pcardHTML).join('')+'</div>';
}
function shipping(){return cartTotal()>=1000?0:199;}
document.addEventListener("click",function(e){
  var el=e.target.closest("[data-act2]");if(!el)return;
  var a=el.getAttribute("data-act2");var id=+el.getAttribute("data-id");
  if(a==="qinc"){S._q=Math.min(99,(S._q||1)+1);var q1=document.getElementById("qv");if(q1)q1.textContent=S._q;}
  else if(a==="qdec"){S._q=Math.max(1,(S._q||1)-1);var q2=document.getElementById("qv");if(q2)q2.textContent=S._q;}
  else if(a==="addq"){S.cart[id]=(S.cart[id]||0)+(S._q||1);save();renderTabs();toast("Добавлено в корзину: "+(S._q||1));}
});


var DISC={3:15,8:20,10:15,19:25,24:20};
S.promo=S.promo||0;S.sort=S.sort||"pop";
function _disc(p){return (typeof DISC!=='undefined'&&DISC&&DISC[p.id])?DISC[p.id]:0;}
function saleBadge(p){var d=_disc(p);return d?'<span class="sale">−'+d+'%</span>':'';}
function priceOf(p){var d=_disc(p);return d?Math.round(p.price*(1-d/100)):p.price;}
function priceHTML(p){var d=_disc(p);if(d)return '<span class="oldp">'+money(p.price)+'</span><span class="price">'+money(priceOf(p))+'</span>';return '<span class="price">'+money(p.price)+'</span>';}
function priceBlockDetail(p){var d=_disc(p);if(d)return '<span><span class="oldp" style="font-size:18px">'+money(p.price)+'</span> <span class="h1" style="font-size:26px;color:var(--acc)">'+money(priceOf(p))+'</span></span>';return '<span class="h1" style="font-size:26px">'+money(p.price)+'</span>';}
cartTotal=function(){var t=0;for(var k in S.cart){var p=prod(+k);if(p)t+=priceOf(p)*S.cart[k];}return t;};
function promoDisc(){return Math.round(cartTotal()*(S.promo||0)/100);}
function payable(){return cartTotal()+shipping()-promoDisc();}
var REVP=[["Анна","Беру на перекус вместо шоколадки — вкусно и не так калорийно.",5],["Дмитрий","Удобный размер, реально утоляет голод между делами.",5],["Мария","Состав радует, вкус натуральный. Заказываю повторно.",4],["Игорь","Баланс цены и качества хороший, ребёнку тоже зашло.",5],["Ольга","Ношу в спортзал, выручает после тренировки.",5],["Сергей","Нормально, чуть сладковато, но свежее и вкусное.",4]];
function reviewsBlock(p){var r=rating(p);var a=REVP[(p.id*2)%REVP.length],b=REVP[(p.id*2+1)%REVP.length];
  function rv(x){return '<div style="padding:10px 0;border-top:1px solid var(--sep)"><div style="display:flex;justify-content:space-between"><b style="font-size:14px">'+x[0]+'</b><span style="color:#E8C24A;font-size:13px">'+Array(x[2]+1).join('★')+'</span></div><div class="muted" style="font-size:14px;margin-top:3px">'+x[1]+'</div></div>';}
  return '<div class="block"><h3>Отзывы</h3><div style="display:flex;align-items:center;gap:10px;margin-bottom:2px"><span class="h1" style="font-size:28px">'+r.s+'</span><span><div style="color:#E8C24A;font-size:14px">★★★★★</div><div class="muted" style="font-size:12px">'+r.c+' оценок</div></span></div>'+rv(a)+rv(b)+'</div>';}
var SORTS=[["pop","Популярные"],["priceA","Дешевле"],["kcalA","Меньше ккал"],["rate","По рейтингу"]];
function sortChips(){return '<div class="chips">'+SORTS.map(function(s){return '<div class="chip '+(S.sort===s[0]?"on":"")+'" data-act2="sort" data-s="'+s[0]+'">'+s[1]+'</div>';}).join('')+'</div>';}
function sortList(list){var l=list.slice();
  if(S.sort==="priceA")l.sort(function(a,b){return priceOf(a)-priceOf(b);});
  else if(S.sort==="kcalA")l.sort(function(a,b){return portionKcal(a)-portionKcal(b);});
  else if(S.sort==="rate")l.sort(function(a,b){return parseFloat(rating(b).s)-parseFloat(rating(a).s);});
  return l;}
document.addEventListener("click",function(e){
  var el=e.target.closest("[data-act2]");if(!el)return;
  var a=el.getAttribute("data-act2");
  if(a==="promo"){var inp=document.getElementById("ck_promo");var v=(inp?inp.value:"").trim().toUpperCase();if(v==="ЗОЖ10"||v==="ZOZH10"){S.promo=10;toast("Промокод применён: −10%");}else{S.promo=0;toast("Промокод не найден");}sheetCheckout();}
  else if(a==="sort"){var s=el.getAttribute("data-s");S.sort=(S.sort===s)?"":s;render();}
});
function banners(){
  var B=[
    ["binfo","","Скидки до −25%","на сладкое — смотри «Выгодно»","linear-gradient(135deg,#FF375F,#7A1F4F)"],
    ["bfilter","sugar","Без сахара","полезные перекусы","linear-gradient(135deg,#1E7D3A,#0E3F1E)"],
    ["bfilter","prot","Заряд белка","протеиновые батончики","linear-gradient(135deg,#6A4FB0,#241640)"]
  ];
  return '<div class="bnrs">'+B.map(function(b){return '<div class="bnr" data-act2="'+b[0]+'" data-f="'+b[1]+'" style="background:'+b[4]+'"><div class="bt">'+b[2]+'</div><div class="bs">'+b[3]+'</div><div class="bcta">Открыть →</div></div>';}).join('')+'</div>';
}
function discountsSection(){
  var ds=P.filter(function(p){return _disc(p);});
  if(!ds.length)return '';
  return '<div class="sec secrow"><span>Выгодно · скидки</span></div><div class="hscroll">'+ds.map(pcardHTML).join('')+'</div>';
}
document.addEventListener("click",function(e){
  var el=e.target.closest("[data-act2]");if(!el)return;
  var a=el.getAttribute("data-act2");
  if(a==="bfilter"){S.filter=el.getAttribute("data-f")||"all";S.query="";S._focusQ=false;render();}
  else if(a==="binfo"){go("discounts");}
  else if(a==="share"){var p=prod(+el.getAttribute("data-id"));var txt=p?(p.n+" — "+money(priceOf(p))+", «Невский Кондитер»"):"Невский Кондитер · ЗОЖ";
    if(navigator.share){navigator.share({title:"Невский Кондитер · ЗОЖ",text:txt}).catch(function(){});}
    else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){toast("Ссылка скопирована");},function(){toast("Поделиться: готово");});}
    else{toast("Поделиться: готово");}}
});

