// Тесты сервиса авторизации (node --test). Использует временную БД.
process.env.DB_PATH = require("path").join(require("os").tmpdir(), "nk_test_auth_" + Date.now() + ".db");
const test = require("node:test");
const assert = require("node:assert");
require("../src/db/init")();
const authService = require("../src/services/authService");

test("регистрация создаёт пользователя и токен", () => {
  const r = authService.register({ email: "u1@nk.ru", password: "secret1", name: "U1", weight: 80, height: 180, age: 30, sex: "m", activity: 1.2, goal: "keep" });
  assert.ok(r.token, "есть токен");
  assert.equal(r.user.email, "u1@nk.ru");
  assert.ok(r.user.kcalNorm > 0, "норма рассчитана");
  assert.ok(r.user.points >= 0);
});

test("повторный email отклоняется", () => {
  assert.throws(() => authService.register({ email: "u1@nk.ru", password: "secret1" }));
});

test("вход с верным паролем работает, с неверным — нет", () => {
  authService.register({ email: "u2@nk.ru", password: "secret1" });
  assert.ok(authService.login({ email: "u2@nk.ru", password: "secret1" }).token);
  assert.throws(() => authService.login({ email: "u2@nk.ru", password: "bad" }));
});
