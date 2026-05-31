/* js/core/render.js
   Главный диспетчер render() и нижняя навигация
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */
function render(){
  var top=S.stack[S.stack.length-1];
  var html;
  if(top&&top.screen==="product")html=renderProduct(top.id);
  else if(top&&top.screen==="recommend")html=renderRecommend();
  else if(S.tab==="catalog")html=renderCatalog();
  else if(S.tab==="diary")html=renderDiary();
  else if(S.tab==="cart")html=renderCart();
  else if(S.tab==="profile")html=renderProfile();
  $("app").innerHTML=html;
  $("app").scrollTop=(top&&top._st)||0;
  renderTabs();
  if(S.tab==="catalog"&&!top){var q=$("q");if(q&&S._focusQ){q.focus();q.setSelectionRange(q.value.length,q.value.length);}}
}
function renderTabs(){
  var tabs=[["catalog","Каталог"],["fav","Избранное"],["diary","Дневник"],["cart","Корзина"],["bonus","Бонусы"],["profile","Профиль"]];
  var cc=cartCount();
  $("tabbar").innerHTML=tabs.map(function(t){
    var on=(S.tab===t[0]&&!S.stack.length)?"on":"";
    var badge=(t[0]==="cart"&&cc)?'<span class="cnt">'+cc+'</span>':'';
    return '<div class="tab '+on+'" data-act="tab" data-t="'+t[0]+'">'+badge+icon(t[0])+'<span>'+t[1]+'</span></div>';
  }).join('');
}

/* ---------------- SHEETS ---------------- */
