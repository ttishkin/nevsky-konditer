/* js/features/catalog-extras.js — избранное, галерея, поиск, товар дня, категория */

var SHELF={"Протеиновые батончики":"9 месяцев","Мармелад":"6 месяцев","Желейные конфеты":"9 месяцев"};
function shelfLife(p){return SHELF[p.cat]||"12 месяцев";}
function allergens(p){
  if(p.tags.indexOf("nut")>=0||p.cat==="Ореховые батончики")return "арахис, орехи; возможны следы молока и глютена";
  if(p.cat==="Злаковые батончики")return "злаки (глютен); возможны следы орехов и молока";
  if(p.cat==="Протеиновые батончики")return "молочный белок; возможны следы орехов и глютена";
  return "возможны следы орехов, молока и глютена";
}
function specsBlock(p){
  return '<div class="block specs"><h3>Характеристики</h3>'+
    '<div class="srow"><span class="sk">Масса</span><span class="sv">'+p.g+' г</span></div>'+
    '<div class="srow"><span class="sk">Категория</span><span class="sv">'+esc(p.cat)+'</span></div>'+
    '<div class="srow"><span class="sk">Срок годности</span><span class="sv">'+shelfLife(p)+'</span></div>'+
    '<div class="srow"><span class="sk">Хранение</span><span class="sv">t 18±5 °C, ≤75%</span></div>'+
    '<div class="srow"><span class="sk">Аллергены</span><span class="sv">'+allergens(p)+'</span></div>'+
    '<div class="srow"><span class="sk">Производитель</span><span class="sv">ГК «Невский Кондитер»</span></div>'+
  '</div>';
}
function renderFavorites(){
  var favs=S.fav.map(prod).filter(Boolean);
  var h='<div class="lt">Избранное</div>';
  if(!favs.length){h+='<div class="empty"><span class="gl">♡</span>Здесь пока пусто.<br>Добавляйте товары кнопкой ♥ в карточке.</div>';h+='<div class="sec">Хиты продаж</div><div class="hscroll">'+P.filter(function(p){return p.hit;}).map(pcardHTML).join('')+'</div>';return h;}
  h+='<div class="sec">'+favs.length+' в избранном</div>';
  h+='<div style="display:flex;flex-wrap:wrap;gap:14px;padding:2px 16px 20px">'+favs.map(pcardHTML).join('')+'</div>';
  return h;
}
(function(){var _rf=render;render=function(){
  if(!S.stack.length&&S.tab==="fav"){var app=$("app");if(!app)return;app.innerHTML=renderFavorites();renderTabs();
    app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add('nav-fade');
    var imgs=app.querySelectorAll('img.pimg,img.himg');for(var i=0;i<imgs.length;i++){var im=imgs[i];if(im.complete&&im.naturalWidth>0)im.classList.add('ld');else im.addEventListener('load',function(){this.classList.add('ld');});}
    return;}
  _rf();
};})();
document.addEventListener("click",function(e){
  var el=e.target.closest('[data-act="addcart"],[data-act2="addq"]');if(!el)return;
  var cart=document.querySelector('.tab[data-t="cart"]');if(!cart)return;
  var cr=cart.getBoundingClientRect();var er=el.getBoundingClientRect();
  var sx=e.clientX||(er.left+er.width/2),sy=e.clientY||(er.top+er.height/2);
  var dot=document.createElement('div');dot.className='flydot';dot.style.left=sx+'px';dot.style.top=sy+'px';
  document.body.appendChild(dot);
  requestAnimationFrame(function(){dot.style.transform='translate('+(cr.left+cr.width/2-sx)+'px,'+(cr.top+cr.height/2-sy)+'px) scale(.35)';dot.style.opacity='0.25';});
  setTimeout(function(){if(dot.parentNode)dot.parentNode.removeChild(dot);},560);
},true);


