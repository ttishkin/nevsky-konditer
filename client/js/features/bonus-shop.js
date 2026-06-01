/* js/features/bonus-shop.js — новинки и магазин за баллы */

function renderDiscounts(){
  var ds=P.filter(function(p){return _disc(p);});
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Каталог</div><div class="title">Скидки и акции</div><div class="spacer"></div></div>';
  if(!ds.length){h+='<div class="empty"><span class="gl">🏷️</span>Сейчас акций нет.</div>';return h;}
  h+='<div class="sec">Товары со скидкой: '+ds.length+'</div>';
  h+='<div style="display:flex;flex-wrap:wrap;gap:14px;padding:6px 16px 20px">'+ds.map(pcardHTML).join('')+'</div>';
  return h;
}
(function(){var _rd=render;render=function(){
  var top=S.stack[S.stack.length-1];
  if(top&&top.screen==="discounts"){var app=$("app");if(!app)return;app.innerHTML=renderDiscounts();renderTabs();app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add('nav-push');var ims=app.querySelectorAll('img.pimg,img.himg');for(var i=0;i<ims.length;i++){var im=ims[i];if(im.complete&&im.naturalWidth>0)im.classList.add('ld');else im.addEventListener('load',function(){this.classList.add('ld');});}return;}
  _rd();
};})();


S.useBonus=S.useBonus||false;
function cashbackPct(){var l=loyalty();return l.name==="Золото"?10:(l.name==="Серебро"?7:5);}
function bonusSpend(){return S.useBonus?Math.min(S.points||0,Math.floor(cartTotal()*0.3)):0;}
payable=function(){return cartTotal()+shipping()-promoDisc()-bonusSpend();};
function bonusField(){
  if(!(S.points>0))return '';
  var sp=Math.min(S.points,Math.floor(cartTotal()*0.3));
  return '<div class="field"><div class="row" style="cursor:pointer;border:1px solid var(--sep);border-radius:11px;background:var(--card)" data-act2="usebonus"><div class="ic" style="background:'+hexA("#C7F94B",.2)+'">🎁</div><div style="flex:1"><div class="gname" style="font-size:14px">Списать баллы</div><div class="sub">доступно '+S.points+' · спишется до '+sp+' ₽</div></div><div class="sw'+(S.useBonus?' on':'')+'"></div></div></div>';
}
function renderNovelties(){
  var ds=P.filter(function(p){return p.nov;});
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Каталог</div><div class="title">Новинки</div><div class="spacer"></div></div>';
  h+='<div class="sec">Новинок: '+ds.length+'</div>';
  h+='<div style="display:flex;flex-wrap:wrap;gap:14px;padding:6px 16px 20px">'+ds.map(pcardHTML).join('')+'</div>';
  return h;
}
function renderBonuses(){
  var l=loyalty();var pct=cashbackPct();
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Назад</div><div class="title">Бонусы НК</div><div class="spacer"></div></div>';
  h+='<div class="loycard" style="text-align:center;margin:8px 16px"><div class="muted" style="font-size:12px">Доступно бонусов</div><div style="font-size:42px;font-weight:800;color:var(--acc);line-height:1.1">'+(S.points||0)+'</div><div class="muted" style="font-size:13px;margin-top:4px">1 балл = 1 ₽ · статус «'+l.name+'» · кэшбэк '+pct+'%</div></div>';
  h+='<div class="block" style="margin:10px 16px"><h3>Как копить</h3><p>Кэшбэк за заказы: Бронза — 5%, Серебро — 7%, Золото — 10% от суммы.<br>+200 баллов за регистрацию (приветственные).<br>+500 баллов за приглашённого друга (промокод ДРУГ500).</p></div>';
  h+='<div class="block" style="margin:10px 16px"><h3>Как тратить</h3><p>1 балл = 1 ₽. В оформлении заказа включите «Списать баллы» — спишется до 30% суммы заказа.</p></div>';
  h+='<div class="pad"><button class="btn" data-act2="tocatalog">В каталог за бонусами</button></div>';
  return h;
}
(function(){var _r16=render;render=function(){
  var top=S.stack[S.stack.length-1];var m={novelties:renderNovelties,bonuses:renderBonuses};
  if(top&&m[top.screen]){var app=$("app");if(!app)return;app.innerHTML=m[top.screen]();renderTabs();app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add('nav-push');var ims=app.querySelectorAll('img.pimg,img.himg');for(var i=0;i<ims.length;i++){var im=ims[i];if(im.complete&&im.naturalWidth>0)im.classList.add('ld');else im.addEventListener('load',function(){this.classList.add('ld');});}return;}
  _r16();
};})();
document.addEventListener("click",function(e){var el=e.target.closest("[data-act2]");if(!el)return;var a=el.getAttribute("data-act2");
  if(a==="novelties")go("novelties");
  else if(a==="bonuses")go("bonuses");
  else if(a==="tocatalog"){S.tab="catalog";S.stack=[];render();}
  else if(a==="usebonus"){S.useBonus=!S.useBonus;if(S.useBonus&&bonusSpend()<=0){S.useBonus=false;toast("Сумма заказа слишком мала");}sheetCheckout();}
});
document.addEventListener("click",function(e){if(e.target.closest('[data-act="onb-finish"]')){if(!LS.get("nk_welcome","")){S.points=(S.points||0)+200;LS.set("nk_pts",S.points);LS.set("nk_welcome","1");}}});


