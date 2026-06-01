/* js/components/cards.js — UI-компоненты: иконки, превью, теги, фильтр, карточка товара */
function icon(name,col){
  var c=col||"currentColor";var s='stroke="'+c+'" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  var P0='<svg width="26" height="26" viewBox="0 0 24 24" '+s+'>';
  var m={
    catalog:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    diary:'<path d="M4 5a2 2 0 0 1 2-2h11l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 8h7M9 12h7M9 16h4"/>',
    cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M3 4h2l2.2 11h11l2-8H6"/>',
    profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
    back:'<path d="M15 5l-7 7 7 7"/>',
    heart:'<path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z"/>',
    fav:'<path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.3 4 2.5.8-1.2 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z"/>',
    bolt:'<path d="M13 3L4 14h6l-1 7 9-11h-6z"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    bonus:'<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>'
  };
  return P0+(m[name]||"")+'</svg>';
}
function thumb(p,h){
  var ct=CATS[p.cat];var u=IMG[p.id];
  var bdg=(p.hit?'<span class="badge">ХИТ</span>':(p.nov?'<span class="badge">NEW</span>':''));
  var bg=u?'linear-gradient(160deg,#FFFFFF,#ECECF0)':'radial-gradient(120% 120% at 72% 18%,'+hexA(ct.c,.30)+',#14161d 62%)';
  var vis=u?'<img class="pimg" src="'+u+'" loading="lazy" alt="" onerror="imgFallback(this)"><span class="gl gf" style="display:none">'+ct.gl+'</span>':'<span class="gl gf">'+ct.gl+'</span>';
  return '<div class="thumb" style="background:'+bg+'">'+bdg+vis+'</div>';
}
function tagPills(p){
  if(!p.tags.length)return '';
  return '<div class="tags" style="margin-top:6px">'+p.tags.map(function(t){return '<span class="tag '+TAGCLASS[t]+'">'+TAGLABEL[t]+'</span>';}).join('')+'</div>';
}
function matchFilter(p){
  if(S.filter!=="all"&&p.tags.indexOf(S.filter)<0)return false;
  if(S.query){var q=S.query.toLowerCase();if(p.n.toLowerCase().indexOf(q)<0&&p.cat.toLowerCase().indexOf(q)<0)return false;}
  return true;
}
function pcardHTML(p){
  return '<div class="pcard" data-act="open" data-id="'+p.id+'">'+saleBadge(p)+thumb(p)+
    '<div class="pname">'+esc(p.n)+'</div>'+'<div class="crate">★ '+rating(p).s+'</div>'+
    '<div class="pmeta"><span><span class="kcal">'+portionKcal(p)+' ккал</span><br>'+priceHTML(p)+'</span><button class="qadd" data-act="addcart" data-id="'+p.id+'" aria-label="В корзину">+</button></div></div>';
}
