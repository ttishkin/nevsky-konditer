const db = require("../db/index");
function tagsOf(id) { return db.prepare("SELECT tag FROM product_tags WHERE product_id=?").all(id).map((r) => r.tag); }
function toClient(row) {
  if (!row) return row;
  return {
    id: row.id, n: row.name, cat: row.category, kcal: row.kcal,
    p: row.protein, f: row.fat, c: row.carb, g: row.grams, price: row.price,
    sostav: row.sostav || undefined, benefit: row.benefit || undefined,
    hit: row.is_hit ? 1 : undefined, nov: row.is_novelty ? 1 : undefined,
    tags: tagsOf(row.id),
  };
}
const base = "SELECT p.*, c.name AS category FROM products p LEFT JOIN categories c ON c.id=p.category_id";
exports.all = ({ q, tag, category, sort } = {}) => {
  let sql = base, where = [], args = [];
  if (q) { where.push("p.name LIKE ?"); args.push("%" + q + "%"); }
  if (category) { where.push("c.name = ?"); args.push(category); }
  if (tag) { where.push("p.id IN (SELECT product_id FROM product_tags WHERE tag=?)"); args.push(tag); }
  if (where.length) sql += " WHERE " + where.join(" AND ");
  const order = { priceA: "p.price ASC", priceD: "p.price DESC", kcalA: "p.kcal ASC" }[sort] || "p.id ASC";
  sql += " ORDER BY " + order;
  return db.prepare(sql).all(...args).map(toClient);
};
exports.byId = (id) => toClient(db.prepare(base + " WHERE p.id=?").get(id));
