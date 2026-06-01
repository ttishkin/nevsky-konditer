/* js/services/nutrition.js — сервис питания: нормы, КБЖУ, кольцо прогресса */
function norm() {
  if (S.profile && S.profile.kcal) return S.profile.kcal;
  return 2000;
}
function macroTargets() {
  var k = norm();
  return {
    p: Math.round((k * 0.25) / 4),
    f: Math.round((k * 0.3) / 9),
    c: Math.round((k * 0.45) / 4),
  };
}
function diaryTotals() {
  var t = { kcal: 0, p: 0, f: 0, c: 0 };
  S.diary.forEach(function (e) {
    var p = prod(e.id);
    if (!p) return;
    var k = e.grams / 100;
    t.kcal += p.kcal * k;
    t.p += p.p * k;
    t.f += p.f * k;
    t.c += p.c * k;
  });
  t.kcal = Math.round(t.kcal);
  t.p = Math.round(t.p);
  t.f = Math.round(t.f);
  t.c = Math.round(t.c);
  return t;
}
function ringSVG(consumed, goal) {
  var R = 52,
    C = 2 * Math.PI * R;
  var pct = Math.min(consumed / goal, 1);
  var off = C * (1 - pct);
  var col = consumed > goal ? "#FFB23E" : "#34C759";
  return (
    '<svg class="ring" viewBox="0 0 120 120">' +
    '<circle cx="60" cy="60" r="' +
    R +
    '" stroke="rgba(118,118,128,.16)" stroke-width="11" fill="none"/>' +
    '<circle cx="60" cy="60" r="' +
    R +
    '" stroke="' +
    col +
    '" stroke-width="11" fill="none" stroke-linecap="round" stroke-dasharray="' +
    C +
    '" stroke-dashoffset="' +
    off +
    '" transform="rotate(-90 60 60)"/>' +
    "</svg>"
  );
}
function macroBar(name, val, goal, col) {
  var pct = goal ? Math.min((val / goal) * 100, 100) : 0;
  return (
    '<div class="macro"><div class="top"><b>' +
    name +
    "</b><span>" +
    val +
    " / " +
    goal +
    ' г</span></div><div class="bar"><i style="width:' +
    pct +
    "%;background:" +
    col +
    '"></i></div></div>'
  );
}