function renderBonusTab(){
  var l=loyalty();var pct=cashbackPct();
  var h='<div class="lt">Бонусы</div>';
  h+='<div class="loycard" style="text-align:center;margin:2px 16px 4px"><div class="muted" style="font-size:12px">Доступно бонусов</div><div style="font-size:44px;font-weight:800;color:var(--acc);line-height:1.1">'+(S.points||0)+'</div><div class="muted" style="font-size:13px;margin-top:4px">1 балл = 1 ₽ · статус «'+l.name+'» · кэшбэк '+pct+'%</div></div>';
  h+='<div class="block" style="margin:10px 16px"><h3>Как копить</h3><p>Кэшбэк за заказы: Бронза — 5%, Серебро — 7%, Золото — 10% от суммы.<br>+200 баллов за регистрацию (приветственные).<br>+500 баллов за приглашённого друга.</p></div>';
  h+='<div class="block" style="margin:10px 16px"><h3>Как тратить</h3><p>1 балл = 1 ₽. В оформлении заказа включите «Списать баллы» — спишется до 30% суммы заказа.</p></div>';
  h+='<div class="block" style="margin:10px 16px"><h3>Пригласить друга</h3><p>Промокод <b style="color:var(--acc)">ДРУГ500</b>: другу −500 ₽ на первый заказ, вам — 500 бонусов после его покупки.</p></div>';
  h+='<div class="pad"><button class="btn" data-act2="tocatalog">В каталог за бонусами</button></div>';
  return h;
}
(function(){var _r17=render;render=function(){
  if(!S.stack.length&&S.tab==="bonus"){var app=$("app");if(!app)return;app.innerHTML=renderBonusTab();renderTabs();app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add('nav-fade');return;}
  _r17();
};})();


function bcardHTML(p){
  var pr=priceOf(p);var can=(S.points||0)>=pr;
  return '<div class="pcard" data-act="open" data-id="'+p.id+'">'+saleBadge(p)+thumb(p)+
    '<div class="pname">'+esc(p.n)+'</div>'+
    '<div class="pmeta"><span><span class="kcal">'+portionKcal(p)+' ккал</span><br><span class="price" style="color:var(--acc)">'+pr+' Б</span></span>'+
    '<button class="qadd" data-act="redeem" data-id="'+p.id+'" aria-label="Обменять"'+(can?'':' style="background:rgba(120,120,130,.4);color:var(--label3)"')+'>↺</button></div></div>';
}
renderBonusTab=function(){
  var h='<div class="lt">Бонусы</div>';
  h+='<div class="loycard" style="display:flex;justify-content:space-between;align-items:center;margin:2px 16px 8px">'+
     '<div><div class="muted" style="font-size:12px">Ваш баланс</div><div style="font-size:30px;font-weight:800;color:var(--acc)">'+(S.points||0)+' Б</div></div>'+
     '<div class="muted" style="font-size:12px;text-align:right">1 Б = 1 ₽ · кэшбэк '+cashbackPct()+'%<br><span data-act2="bonuses" style="color:var(--acc);cursor:pointer">как это работает ›</span></div></div>';
  h+='<div class="sec">Обменять баллы на товары</div>';
  h+='<div style="display:flex;flex-wrap:wrap;gap:14px;padding:6px 16px 24px">'+P.map(bcardHTML).join('')+'</div>';
  return h;
};
document.addEventListener("click",function(e){
  var el=e.target.closest('[data-act="redeem"]');if(!el)return;
  var p=prod(+el.getAttribute("data-id"));if(!p)return;var pr=priceOf(p);
  if((S.points||0)<pr){toast("Не хватает баллов: нужно "+pr);return;}
  S.points-=pr;LS.set("nk_pts",S.points);
  if(typeof S.redeemed!=="undefined"){S.redeemed.unshift(p.id);}else{S.redeemed=[p.id];}
  render();toast("Обменяно за "+pr+" баллов 🎁");
});


(function(){var _rimg=render;render=function(){
  _rimg();
  try{var app=document.getElementById('app');if(!app)return;
    var ims=app.querySelectorAll('img.pimg,img.himg');
    for(var i=0;i<ims.length;i++){var im=ims[i];
      if(im.complete&&im.naturalWidth>0){im.classList.add('ld');}
      else{im.addEventListener('load',function(){this.classList.add('ld');});}
    }
  }catch(e){}
};})();