var POPQ=["без сахара","батончик","мармелад","протеин","орех","желе"];
S.searchHistory=S.searchHistory||LS.get("nk_sh",[]);
function galleryHTML(p){
  var ct=CATS[p.cat];var u=IMG[p.id];
  var bdg=(p.hit?'<span class="gbadge">ХИТ ПРОДАЖ</span>':(p.nov?'<span class="gbadge">НОВИНКА</span>':''))+(_disc(p)?'<span class="gbadge sale" style="margin-left:6px">−'+_disc(p)+'%</span>':'');
  if(!u){return '<div class="pgwrap"><div class="badgeabs">'+bdg+'</div><div class="hero" style="background:radial-gradient(120% 95% at 72% 12%,'+hexA(ct.c,.40)+',#0E0F13 66%)"><span class="gl gf">'+ct.gl+'</span></div></div>';}
  function sl(bg,z){return '<div class="pgslide" style="background:'+bg+'"><img class="pgimg" src="'+u+'" style="transform:scale('+z+')" alt="" onerror="imgFallback(this)"></div>';}
  var slides=sl('linear-gradient(160deg,#FFFFFF,#E9E9EE)',1)+sl('radial-gradient(120% 95% at 70% 22%,'+hexA(ct.c,.5)+',#0E0F13 72%)',1.08)+sl('linear-gradient(160deg,#FFFFFF,#EDEDF2)',1.32);
  return '<div class="pgwrap"><div class="badgeabs">'+bdg+'</div><div class="pgal" id="pgal">'+slides+'</div><div class="pgdots"><span class="pgdot on"></span><span class="pgdot"></span><span class="pgdot"></span></div></div>';
}
function searchSuggest(){
  if(S.query)return '';
  var pop=(typeof POPQ!=='undefined'&&POPQ)?POPQ:["без сахара","батончик","мармелад","протеин","орех"];
  var h='';var hist=(S.searchHistory||[]);
  if(hist.length){h+='<div class="sec" style="padding-top:0">Недавнее</div><div class="chips">'+hist.slice(0,6).map(function(q){return '<div class="chip" data-act2="setq" data-q="'+esc(q)+'">'+esc(q)+'</div>';}).join('')+'</div>';}
  h+='<div class="sec">Популярное</div><div class="chips">'+pop.map(function(q){return '<div class="chip" data-act2="setq" data-q="'+q+'">'+q+'</div>';}).join('')+'</div>';
  return h;
}
function shelfLife(p){var t=(typeof SHELF!=='undefined'&&SHELF)?SHELF[p.cat]:0;return t||"12 месяцев";}
function deliveryDate(){var d=new Date(Date.now()+2*86400000);var m=["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];return d.getDate()+" "+m[d.getMonth()];}
(function(){var _r8=render;render=function(){_r8();var g=document.getElementById('pgal');if(g&&!g._wired){g._wired=1;g.addEventListener('scroll',function(){var i=Math.round(g.scrollLeft/Math.max(1,g.clientWidth));var dots=g.parentNode.querySelectorAll('.pgdot');for(var k=0;k<dots.length;k++)dots[k].className='pgdot'+(k===i?' on':'');});}};})();
document.addEventListener("click",function(e){var el=e.target.closest('[data-act2="setq"]');if(el){S.query=el.getAttribute("data-q")||"";S._focusQ=false;render();}});
document.addEventListener("click",function(e){
  var o=e.target.closest('[data-act="open"]');
  if(o&&S.query&&S.query.trim().length>=2){var q=S.query.trim();S.searchHistory=(S.searchHistory||[]).filter(function(x){return x!==q;});S.searchHistory.unshift(q);S.searchHistory=S.searchHistory.slice(0,6);LS.set("nk_sh",S.searchHistory);}
  var hp=e.target.closest('[data-act="addcart"],[data-act2="addq"],[data-act="pay"],[data-act="fav"],[data-act="checkout"],[data-act="inc"]');
  if(hp&&navigator.vibrate){try{navigator.vibrate(12);}catch(_){}}
},true);


function dealOfDay(){
  var ids=Object.keys((typeof DISC!=='undefined'&&DISC)?DISC:{});
  if(!ids.length)return '';
  var p=prod(+ids[(new Date().getDate())%ids.length]); if(!p)return '';
  var ct=CATS[p.cat];
  return '<div class="sec secrow"><span>Акция дня</span></div>'+
    '<div class="deal" data-act="open" data-id="'+p.id+'">'+
      '<div class="dthumb" style="background:linear-gradient(160deg,#fff,#ECECF0)">'+(IMG[p.id]?'<img src="'+IMG[p.id]+'" alt="" onerror="this.style.display=\'none\'">':'<span style="font-size:34px">'+ct.gl+'</span>')+'</div>'+
      '<div class="dinfo"><div class="dn">'+esc(p.n)+'</div><div class="dp"><span class="oldp">'+money(p.price)+'</span><span class="price" style="font-size:18px">'+money(priceOf(p))+'</span><span class="sale" style="position:static">−'+_disc(p)+'%</span></div></div>'+
    '</div>';
}
function goalShelf(){
  if(!S.profile)return '';
  var g=S.profile.goal,title,list;
  if(g==="lose"){title="Для снижения веса";list=P.filter(function(p){return p.tags.indexOf("sugar")>=0||p.tags.indexOf("fat")>=0||portionKcal(p)<=170;});}
  else if(g==="gain"){title="Для набора массы";list=P.filter(function(p){return p.tags.indexOf("prot")>=0||p.tags.indexOf("nut")>=0;});}
  else{title="Для поддержания формы";list=P.filter(function(p){return p.hit||p.tags.length;});}
  list=list.slice(0,10);
  if(!list.length)return '';
  return '<div class="sec secrow"><span>'+title+'</span></div><div class="hscroll">'+list.map(pcardHTML).join('')+'</div>';
}
function renderCategory(cat){
  var cp=sortList(P.filter(function(p){return p.cat===cat;}));
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Каталог</div><div class="title">'+esc(cat)+'</div><div class="spacer"></div></div>';
  h+=sortChips();
  h+='<div style="display:flex;flex-wrap:wrap;gap:14px;padding:6px 16px 20px">'+cp.map(pcardHTML).join('')+'</div>';
  return h;
}
function renderDelivery(){
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Профиль</div><div class="title">Доставка и оплата</div><div class="spacer"></div></div>';
  h+='<div class="block" style="margin:10px 16px"><h3>Доставка</h3><p>Курьером по городу — 199 ₽, бесплатно при заказе от 1000 ₽. Самовывоз из фирменных магазинов «Невский Кондитер» — бесплатно. Срок: 1–2 дня.</p></div>';
  h+='<div class="block" style="margin:10px 16px"><h3>Оплата</h3><p>Картой онлайн, через СБП или при получении. В прототипе оплата демонстрационная — реальное списание не производится.</p></div>';
  h+='<div class="block" style="margin:10px 16px"><h3>Регионы</h3><p>Доставка по России. Точные сроки и стоимость зависят от региона и рассчитываются при оформлении заказа.</p></div>';
  return h;
}
(function(){var _r9=render;render=function(){
  var top=S.stack[S.stack.length-1];
  if(top&&(top.screen==="category"||top.screen==="delivery")){
    var app=$("app");if(!app)return;
    app.innerHTML=(top.screen==="category")?renderCategory(top.c):renderDelivery();
    renderTabs();
    app.classList.remove('nav-push','nav-pop','nav-fade');void app.offsetWidth;app.classList.add('nav-push');
    var ims=app.querySelectorAll('img.pimg,img.himg');for(var i=0;i<ims.length;i++){var im=ims[i];if(im.complete&&im.naturalWidth>0)im.classList.add('ld');else im.addEventListener('load',function(){this.classList.add('ld');});}
    return;
  }
  _r9();
};})();
document.addEventListener("click",function(e){
  var el=e.target.closest("[data-act2]");if(!el)return;
  var a=el.getAttribute("data-act2");
  if(a==="cat")go("category",{c:el.getAttribute("data-c")});
  else if(a==="delivery")go("delivery");
});

