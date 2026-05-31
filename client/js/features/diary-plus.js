/* js/features/diary-plus.js — полноценный дневник питания:
   добавление любой еды (поиск по каталогу + произвольный «свой продукт»).
   Учитывается в итогах и синхронизируется с сервером. */
(function () {
  "use strict";
  // Итоги учитывают и товарные, и произвольные записи
  diaryTotals = function () {
    var t = { kcal: 0, p: 0, f: 0, c: 0 };
    S.diary.forEach(function (e) {
      if (e.custom) { t.kcal += +e.kcal || 0; return; }
      var p = prod(e.id); if (!p) return; var k = e.grams / 100;
      t.kcal += p.kcal * k; t.p += p.p * k; t.f += p.f * k; t.c += p.c * k;
    });
    t.kcal = Math.round(t.kcal); t.p = Math.round(t.p); t.f = Math.round(t.f); t.c = Math.round(t.c); return t;
  };

  renderDiary = function () {
    var t = diaryTotals(); var k = sweetBudget(); var rem = k - t.kcal;
    var h = '<div class="lt">Дневник питания</div><div class="muted" style="padding:0 20px 4px">Сегодня · бюджет на сладкое и весь рацион</div>';
    h += '<div class="ringwrap"><div class="ring">' + ringSVG(t.kcal, k) + '<div class="ctr"><div class="big">' + (rem >= 0 ? rem : 0) + '</div><div class="sm">' + (rem >= 0 ? "ккал осталось" : "на сегодня всё") + '</div></div></div>' +
      '<div class="macros"><div style="font-size:14px;font-weight:600">Бюджет на сладкое</div>' +
      '<div style="font-size:13px;color:var(--label2)">Съедено ' + t.kcal + ' из ' + k + ' ккал</div>' +
      '<div style="font-size:12px;color:var(--label3);line-height:1.45">≈20% дневной нормы (' + norm() + ' ккал)<br>Б ' + t.p + ' · Ж ' + t.f + ' · У ' + t.c + ' г</div></div></div>';
    if (rem >= 0) { h += '<div style="padding:8px 16px"><button class="btn green" data-act="recommend">Подобрать перекус под остаток' + (rem > 0 ? " (" + rem + " ккал)" : "") + '</button></div>'; }
    else { h += '<div style="margin:10px 16px;padding:14px 16px;border-radius:16px;background:rgba(255,178,62,.12);border:1px solid rgba(255,178,62,.32)"><div style="font-size:15px;font-weight:700;color:#FFB23E">🍫 Сегодня вы порадовали себя!</div><div style="font-size:13px;color:var(--label2);margin:4px 0 0;line-height:1.45">Это нормально — завтра бюджет на сладкое обновится.</div></div>'; }
    h += '<div style="padding:2px 16px 6px"><button class="btn sec" data-act2="addentry">+ Добавить в дневник</button></div>';
    if (!S.diary.length) {
      h += '<div class="empty"><span class="gl">🍽️</span>Пока пусто.<br>Найдите товар НК или внесите любой свой продукт — дневник учтёт всё питание за день.</div>';
    } else {
      var meals = { "Завтрак": [], "Обед": [], "Ужин": [], "Перекус": [] };
      S.diary.forEach(function (e, i) { (meals[e.meal] || meals["Перекус"]).push({ e: e, i: i }); });
      for (var m in meals) {
        if (!meals[m].length) continue;
        h += '<div class="meal"><div class="mh"><span>' + m + '</span></div><div class="listcard">';
        meals[m].forEach(function (o) {
          if (o.e.custom) {
            h += '<div class="row"><div class="ic" style="background:rgba(118,118,128,.18)">🍽️</div>' +
              '<div style="flex:1;min-width:0"><div class="gname">' + esc(o.e.n || "Продукт") + '</div><div class="sub">' + (Math.round(+o.e.kcal) || 0) + ' ккал · свой продукт</div></div>' +
              '<div class="heart" style="width:30px;height:30px;box-shadow:none;background:rgba(118,118,128,.12)" data-act="deldiary" data-i="' + o.i + '">✕</div></div>';
            return;
          }
          var p = prod(o.e.id); if (!p) return; var ct = CATS[p.cat];
          var qn = o.e.qty || Math.max(1, Math.round(o.e.grams / (p.g || o.e.grams || 1)));
          h += '<div class="row"><div class="ic" style="background:' + hexA(ct.c, .20) + '">' + ct.gl + '</div>' +
            '<div style="flex:1;min-width:0"><div class="gname">' + esc(p.n) + '</div><div class="sub">' + Math.round(p.kcal * o.e.grams / 100) + ' ккал</div></div>' +
            '<div class="qty" style="gap:11px;margin-right:4px"><button data-act="diarydec" data-i="' + o.i + '">−</button><b style="min-width:16px;text-align:center;font-size:16px">' + qn + '</b><button data-act="diaryinc" data-i="' + o.i + '">+</button></div>' +
            '<div class="heart" style="width:30px;height:30px;box-shadow:none;background:rgba(118,118,128,.12)" data-act="deldiary" data-i="' + o.i + '">✕</div></div>';
        });
        h += '</div></div>';
      }
      h += '<div style="height:10px"></div>';
    }
    return h;
  };

  function mealSeg() { return '<div class="field"><label>Приём пищи</label><div class="seg" id="de_meal">' + ["Завтрак", "Обед", "Ужин", "Перекус"].map(function (m, i) { return '<button data-m="' + m + '" class="' + (i === 3 ? "on" : "") + '">' + m + '</button>'; }).join('') + '</div></div>'; }
  function curMeal() { var seg = $("de_meal"); var m = "Перекус"; if (seg)[].forEach.call(seg.children, function (x) { if (x.classList.contains("on")) m = x.getAttribute("data-m"); }); return m; }
  function searchResults(q) {
    q = (q || "").trim().toLowerCase();
    var list = (typeof P !== "undefined" ? P : []).filter(function (p) { return !q || p.n.toLowerCase().indexOf(q) >= 0 || (p.cat || "").toLowerCase().indexOf(q) >= 0; }).slice(0, 8);
    if (!list.length) return '<div class="muted" style="padding:10px">Ничего не найдено</div>';
    return list.map(function (p) { var ct = CATS[p.cat] || { c: "#888", gl: "🍬" }; return '<div class="row" data-act2="addfound" data-id="' + p.id + '" style="cursor:pointer"><div class="ic" style="background:' + hexA(ct.c, .2) + '">' + ct.gl + '</div><div style="flex:1;min-width:0"><div class="gname">' + esc(p.n) + '</div><div class="sub">' + portionKcal(p) + ' ккал · ' + p.g + ' г</div></div><div style="color:var(--acc);font-size:22px;font-weight:700">+</div></div>'; }).join('');
  }
  function sheetAddEntry() {
    openSheet('<div style="font-size:20px;font-weight:800;margin-bottom:4px">Добавить в дневник</div>' +
      '<div class="muted" style="margin-bottom:10px">Найдите товар или внесите свой продукт</div>' + mealSeg() +
      '<div class="field"><label>Поиск по каталогу</label><input id="de_q" placeholder="Напр. батончик"></div>' +
      '<div class="listcard" id="de_res" style="margin:0 0 14px;max-height:230px;overflow:auto">' + searchResults("") + '</div>' +
      '<div style="font-size:13px;font-weight:700;margin-bottom:8px">Свой продукт</div>' +
      '<div class="field"><label>Название</label><input id="de_n" placeholder="Напр. Овсянка с бананом"></div>' +
      '<div class="field"><label>Калории, ккал</label><input id="de_k" type="number" inputmode="numeric" placeholder="например, 250"></div>' +
      '<button class="btn" data-act2="addcustom">Добавить свой продукт</button>');
    var seg = $("de_meal"); if (seg) seg.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return;[].forEach.call(seg.children, function (x) { x.classList.remove("on"); }); b.classList.add("on"); });
    var q = $("de_q"); if (q) q.addEventListener("input", function () { var r = $("de_res"); if (r) r.innerHTML = searchResults(this.value); });
  }
  function mirror(entry) {
    if (!window.authedFetch || !S.token) return;
    var body = entry.custom ? { name: entry.n, kcal: entry.kcal, qty: 1, meal: entry.meal } : { productId: entry.id, qty: entry.qty || 1, meal: entry.meal };
    window.authedFetch("/api/diary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (c) { if (c && c.id) { entry._sid = c.id; LS.set("nk_diary", S.diary); } }).catch(function () {});
  }
  document.addEventListener("click", function (e) {
    var ae = e.target.closest('[data-act2="addentry"]'); if (ae) { sheetAddEntry(); return; }
    var af = e.target.closest('[data-act2="addfound"]'); if (af) { var p = prod(+af.getAttribute("data-id")); if (p) { var ent = { id: p.id, grams: p.g, qty: 1, meal: curMeal() }; S.diary.push(ent); save(); mirror(ent); closeSheet(); S.tab = "diary"; S.stack = []; render(); if (typeof toast === "function") toast("Добавлено в дневник"); } return; }
    var ac = e.target.closest('[data-act2="addcustom"]'); if (ac) { var n = (($("de_n") || {}).value || "").trim() || "Продукт"; var kc = Math.max(0, parseInt(($("de_k") || {}).value, 10) || 0); var ent2 = { custom: true, n: n, kcal: kc, meal: curMeal() }; S.diary.push(ent2); save(); mirror(ent2); closeSheet(); S.tab = "diary"; S.stack = []; render(); if (typeof toast === "function") toast("Добавлено в дневник"); return; }
  });
  render();
})();
