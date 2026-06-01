const db = require("../db/index");
exports.create = (n) =>
  db
    .prepare("INSERT INTO notifications (order_id, email, message) VALUES (?,?,?)")
    .run(n.orderId || null, n.email || null, n.message);
exports.recent = (limit) =>
  db
    .prepare(
      "SELECT id, order_id AS orderId, email, message, created_at AS createdAt FROM notifications ORDER BY id DESC LIMIT ?"
    )
    .all(limit || 50);
exports.byEmail = (email, limit) =>
  db
    .prepare(
      "SELECT id, order_id AS orderId, message, created_at AS createdAt FROM notifications WHERE email=? ORDER BY id DESC LIMIT ?"
    )
    .all(email, limit || 30);
