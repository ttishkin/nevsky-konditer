const db = require("../db/index");
exports.get = (userId) => db.prepare("SELECT product_id AS id, qty FROM cart_items WHERE user_id=?").all(userId);
exports.replace = (userId, items) => {
  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM cart_items WHERE user_id=?").run(userId);
    const ins = db.prepare("INSERT INTO cart_items (user_id, product_id, qty) VALUES (?,?,?)");
    (items || []).forEach((it) => { if (it && it.id != null) ins.run(userId, Number(it.id), Math.max(1, Number(it.qty) || 1)); });
    db.exec("COMMIT");
  } catch (e) { db.exec("ROLLBACK"); throw e; }
  return exports.get(userId);
};
