/* js/features/stories-theme.js — сторис, наборы, светлая/тёмная тема */

var STORIES = [
  {
    t: "Скидки до −25%",
    s: "на любимое сладкое",
    g: "🏷️",
    bg: "linear-gradient(160deg,#FF375F,#7A1F4F)",
    ring: "linear-gradient(135deg,#FF375F,#FF9F0A)",
    act: "discounts",
  },
  {
    t: "Новинки",
    s: "свежие вкусы «Невского Кондитера»",
    g: "✨",
    bg: "linear-gradient(160deg,#5E5CE6,#241640)",
    ring: "linear-gradient(135deg,#8B7BFF,#5E5CE6)",
    act: "novelties",
  },
  {
    t: "Без сахара",
    s: "полезный перекус без лишнего",
    g: "🌿",
    bg: "linear-gradient(160deg,#1E7D3A,#0E3F1E)",
    ring: "linear-gradient(135deg,#34C759,#1E7D3A)",
    act: "bfilter",
    f: "sugar",
  },
  {
    t: "Бонусы НК",
    s: "5% баллов с каждого заказа",
    g: "🎁",
    bg: "linear-gradient(160deg,#6A4FB0,#36266E)",
    ring: "linear-gradient(135deg,#C7F94B,#34C759)",
    act: "bonuses",
  },
];
function storiesRow() {
  var st = typeof STORIES !== "undefined" && STORIES ? STORIES : [];
  if (!st.length) return "";
  return (
    '<div class="strow">' +
    st
      .map(function (s, i) {
        return (
          '<div class="story" data-act2="story" data-i="' +
          i +
          '"><div class="sring" style="background:' +
          s.ring +
          '"><div class="sinner">' +
          s.g +
          '</div></div><div class="slbl">' +
          s.t.replace("Скидки до −25%", "Скидки").replace("Бонусы НК", "Бонусы") +
          "</div></div>"
        );
      })
      .join("") +
    "</div>"
  );
}
function openStory(i) {
  if (typeof STORIES === "undefined") return;
  var st = STORIES[i];
  if (!st) return;
  S._story = i;
  var bg = $("storybg");
  bg.innerHTML =
    '<div class="stfull" style="background:' +
    st.bg +
    '" data-act2="storynext">' +
    '<div class="stbars">' +
    STORIES.map(function (_, k) {
      return '<span class="' + (k <= i ? "on" : "") + '"></span>';
    }).join("") +
    "</div>" +
    '<div class="stclose" data-act2="storyclose">✕</div>' +
    '<div class="stbody"><div class="sg">' +
    st.g +
    "</div><h2>" +
    st.t +
    "</h2><p>" +
    st.s +
    "</p></div>" +
    '<button class="btn" data-act2="storycta" data-i="' +
    i +
    '" style="background:#fff;color:#16240A">' +
    (st.act === "bfilter" ? "Показать товары" : "В каталог") +
    "</button>" +
    "</div>";
  bg.classList.add("on");
}
function closeStory() {
  var bg = $("storybg");
  if (bg) {
    bg.classList.remove("on");
    bg.innerHTML = "";
  }
}
var BUNDLES = [
  {
    n: "Спортивный микс",
    ids: [16, 12, 6],
    disc: 15,
    g: "💪",
    bg: "linear-gradient(135deg,#6A4FB0,#241640)",
  },
  {
    n: "Полезный без сахара",
    ids: [5, 18, 22],
    disc: 12,
    g: "🌿",
    bg: "linear-gradient(135deg,#1E7D3A,#0E3F1E)",
  },
  {
    n: "Ассорти к чаю",
    ids: [9, 1, 21],
    disc: 10,
    g: "🍵",
    bg: "linear-gradient(135deg,#FF7A59,#7A1F4F)",
  },
];
function bundleSum(b) {
  var s = 0;
  b.ids.forEach(function (id) {
    var p = prod(id);
    if (p) s += priceOf(p);
  });
  return s;
}
function bundlePrice(b) {
  return Math.round(bundleSum(b) * (1 - b.disc / 100));
}
function bundlesSection() {
  var bs = typeof BUNDLES !== "undefined" && BUNDLES ? BUNDLES : [];
  if (!bs.length) return "";
  return (
    '<div class="sec secrow"><span>Готовые наборы</span></div><div class="bndls">' +
    bs
      .map(function (b, i) {
        return (
          '<div class="bndl" data-act2="bundle" data-b="' +
          i +
          '"><div class="bh" style="background:' +
          b.bg +
          '">' +
          b.g +
          '</div><div class="bb"><div class="bn">' +
          b.n +
          '</div><div class="bm">' +
          b.ids.length +
          " товара · −" +
          b.disc +
          '%</div><div class="bp"><span class="oldp">' +
          money(bundleSum(b)) +
          '</span><span class="price" style="font-size:16px">' +
          money(bundlePrice(b)) +
          "</span></div></div></div>"
        );
      })
      .join("") +
    "</div>"
  );
}
function renderBundle(i) {
  var b = BUNDLES[i];
  if (!b) return renderCatalog();
  var h =
    '<div class="navbar"><div class="back" data-act="back">' +
    icon("back", "#C7F94B") +
    'Каталог</div><div class="title">Набор</div><div class="spacer"></div></div>';
  h +=
    '<div style="height:120px;background:' +
    b.bg +
    ';display:flex;align-items:center;justify-content:center;font-size:64px">' +
    b.g +
    "</div>";
  h +=
    '<div class="pad"><div class="h1">' +
    b.n +
    '</div><div class="muted" style="margin:4px 0 10px">' +
    b.ids.length +
    " товара со скидкой −" +
    b.disc +
    "%</div>";
  h += '<div class="listcard" style="margin:0 0 12px">';
  b.ids.forEach(function (id) {
    var p = prod(id);
    if (!p) return;
    h +=
      '<div class="row" data-act="open" data-id="' +
      id +
      '">' +
      thumbMini(p) +
      '<div style="flex:1"><div class="gname">' +
      esc(p.n) +
      '</div><div class="sub">' +
      money(priceOf(p)) +
      '</div></div><span style="color:var(--label3);font-size:22px;font-weight:300">›</span></div>';
  });
  h += "</div>";
  h +=
    '<div class="cobreak"><div class="corow"><span>По отдельности</span><span class="oldp">' +
    money(bundleSum(b)) +
    '</span></div><div class="corow"><span>Скидка набора</span><span style="color:var(--acc)">−' +
    b.disc +
    "%</span></div></div>";
  h += '<div class="totalbar"><span>Цена набора</span><b>' + money(bundlePrice(b)) + "</b></div>";
  h +=
    '<button class="btn" data-act2="addbundle" data-b="' +
    i +
    '">Добавить набор в корзину</button></div>';
  return h;
}
(function () {
  var _r12 = render;
  render = function () {
    var top = S.stack[S.stack.length - 1];
    if (top && top.screen === "bundle") {
      var app = $("app");
      if (!app) return;
      app.innerHTML = renderBundle(top.b);
      renderTabs();
      app.classList.remove("nav-push", "nav-pop", "nav-fade");
      void app.offsetWidth;
      app.classList.add("nav-push");
      return;
    }
    _r12();
  };
})();
document.addEventListener("click", function (e) {
  var el = e.target.closest("[data-act2]");
  if (!el) return;
  var a = el.getAttribute("data-act2");
  if (a === "story") openStory(+el.getAttribute("data-i"));
  else if (a === "storyclose") closeStory();
  else if (a === "storynext") {
    var n = (S._story || 0) + 1;
    if (n >= STORIES.length) closeStory();
    else openStory(n);
  } else if (a === "storycta") {
    var st = STORIES[+el.getAttribute("data-i")];
    closeStory();
    if (st && st.act === "bfilter") {
      S.filter = st.f;
      S.query = "";
      S.tab = "catalog";
      S.stack = [];
      render();
    } else if (st && st.act === "discounts") {
      go("discounts");
    } else if (st && st.act === "novelties") {
      go("novelties");
    } else if (st && st.act === "bonuses") {
      go("bonuses");
    } else if (st && st.act === "binfo") {
      go("discounts");
    }
  } else if (a === "bundle") go("bundle", { b: +el.getAttribute("data-b") });
  else if (a === "addbundle") {
    var b = BUNDLES[+el.getAttribute("data-b")];
    if (b) {
      b.ids.forEach(function (id) {
        S.cart[id] = (S.cart[id] || 0) + 1;
      });
      save();
      S.stack = [];
      S.tab = "cart";
      render();
      toast("Набор добавлен в корзину");
    }
  }
});

S.theme = S.theme || LS.get("nk_theme", "dark");
function applyTheme() {
  try {
    document.documentElement.setAttribute("data-theme", S.theme === "light" ? "light" : "");
    var m = document.querySelector("meta[name=theme-color]");
    if (m) m.setAttribute("content", S.theme === "light" ? "#F2F2F7" : "#0E0F13");
  } catch (e) {}
}
document.addEventListener("click", function (e) {
  var el = e.target.closest('[data-act2="theme"]');
  if (!el) return;
  S.theme = S.theme === "light" ? "dark" : "light";
  LS.set("nk_theme", S.theme);
  applyTheme();
  render();
  toast(S.theme === "light" ? "Светлая тема" : "Тёмная тема");
});
applyTheme();
