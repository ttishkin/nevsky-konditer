/* js/features/auth.js
   Авторизация + двусторонняя синхронизация с сервером:
   - вход/регистрация, сессия (токен), восстановление при запуске;
   - при входе дневник и заказы подгружаются с сервера в интерфейс;
   - изменения дневника (добавление/правка/удаление) зеркалятся на сервер.
   Без сервера приложение работает на localStorage (модуль ничего не ломает). */
(function () {
  "use strict";
  var API = (window.APP_CONFIG && APP_CONFIG.apiBaseOverride != null)
    ? APP_CONFIG.apiBaseOverride
    : ((location.protocol === "http:" || location.protocol === "https:") ? "" : "http://localhost:3000");
  function hasFetch() { return typeof fetch === "function"; }

  S.token = S.token || LS.get("nk_token", null);
  S.authUser = null;
  S.authMode = S.authMode || "login";
  S.authErr = "";

  function authedFetch(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({}, opts.headers || {});
    if (S.token) opts.headers["Authorization"] = "Bearer " + S.token;
    return fetch(API + path, opts);
  }
  window.authedFetch = authedFetch;
  window.NK_API_BASE = API;

  function mergeUser(u) {
    if (!u) return;
    S.authUser = u;
    if (u.points != null) S.points = u.points;
    S.profile = Object.assign({}, S.profile, {
      name: u.name, sex: u.sex, age: u.age, height: u.height,
      weight: u.weight, act: u.activity, goal: u.goal, kcal: u.kcalNorm,
    });
    S.onboarded = true;
    if (typeof save === "function") save();
  }

  function mapDiary(list) {
    return (list || []).map(function (e) {
      if (e.productId) return { id: e.productId, grams: e.grams, qty: e.qty, meal: e.meal, _sid: e.id };
      return { custom: true, n: e.name, kcal: e.kcal, meal: e.meal, _sid: e.id };
    });
  }
  function mapOrders(list) {
    return (list || []).map(function (o) {
      return {
        no: o.no, ts: Date.parse(o.created_at) || Date.now(),
        items: (o.items || []).map(function (i) { return { id: i.productId, q: i.qty }; }),
        total: o.total, bonus: o.bonus_earned, status: o.status,
      };
    });
  }
  function syncFromServer() {
    if (!S.token || !hasFetch()) return;
    authedFetch("/api/diary").then(function (r) { return r.ok ? r.json() : null; })
      .then(function (list) { if (list) { S.diary = mapDiary(list); LS.set("nk_diary", S.diary); if (typeof render === "function") render(); } })
      .catch(function () {});
    authedFetch("/api/orders").then(function (r) { return r.ok ? r.json() : null; })
      .then(function (list) { if (list) { S.orders = mapOrders(list); LS.set("nk_orders", S.orders); if (typeof render === "function") render(); } })
      .catch(function () {});
    authedFetch("/api/cart").then(function (r) { return r.ok ? r.json() : null; })
      .then(function (list) {
        if (!list) return;
        var localHas = S.cart && Object.keys(S.cart).length;
        if (!list.length && localHas) { pushCart(); }
        else { S.cart = {}; list.forEach(function (it) { S.cart[it.id] = it.qty; }); LS.set("nk_cart", S.cart); if (typeof render === "function") render(); }
      }).catch(function () {});
    authedFetch("/api/notifications").then(function (r) { return r.ok ? r.json() : null; })
      .then(function (list) { if (list) { S.userNotifs = list; if (typeof render === "function") render(); } }).catch(function () {});
    authedFetch("/api/favorites").then(function (r) { return r.ok ? r.json() : null; })
      .then(function (ids) {
        if (!ids) return;
        var localHas = S.fav && S.fav.length;
        if (!ids.length && localHas) { pushFav(); }
        else { S.fav = ids; LS.set("nk_fav", S.fav); if (typeof render === "function") render(); }
      }).catch(function () {});
  }
  function cartItemsArr() { return Object.keys(S.cart || {}).map(function (k) { return { id: +k, qty: S.cart[k] }; }); }
  function pushCart() { if (!S.token || !hasFetch()) return; authedFetch("/api/cart", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: cartItemsArr() }) }).catch(function () {}); }
  function pushFav() { if (!S.token || !hasFetch()) return; authedFetch("/api/favorites", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: S.fav || [] }) }).catch(function () {}); }
  var _cartTimer = null;
  function scheduleCartPush() { clearTimeout(_cartTimer); _cartTimer = setTimeout(pushCart, 400); }

  function authPost(path, body) {
    return fetch(API + "/api/auth/" + path, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || "Ошибка"); return j; }); });
  }
  function login(email, pw) { return authPost("login", { email: email, password: pw }).then(function (d) { S.token = d.token; LS.set("nk_token", d.token); mergeUser(d.user); return d; }); }
  function register(data) { return authPost("register", data).then(function (d) { S.token = d.token; LS.set("nk_token", d.token); mergeUser(d.user); return d; }); }
  function logout() { S.token = null; S.authUser = null; LS.set("nk_token", null); }

  function restore() {
    if (!S.token || !hasFetch()) return;
    authedFetch("/api/auth/me")
      .then(function (r) { if (!r.ok) { if (r.status === 401) { S.token = null; LS.set("nk_token", null); } return null; } return r.json(); })
      .then(function (u) { if (u) { mergeUser(u); if (typeof render === "function") render(); syncFromServer(); } })
      .catch(function () {});
  }

  function renderAuth() {
    var reg = S.authMode === "register";
    var ic = (typeof icon === "function") ? icon("back", "#C7F94B") : "‹";
    var h = '<div class="navbar"><div class="back" data-act="back">' + ic + 'Профиль</div><div class="title">' + (reg ? "Регистрация" : "Вход") + '</div><div class="spacer"></div></div>';
    h += '<div class="pad">';
    h += '<div class="seg" style="margin-bottom:14px"><button data-act2="authmode" data-m="login" class="' + (reg ? "" : "on") + '">Вход</button><button data-act2="authmode" data-m="register" class="' + (reg ? "on" : "") + '">Регистрация</button></div>';
    if (reg) h += '<div class="field"><label>Имя</label><input id="au_name" placeholder="Ваше имя"></div>';
    h += '<div class="field"><label>Email</label><input id="au_email" type="email" placeholder="you@example.com" value="' + (reg ? "" : "demo@nk.ru") + '"></div>';
    h += '<div class="field"><label>Пароль</label><input id="au_pass" type="password" placeholder="не короче 6 символов" value="' + (reg ? "" : "demo1234") + '"></div>';
    if (S.authErr) h += '<div style="color:#FF6B6B;margin:-4px 2px 10px;font-size:13px">' + esc(S.authErr) + '</div>';
    h += '<button class="btn" data-act2="authsubmit">' + (reg ? "Зарегистрироваться" : "Войти") + '</button>';
    h += '<div class="muted" style="font-size:12px;text-align:center;margin-top:12px;line-height:1.45">При входе ваши заказы и дневник загрузятся с сервера.<br>Для демо логин и пароль уже подставлены.</div>';
    h += '</div>';
    return h;
  }
  window.renderAuth = renderAuth;

  (function () {
    var _r = render;
    render = function () {
      var top = S.stack[S.stack.length - 1];
      if (top && top.screen === "auth") {
        var app = $("app"); if (!app) return;
        app.innerHTML = renderAuth();
        if (typeof renderTabs === "function") renderTabs();
        if (app.classList) { app.classList.remove("nav-push", "nav-pop", "nav-fade"); void app.offsetWidth; app.classList.add("nav-push"); }
        return;
      }
      _r();
      if (!S.stack.length && S.tab === "profile") injectAuthCard();
    };
  })();

  function injectAuthCard() {
    var app = $("app"); if (!app || app.querySelector("[data-nkauth]")) return;
    var card = document.createElement("div");
    card.setAttribute("data-nkauth", "1");
    card.style.cssText = "margin:12px 16px;padding:14px 16px;border-radius:16px;background:var(--card2);border:1px solid var(--sep)";
    if (S.authUser) {
      card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div style="min-width:0"><div style="font-size:15px;font-weight:700">' + esc(S.authUser.name || "Аккаунт") + '</div><div class="muted" style="font-size:12px">' + esc(S.authUser.email || "") + ' · синхронизировано</div></div><button class="btn sec" style="width:auto;padding:9px 14px" data-act2="logout">Выйти</button></div>';
    } else {
      card.innerHTML = '<div style="font-size:15px;font-weight:700;margin-bottom:3px">Войдите в аккаунт</div><div class="muted" style="font-size:13px;margin-bottom:11px">Заказы и дневник будут храниться на сервере и синхронизироваться между устройствами.</div><button class="btn" data-act2="goauth">Войти / Зарегистрироваться</button>';
    }
    app.insertBefore(card, app.firstChild);
  }

  document.addEventListener("click", function (e) {
    var g = e.target.closest('[data-act2="goauth"]'); if (g) { S.authMode = "login"; S.authErr = ""; go("auth"); return; }
    var lo = e.target.closest('[data-act2="logout"]'); if (lo) { logout(); render(); if (typeof toast === "function") toast("Вы вышли из аккаунта"); return; }
    var m = e.target.closest('[data-act2="authmode"]'); if (m) { S.authMode = m.getAttribute("data-m"); S.authErr = ""; render(); return; }
    var sub = e.target.closest('[data-act2="authsubmit"]'); if (sub) {
      if (!hasFetch()) { S.authErr = "Нет соединения с сервером"; render(); return; }
      var email = (($("au_email") || {}).value || "").trim();
      var pass = (($("au_pass") || {}).value || "");
      var name = (($("au_name") || {}).value || "").trim();
      var op = S.authMode === "register" ? register({ email: email, password: pass, name: name }) : login(email, pass);
      op.then(function () { S.authErr = ""; S.stack = []; S.tab = "profile"; render(); syncFromServer(); if (typeof toast === "function") toast("Добро пожаловать!"); })
        .catch(function (err) { S.authErr = err.message || "Не удалось войти"; render(); });
      return;
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest('[data-act="confirmdiary"]')) return;
    if (!S.token || !hasFetch()) return;
    setTimeout(function () {
      var last = S.diary && S.diary[S.diary.length - 1]; if (!last) return;
      authedFetch("/api/diary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: last.id, qty: last.qty || 1, meal: last.meal }) })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (created) { if (created && created.id) { last._sid = created.id; LS.set("nk_diary", S.diary); } })
        .catch(function () {});
    }, 60);
  });

  document.addEventListener("click", function (e) {
    var b = e.target.closest('[data-act="diaryinc"], [data-act="diarydec"]');
    if (!b || !S.token || !hasFetch()) return;
    setTimeout(function () {
      var ent = S.diary && S.diary[+b.getAttribute("data-i")];
      if (ent && ent._sid) authedFetch("/api/diary/" + ent._sid, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ qty: ent.qty }) }).catch(function () {});
    }, 80);
  });

  document.addEventListener("click", function (e) {
    var del = e.target.closest('[data-act="deldiary"]');
    if (!del || !S.token || !hasFetch()) return;
    var ent = S.diary && S.diary[+del.getAttribute("data-i")];
    if (ent && ent._sid) { var sid = ent._sid; setTimeout(function () { authedFetch("/api/diary/" + sid, { method: "DELETE" }).catch(function () {}); }, 0); }
  }, true);

  document.addEventListener("click", function (e) {
    if (!S.token || !hasFetch()) return;
    if (e.target.closest('[data-act="addcart"], [data-act="inc"], [data-act="dec"], [data-act2="addq"], [data-act2="setq"]')) {
      setTimeout(scheduleCartPush, 60);
    }
  });
  document.addEventListener("click", function (e) {
    if (!S.token || !hasFetch()) return;
    if (e.target.closest('[data-act="fav"]')) setTimeout(pushFav, 60);
  });

  setTimeout(restore, 0);
})();
