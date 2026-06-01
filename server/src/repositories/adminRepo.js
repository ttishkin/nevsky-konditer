const db = require("../db/index");
exports.allOrders = () => {
  const orders = db
    .prepare(
      "SELECT o.*, u.email AS userEmail FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.id DESC"
    )
    .all();
  const itemsStmt = db.prepare(
    "SELECT oi.product_id AS productId, oi.qty, oi.price, p.name FROM order_items oi LEFT JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?"
  );
  orders.forEach((o) => {
    o.items = itemsStmt.all(o.id);
  });
  return orders;
};
exports.setStatus = (id, status) =>
  db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, id);
exports.userEmailForOrder = (id) => {
  const r = db
    .prepare(
      "SELECT u.email AS email FROM orders o LEFT JOIN users u ON u.id=o.user_id WHERE o.id=?"
    )
    .get(id);
  return r ? r.email : null;
};
exports.getOrder = (id) => db.prepare("SELECT * FROM orders WHERE id=?").get(id);
exports.stats = () => ({
  orders: db.prepare("SELECT COUNT(*) c FROM orders").get().c,
  revenue: db.prepare("SELECT COALESCE(SUM(total),0) s FROM orders").get().s,
  users: db.prepare("SELECT COUNT(*) c FROM users").get().c,
  products: db.prepare("SELECT COUNT(*) c FROM products").get().c,
  byStatus: db.prepare("SELECT status, COUNT(*) c FROM orders GROUP BY status").all(),
});

exports.users = () =>
  db
    .prepare(
      "SELECT u.id, u.email, u.name, u.role, u.points, u.created_at AS createdAt, (SELECT COUNT(*) FROM orders o WHERE o.user_id=u.id) AS ordersCount FROM users u ORDER BY u.id"
    )
    .all();
exports.userById = (id) =>
  db
    .prepare(
      "SELECT id, email, name, role, points, sex, age, height, weight, activity, goal, kcal_norm AS kcalNorm, created_at AS createdAt FROM users WHERE id=?"
    )
    .get(id);
exports.userOrders = (id) => {
  const orders = db.prepare("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC").all(id);
  const its = db.prepare(
    "SELECT oi.product_id AS productId, oi.qty, oi.price, p.name FROM order_items oi LEFT JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?"
  );
  orders.forEach((o) => {
    o.items = its.all(o.id);
  });
  return orders;
};
exports.salesByDay = (days) => {
  return db
    .prepare(
      "SELECT date(created_at) AS day, COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue FROM orders GROUP BY date(created_at) ORDER BY day DESC LIMIT ?"
    )
    .all(days || 14)
    .reverse();
};
