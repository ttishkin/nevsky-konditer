// Проверка JWT из заголовка Authorization: Bearer <token>
const token = require("../utils/token");
const userRepo = require("../repositories/userRepo");
function extract(req) {
  const h = req.headers.authorization || "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
}
function authOptional(req, res, next) {
  const t = extract(req);
  if (t) { try { const p = token.verify(t); req.user = userRepo.findById(p.id) || null; } catch (e) { req.user = null; } }
  next();
}
function authRequired(req, res, next) {
  const t = extract(req);
  if (!t) return res.status(401).json({ error: "Требуется авторизация" });
  try { const p = token.verify(t); const u = userRepo.findById(p.id); if (!u) throw new Error("no user"); req.user = u; next(); }
  catch (e) { res.status(401).json({ error: "Недействительный токен" }); }
}
function adminRequired(req, res, next) {
  authRequired(req, res, function () {
    if (!req.user || req.user.role !== "admin") return res.status(403).json({ error: "Доступ только для администратора" });
    next();
  });
}
module.exports = { authOptional, authRequired, adminRequired };
