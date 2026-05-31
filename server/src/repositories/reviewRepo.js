const db = require("../db/index");
exports.byProduct = (pid) => db.prepare("SELECT id,author,rating,text,created_at AS createdAt FROM reviews WHERE product_id=? ORDER BY id DESC").all(pid);
exports.create = (r) => { const x = db.prepare("INSERT INTO reviews (product_id,user_id,author,rating,text) VALUES (?,?,?,?,?)").run(r.productId, r.userId || null, r.author || null, r.rating, r.text || null); return db.prepare("SELECT id,author,rating,text,created_at AS createdAt FROM reviews WHERE id=?").get(x.lastInsertRowid); };
exports.avg = (pid) => db.prepare("SELECT ROUND(AVG(rating),1) avg, COUNT(*) cnt FROM reviews WHERE product_id=?").get(pid);
