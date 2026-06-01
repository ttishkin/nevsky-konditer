const userRepo = require("../repositories/userRepo");
const { hashPassword, verifyPassword } = require("../utils/hash");
const token = require("../utils/token");
const { requireFields, isEmail, bad } = require("../models/validate");

function calcKcal(p) {
  if (!p.weight || !p.height || !p.age) return null;
  const s = p.sex === "f" ? -161 : 5;
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + s;
  const tdee = bmr * (p.activity || 1.2);
  const adj = p.goal === "lose" ? -0.2 : p.goal === "gain" ? 0.15 : 0;
  return Math.round(tdee * (1 + adj));
}
exports.register = (body) => {
  requireFields(body, ["email", "password"]);
  const email = String(body.email).trim().toLowerCase();
  if (!isEmail(email)) throw bad("Некорректный email");
  if (String(body.password).length < 6) throw bad("Пароль не короче 6 символов");
  if (userRepo.findByEmailRaw(email)) throw bad("Пользователь с таким email уже есть");
  const kcalNorm = calcKcal(body);
  const user = userRepo.create({
    email, passwordHash: hashPassword(body.password), name: body.name,
    sex: body.sex, age: body.age, height: body.height, weight: body.weight,
    activity: body.activity, goal: body.goal, kcalNorm, points: 200, // приветственные баллы
  });
  return { token: token.sign({ id: user.id }), user };
};
exports.login = (body) => {
  requireFields(body, ["email", "password"]);
  const raw = userRepo.findByEmailRaw(String(body.email).trim().toLowerCase());
  if (!raw || !verifyPassword(body.password, raw.password_hash)) throw bad("Неверный email или пароль", 401);
  return { token: token.sign({ id: raw.id }), user: userRepo.findById(raw.id) };
};
exports.me = (user) => user;
