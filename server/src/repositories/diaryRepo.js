const db = require("../db/index");
exports.byUserDay = (userId, day) =>
  db
    .prepare(
      "SELECT id,product_id AS productId,name,qty,grams,kcal,meal,day FROM diary_entries WHERE user_id=? AND day=? ORDER BY id"
    )
    .all(userId, day);
exports.create = (e) => {
  const r = db
    .prepare(
      "INSERT INTO diary_entries (user_id,product_id,name,qty,grams,kcal,meal,day) VALUES (?,?,?,?,?,?,?,COALESCE(?,date('now')))"
    )
    .run(
      e.userId,
      e.productId || null,
      e.name || null,
      e.qty || 1,
      e.grams || null,
      e.kcal || null,
      e.meal || "Перекус",
      e.day || null
    );
  return db
    .prepare(
      "SELECT id,product_id AS productId,name,qty,grams,kcal,meal,day FROM diary_entries WHERE id=?"
    )
    .get(r.lastInsertRowid);
};
exports.updateQty = (id, userId, qty, grams, kcal) =>
  db
    .prepare("UPDATE diary_entries SET qty=?, grams=?, kcal=? WHERE id=? AND user_id=?")
    .run(qty, grams, kcal, id, userId);
exports.remove = (id, userId) =>
  db.prepare("DELETE FROM diary_entries WHERE id=? AND user_id=?").run(id, userId);
