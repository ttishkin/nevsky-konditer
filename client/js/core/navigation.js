/* js/core/navigation.js — навигация (go/back), обработчики ввода, инициализация */
function go(screen,extra){var top=S.stack[S.stack.length-1];if(top)top._st=$("app").scrollTop;S.stack.push(Object.assign({screen:screen},extra||{}));render();}
function back(){S.stack.pop();render();}

document.addEventListener("click",function(e){
  var el=e.target.closest("[data-act]");if(!el)return;
  var act=el.getAttribute("data-act");var id=+el.getAttribute("data-id");
  if(act==="tab"){S.stack=[];S.tab=el.getAttribute("data-t");S._focusQ=false;render();}
  else if(act==="filter"){S.filter=el.getAttribute("data-f");S._focusQ=false;render();}
  else if(act==="open"){go("product",{id:id});}
  else if(act==="back"){back();}
  else if(act==="fav"){var i=S.fav.indexOf(id);if(i>=0)S.fav.splice(i,1);else S.fav.push(id);save();render();toast(i>=0?"Убрано из избранного":"Добавлено в избранное ♥");}
  else if(act==="addcart"){S.cart[id]=(S.cart[id]||0)+1;save();renderTabs();toast("Добавлено в корзину");}
  else if(act==="inc"){S.cart[id]=(S.cart[id]||0)+1;save();render();}
  else if(act==="dec"){S.cart[id]=Math.max(0,(S.cart[id]||0)-1);if(!S.cart[id])delete S.cart[id];save();render();}
  else if(act==="todiary"){sheetAddDiary(id);}
  else if(act==="confirmdiary"){var seg=$("mealseg");var meal="Перекус";[].forEach.call(seg.children,function(x){if(x.classList.contains("on"))meal=x.getAttribute("data-m");});
    var _pp=prod(id);var _pcs=Math.max(1,parseInt(($("qn")||{}).textContent,10)||1);S.diary.push({id:id,grams:_pcs*_pp.g,qty:_pcs,meal:meal});save();closeSheet();
    if(S.stack.length&&S.stack[S.stack.length-1].screen==="product"){S.stack=[];}S.tab="diary";render();toast("Добавлено в дневник");}
  else if(act==="deldiary"){var ix=+el.getAttribute("data-i");S.diary.splice(ix,1);save();render();}
  else if(act==="recommend"){go("recommend");}
  else if(act==="checkout"){sheetCheckout();}
  else if(act==="pay"){pushOrder();S.cart={};save();closeSheet();S.tab="cart";S.stack=[];render();
    openSheet('<div style="text-align:center;padding:14px 6px 6px"><div class="okmark" style="font-size:54px">✅</div><div style="font-size:22px;font-weight:800;margin:8px 0">Спасибо за заказ!</div>'+(S.orders[0]?'<div class="muted" style="margin-bottom:3px">Номер: <b style="color:var(--label)">'+S.orders[0].no+'</b></div><div class="muted" style="margin-bottom:3px">Сумма: <b style="color:var(--label)">'+money(S.orders[0].total)+'</b></div><div class="muted" style="margin-bottom:18px">Доставим к <b style="color:var(--acc)">'+deliveryDate()+'</b></div>':'<div class="muted" style="margin-bottom:18px">Это демонстрация заказа в прототипе.</div>')+(S.orders[0]?'<div style="background:rgba(199,249,75,.12);border-radius:12px;padding:10px;margin-bottom:14px;font-size:14px">🎁 Начислено бонусов: <b style="color:var(--acc)">+'+(S.orders[0].bonus||0)+'</b></div>':'')+'<button class="btn" data-act="closesheet">Готово</button></div>');}
  else if(act==="closesheet"){closeSheet();}
  else if(act==="editprofile"){S.onbStep=1;if(S.profile){S.onbForm=Object.assign({},S.onbForm,S.profile);}$("onb").style.display="flex";renderOnb();}
  else if(act==="onb-next"){S.onbStep=1;renderOnb();}
  else if(act==="onb-skip"){$("onb").style.display="none";}
  else if(act==="onb-calc"){readOnbForm();S.onbStep=2;renderOnb();}
  else if(act==="onb-finish"){var f=S.onbForm;S.profile={name:f.name||"",sex:f.sex,age:f.age,height:f.height,weight:f.weight,act:f.act,goal:f.goal,kcal:f.kcal||calcKcal(f)};save();$("onb").style.display="none";S.tab="profile";S.stack=[];render();}
});
document.addEventListener("input",function(e){
  if(e.target.id==="q"){S.query=e.target.value;S._focusQ=true;render();}
});
$("sheetbg").addEventListener("click",function(e){if(e.target===$("sheetbg"))closeSheet();});
if(!S.profile){$("onb").style.display="flex";S.onbStep=0;renderOnb();}else{$("onb").style.display="none";}

