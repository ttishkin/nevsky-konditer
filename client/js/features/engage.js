/* js/features/engage.js — вовлечение: лента уведомлений пользователя в профиле
   и мягкое напоминание заполнить дневник, если сегодня пусто. */
(function () {
  "use strict";
  S.userNotifs = S.userNotifs || [];
  function fmt(iso) { try { return new Date(iso).toLocaleString("ru-RU"); } catch (e) { return iso || ""; } }

  (function () {
    var _r = render;
    render = function () {
      _r();
      if (S.stack.length) return;
      var app = $("app"); if (!app) return;
      if (S.tab === "profile") injectNotifs(app);
      else if (S.tab === "catalog") injectReminder(app);
    };
  })();

  function injectNotifs(app) {
    if (app.querySelector("[data-nknotifs]")) return;
    var list = S.userNotifs || [];
    var card = document.createElement("div");
    card.setAttribute("data-nknotifs", "1");
    card.style.cssText = "margin:0 16px 4px;padding:14px 16px;border-radius:16px;background:var(--card2);border:1px solid var(--sep)";
    var body = list.length
      ? list.slice(0, 5).map(function (n) { return '<div style="padding:7px 0;border-bottom:1px solid var(--sep);font-size:13px">🔔 ' + esc(n.message) + '<div class="muted" style="font-size:11px;margin-top:2px">' + fmt(n.createdAt) + '</div></div>'; }).join("")
      : '<div class="muted" style="font-size:13px">Новых уведомлений нет.</div>';
    card.innerHTML = '<div style="font-size:15px;font-weight:700;margin-bottom:6px">Уведомления' + (list.length ? " (" + list.length + ")" : "") + '</div>' + body;
    var auth = app.querySelector("[data-nkauth]");
    if (auth && auth.nextSibling) app.insertBefore(card, auth.nextSibling);
    else app.insertBefore(card, app.firstChild);
  }

  function injectReminder(app) {
    if (!S.token) return;
    if (app.querySelector("[data-nkremind]")) return;
    if (S.diary && S.diary.length) return; // сегодня уже что-то отмечено
    var b = document.createElement("div");
    b.setAttribute("data-nkremind", "1");
    b.setAttribute("data-act", "tab"); b.setAttribute("data-t", "diary");
    b.style.cssText = "margin:8px 16px;padding:12px 14px;border-radius:14px;background:rgba(199,249,75,.10);border:1px solid rgba(199,249,75,.28);font-size:13px;cursor:pointer";
    b.innerHTML = '📔 Отметьте съеденное в дневнике сегодня. <b style="color:var(--acc)">Открыть ›</b>';
    app.insertBefore(b, app.firstChild);
  }
})();
