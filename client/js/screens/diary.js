/* js/screens/diary.js — экраны дневника и рекомендаций */
function renderDiary(){
  var t=diaryTotals();var k=norm();var rem=k-t.kcal;var mt=macroTargets();
  var h='<div class="lt">Дневник</div><div class="muted" style="padding:0 20px 4px">Сегодня</div>';
  h+='<div class="ringwrap">'+
     '<div class="ring">'+ringSVG(t.kcal,k)+'<div class="ctr"><div class="big">'+(rem>=0?rem:0)+'</div><div class="sm">'+(rem>=0?"ккал осталось":"на сегодня всё")+'</div></div></div>'+
     '<div class="macros">'+
       '<div style="font-size:13px;color:var(--label2)">Съедено '+t.kcal+' из '+k+' ккал</div>'+
       macroBar("Белки",t.p,mt.p,"#5E5CE6")+macroBar("Жиры",t.f,mt.f,"#FF9F0A")+macroBar("Углеводы",t.c,mt.c,"#34C759")+
     '</div></div>';
  if(rem>=0){h+='<div style="padding:8px 16px"><button class="btn green" data-act="recommend">Подобрать перекус под остаток'+(rem>0?" ("+rem+" ккал)":"")+'</button></div>';}else{h+='<div style="margin:10px 16px;padding:14px 16px;border-radius:16px;background:rgba(255,178,62,.12);border:1px solid rgba(255,178,62,.32)"><div style="font-size:15px;font-weight:700;color:#FFB23E">🍫 Сегодня вы порадовали себя!</div><div style="font-size:13px;color:var(--label2);margin:4px 0 11px;line-height:1.45">Это нормально — завтра бюджет на сладкое обновится. А пока подберём лёгкие снэки на завтра.</div><button class="btn green" data-act="recommend">Подобрать лёгкие снэки ›</button></div>';}

  if(!S.diary.length){
    h+='<div class="empty"><span class="gl">🍎</span>Дневник пуст.<br>Добавляйте продукты из каталога, чтобы видеть калории и БЖУ.</div>';
  } else {
    var meals={"Завтрак":[],"Обед":[],"Ужин":[],"Перекус":[]};
    S.diary.forEach(function(e,i){(meals[e.meal]||meals["Перекус"]).push({e:e,i:i});});
    for(var m in meals){
      if(!meals[m].length)continue;
      h+='<div class="meal"><div class="mh"><span>'+m+'</span></div><div class="listcard">';
      meals[m].forEach(function(o){var p=prod(o.e.id);if(!p)return;var ct=CATS[p.cat];
        h+='<div class="row"><div class="ic" style="background:'+hexA(ct.c,.20)+'">'+ct.gl+'</div>'+
           '<div style="flex:1"><div class="gname">'+esc(p.n)+'</div><div class="sub">'+(o.e.qty?o.e.qty+' шт':o.e.grams+' г')+' · '+Math.round(p.kcal*o.e.grams/100)+' ккал</div></div>'+
           '<div class="heart" style="width:32px;height:32px;box-shadow:none;background:rgba(118,118,128,.12)" data-act="deldiary" data-i="'+o.i+'">✕</div></div>';
      });
      h+='</div></div>';
    }
    h+='<div style="height:10px"></div>';
  }
  return h;
}
function renderRecommend(){
  var t=diaryTotals();var rem=sweetBudget()-t.kcal;
  var fit=P.filter(function(p){return portionKcal(p)<=Math.max(rem,0);}).sort(function(a,b){return portionKcal(a)-portionKcal(b);});
  var h='<div class="navbar"><div class="back" data-act="back">'+icon("back","#C7F94B")+'Дневник</div><div class="title">Перекус под норму</div><div class="spacer"></div></div>';
  h+='<div class="pad" style="padding-bottom:6px"><div class="block" style="margin-top:0"><p>Осталось в бюджете на сладкое: <b>'+(rem>0?rem+" ккал":"0 ккал (лимит на сегодня исчерпан)")+'</b>. Подобрали полезные перекусы, которые в него помещаются.</p></div></div>';
  if(!fit.length){
    h+='<div class="empty"><span class="gl">✅</span>На сегодня лимит почти исчерпан.<br>Лучше воды или прогулку 🙂</div>';
  } else {
    h+='<div class="listcard">';
    fit.forEach(function(p){var ct=CATS[p.cat];
      h+='<div class="row" data-act="open" data-id="'+p.id+'"><div class="ic" style="background:'+hexA(ct.c,.20)+'">'+ct.gl+'</div>'+
         '<div style="flex:1"><div class="gname">'+esc(p.n)+'</div><div class="sub">'+portionKcal(p)+' ккал · порция '+p.g+' г</div></div>'+
         '<div class="heart" style="width:34px;height:34px;box-shadow:none;background:var(--acc)" data-act="todiary" data-id="'+p.id+'">'+icon("plus","#16240A")+'</div></div>';
    });
    h+='</div>';
  }
  return h;
}
