const db = require("../db/index");
const pub = "id,email,name,sex,age,height,weight,activity,goal,kcal_norm AS kcalNorm,points,role,created_at AS createdAt";
exports.create = (u) => {
  const r = db.prepare("INSERT INTO users (email,password_hash,name,sex,age,height,weight,activity,goal,kcal_norm,points) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
    .run(u.email, u.passwordHash, u.name || null, u.sex || null, u.age || null, u.height || null, u.weight || null, u.activity || null, u.goal || null, u.kcalNorm || null, u.points || 0);
  return exports.findById(r.lastInsertRowid);
};
exports.findByEmailRaw = (email) => db.prepare("SELECT * FROM users WHERE email=?").get(email);
exports.findById = (id) => db.prepare("SELECT " + pub + " FROM users WHERE id=?").get(id);
exports.addPoints = (id, delta) => db.prepare("UPDATE users SET points = MAX(0, points + ?) WHERE id=?").run(delta, id);
exports.updateProfile = (id, p) => {
  db.prepare("UPDATE users SET name=?,sex=?,age=?,height=?,weight=?,activity=?,goal=?,kcal_norm=? WHERE id=?")
    .run(p.name, p.sex, p.age, p.height, p.weight, p.activity, p.goal, p.kcalNorm, id);
  return exports.findById(id);
};
