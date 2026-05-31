const db = require("../db/index");
exports.get = (userId) => db.prepare("SELECT product_id AS id FROM favorites WHERE user_id=?").all(userId).map((r) => r.id);
exports.replace = (userId, ids) => {
  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM favorites WHERE user_id=?").run(userId);
    const ins = db.prepare("INSERT OR IGNORE INTO favorites (user_id, product_id) VALUES (?,?)");
    (ids || []).forEach((id) => { if (id != null) ins.run(userId, Number(id)); });
    db.exec("COMMIT");
  } catch (e) { db.exec("ROLLBACK"); throw e; }
  return exports.get(userId);
};
