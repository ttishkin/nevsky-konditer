const db = require("../db/index");
exports.byUser = (userId) =>
  db
    .prepare(
      "SELECT id,label,address,lat,lng,is_pickup AS isPickup FROM addresses WHERE user_id=? ORDER BY id DESC"
    )
    .all(userId);
exports.create = (a) => {
  const r = db
    .prepare("INSERT INTO addresses (user_id,label,address,lat,lng,is_pickup) VALUES (?,?,?,?,?,?)")
    .run(a.userId, a.label || null, a.address, a.lat || null, a.lng || null, a.isPickup ? 1 : 0);
  return db
    .prepare("SELECT id,label,address,lat,lng,is_pickup AS isPickup FROM addresses WHERE id=?")
    .get(r.lastInsertRowid);
};
exports.remove = (id, userId) =>
  db.prepare("DELETE FROM addresses WHERE id=? AND user_id=?").run(id, userId);
