const fs = require("fs");
const path = require("path");
const db = require("./index");
const { hashPassword } = require("../utils/hash");
function seed() {
  const dir = path.join(__dirname, "seed-data");
  const products = JSON.parse(fs.readFileSync(path.join(dir, "products.json"), "utf8"));
  const cats = JSON.parse(fs.readFileSync(path.join(dir, "categories.json"), "utf8"));
  db.exec("BEGIN");
  try {
    const insCat = db.prepare("INSERT OR IGNORE INTO categories (name,color,glyph) VALUES (?,?,?)");
    Object.keys(cats).forEach((n) => insCat.run(n, cats[n].c || null, cats[n].gl || null));
    const catId = {};
    for (const r of db.prepare("SELECT id,name FROM categories").all()) catId[r.name] = r.id;
    const insP = db.prepare("INSERT OR REPLACE INTO products (id,category_id,name,kcal,protein,fat,carb,grams,price,sostav,benefit,is_hit,is_novelty) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
    const insT = db.prepare("INSERT OR IGNORE INTO product_tags (product_id,tag) VALUES (?,?)");
    products.forEach((p) => {
      insP.run(p.id, catId[p.cat] || null, p.n, p.kcal, p.p, p.f, p.c, p.g, p.price, p.sostav || null, p.benefit || null, p.hit ? 1 : 0, p.nov ? 1 : 0);
      (p.tags || []).forEach((t) => insT.run(p.id, t));
    });
    const insPromo = db.prepare("INSERT OR IGNORE INTO promo_codes (code,discount_percent,active) VALUES (?,?,1)");
    insPromo.run("ЗОЖ10", 10); insPromo.run("ДРУГ500", 0);
    if (db.prepare("SELECT COUNT(*) c FROM pickup_points").get().c === 0) {
      const insPvz = db.prepare("INSERT INTO pickup_points (name,address,lat,lng) VALUES (?,?,?,?)");
      insPvz.run("Невский Кондитер — Невский пр.", "Санкт-Петербург, Невский пр., 100", 59.93, 30.36);
      insPvz.run("Невский Кондитер — Лиговский", "Санкт-Петербург, Лиговский пр., 50", 59.92, 30.35);
    }
    if (!db.prepare("SELECT id FROM users WHERE email=?").get("admin@nk.ru")) {
      db.prepare("INSERT INTO users (email,password_hash,name,role,points) VALUES (?,?,?,?,?)")
        .run("admin@nk.ru", hashPassword("admin1234"), "Администратор фабрики", "admin", 0);
    }
    if (!db.prepare("SELECT id FROM users WHERE email=?").get("demo@nk.ru")) {
      db.prepare("INSERT INTO users (email,password_hash,name,sex,age,height,weight,activity,goal,kcal_norm,points) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
        .run("demo@nk.ru", hashPassword("demo1234"), "Демо-пользователь", "m", 30, 180, 80, 1.375, "keep", 2400, 250);
    }
    db.exec("COMMIT");
  } catch (e) { db.exec("ROLLBACK"); throw e; }
}
module.exports = { seed };
if (require.main === module) {
  seed();
  const tables = { categories: "categories", products: "products", users: "users" };
  const c = (t) => db.prepare("SELECT COUNT(*) c FROM " + tables[t]).get().c;
  require("../utils/logger").info("Сидинг:", JSON.stringify({ categories: c("categories"), products: c("products"), users: c("users") }));
}
