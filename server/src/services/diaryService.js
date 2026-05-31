const diaryRepo = require("../repositories/diaryRepo");
const productRepo = require("../repositories/productRepo");
const db = require("../db/index");
const { bad } = require("../models/validate");

// Товар приходит из репозитория в клиентском формате: { id, n, kcal, p, f, c, g, ... }
function kcalForProduct(productId, grams) {
  const p = productRepo.byId(productId);
  if (!p) return null;
  const g = grams || p.g;
  return Math.round((p.kcal * g) / 100);
}

exports.list = (user, day) => diaryRepo.byUserDay(user.id, day || new Date().toISOString().slice(0, 10));

exports.add = (user, body) => {
  if (!body.productId && !body.name) throw bad("Нужен productId или name");
  const qty = Math.max(1, Number(body.qty) || 1);
  let grams = body.grams || null, kcal = body.kcal || null;
  if (body.productId) {
    const p = productRepo.byId(body.productId);
    if (p) { grams = grams || p.g * qty; kcal = kcal || Math.round((p.kcal * grams) / 100); }
  }
  return diaryRepo.create({ userId: user.id, productId: body.productId, name: body.name, qty, grams, kcal, meal: body.meal, day: body.day });
};

exports.updateQty = (user, id, qty) => {
  qty = Math.max(1, Number(qty) || 1);
  const row = db.prepare("SELECT * FROM diary_entries WHERE id=? AND user_id=?").get(id, user.id);
  if (!row) throw bad("Запись не найдена", 404);
  let grams = row.grams, kcal = row.kcal;
  if (row.product_id) {
    const p = productRepo.byId(row.product_id);
    if (p) { grams = p.g * qty; kcal = Math.round((p.kcal * grams) / 100); }
  }
  diaryRepo.updateQty(id, user.id, qty, grams, kcal);
  return db.prepare("SELECT id,product_id AS productId,name,qty,grams,kcal,meal,day FROM diary_entries WHERE id=?").get(id);
};

exports.remove = (user, id) => { const r = diaryRepo.remove(id, user.id); if (!r.changes) throw bad("Запись не найдена", 404); return { ok: true }; };
