/* js/core/helpers.js — утилиты: $, esc, money, hexA, prod, счётчики корзины, toast */
function $(id) {
  return document.getElementById(id);
}
function hexA(h, a) {
  var n = parseInt(h.slice(1), 16);
  return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
function money(n) {
  return Math.round(n) + " ₽";
}
function prod(id) {
  for (var i = 0; i < P.length; i++) {
    if (P[i].id === id) return P[i];
  }
  return null;
}
function portionKcal(p) {
  return Math.round((p.kcal * p.g) / 100);
}
function cartCount() {
  var n = 0;
  for (var k in S.cart) n += S.cart[k];
  return n;
}
function cartTotal() {
  var t = 0;
  for (var k in S.cart) {
    var p = prod(+k);
    if (p) t += p.price * S.cart[k];
  }
  return t;
}
function toast(msg) {
  var t = $("toast");
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(t._t);
  t._t = setTimeout(function () {
    t.classList.remove("on");
  }, 1600);
}
