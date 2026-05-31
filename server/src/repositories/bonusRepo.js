const db = require("../db/index");
exports.add = (t) => db.prepare("INSERT INTO bonus_transactions (user_id,order_id,amount,type) VALUES (?,?,?,?)").run(t.userId, t.orderId || null, t.amount, t.type);
exports.byUser = (userId) => db.prepare("SELECT id,order_id AS orderId,amount,type,created_at AS createdAt FROM bonus_transactions WHERE user_id=? ORDER BY id DESC").all(userId);
