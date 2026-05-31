// Тесты сервиса заказов (node --test). Временная БД.
process.env.DB_PATH = require("path").join(require("os").tmpdir(), "nk_test_order_" + Date.now() + ".db");
const test = require("node:test");
const assert = require("node:assert");
require("../src/db/init")();
const orderService = require("../src/services/orderService");

test("заказ считает сумму и позиции", () => {
  const o = orderService.create({ items: [{ id: 1, q: 2 }, { id: 2, q: 1 }] }, null);
  assert.equal(o.items.length, 2);
  assert.ok(o.subtotal > 0);
  assert.ok(o.total >= 0);
  assert.ok(o.no.startsWith("NK"));
});

test("промокод ЗОЖ10 даёт скидку 10%", () => {
  const o = orderService.create({ items: [{ id: 1, q: 1 }], promoCode: "ЗОЖ10" }, null);
  assert.equal(o.promoDiscount, Math.round(o.subtotal * 0.1));
});

test("пустой заказ отклоняется", () => {
  assert.throws(() => orderService.create({ items: [] }, null));
});
