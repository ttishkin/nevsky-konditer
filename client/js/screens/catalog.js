/* js/screens/catalog.js
   Экран каталога (витрина)
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */
function renderCatalog(){
  var list=P.filter(matchFilter);
  var chips=[["all","Все"],["sugar","Без сахара"],["prot","С белком"],["fat","Без жира"],["nut","С орехами"]];
  var h=(S.profile&&S.profile.name)?'<div class="hello">Привет, '+esc(S.profile.name)+' 👋</div><div class="lt" style="padding-top:2px">Каталог</div>':'<div class="lt">Каталог</div>';
  h+='<div class="search">'+icon("search")+'<input id="q" placeholder="Поиск по товарам" value="'+esc(S.query)+'"></div>';
  h+='<div class="chips">'+chips.map(function(c){return '<div class="chip '+(S.filter===c[0]?"on":"")+'" data-act="filter" data-f="'+c[0]+'">'+c[1]+'</div>';}).join('')+'</div>';

  if(S.query||S.filter!=="all"){
    list=sortList(list);h+=sortChips();h+='<div class="sec">Найдено: '+list.length+'</div>';
    h+='<div style="display:flex;flex-wrap:wrap;gap:14px;padding:6px 16px 20px">'+(list.length?list.map(pcardHTML).join(''):'<div class="empty"><span class="gl">🔍</span>Ничего не найдено</div>')+'</div>';
  } else {
    var hits=P.filter(function(p){return p.hit;});
    var nov=P.filter(function(p){return p.nov;});
    h+=storiesRow();
    h+=searchSuggest();
    h+=banners();
    h+=dealOfDay();
    h+=goalShelf();
    h+=bundlesSection();
    h+=recentShelf();
    h+='<div class="sec secrow"><span>Хиты продаж</span></div><div class="hscroll">'+hits.map(pcardHTML).join('')+'</div>';
    h+='<div class="sec secrow"><span>Новинки</span></div><div class="hscroll">'+nov.map(pcardHTML).join('')+'</div>';
    h+=discountsSection();
    for(var cat in CATS){
      var cp=P.filter(function(p){return p.cat===cat;});
      if(!cp.length)continue;
      h+='<div class="sec secrow" data-act2="cat" data-c="'+cat+'"><span>'+cat+'</span><span class="more">Все ›</span></div><div class="hscroll">'+cp.map(pcardHTML).join('')+'</div>';
    }
    h+='<div style="height:8px"></div>';
  }
  return h;
}

/* ---------------- RENDER: PRODUCT ---------------- */
