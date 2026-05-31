const db = require("../db/index");
exports.create = (o, items) => {
  db.exec("BEGIN");
  try {
    const r = db.prepare("INSERT INTO orders (user_id,no,total,delivery,bonus_earned,bonus_spent,promo_code,status,address_id) VALUES (?,?,?,?,?,?,?,?,?)")
      .run(o.userId || null, o.no, o.total, o.delivery, o.bonusEarned, o.bonusSpent, o.promoCode || null, o.status || "new", o.addressId || null);
    const id = r.lastInsertRowid;
    const insIt = db.prepare("INSERT INTO order_items (order_id,product_id,qty,price) VALUES (?,?,?,?)");
    items.forEach((it) => insIt.run(id, it.productId, it.qty, it.price));
    db.exec("COMMIT");
    return exports.byId(id);
  } catch (e) { db.exec("ROLLBACK"); throw e; }
};
exports.byId = (id) => {
  const o = db.prepare("SELECT * FROM orders WHERE id=?").get(id);
  if (o) o.items = db.prepare("SELECT product_id AS productId, qty, price FROM order_items WHERE order_id=?").all(id);
  return o;
};
exports.byUser = (userId) => db.prepare("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC").all(userId).map((o) => { o.items = db.prepare("SELECT product_id AS productId, qty, price FROM order_items WHERE order_id=?").all(o.id); return o; });
exports.all = () => db.prepare("SELECT * FROM orders ORDER BY id DESC").all();
