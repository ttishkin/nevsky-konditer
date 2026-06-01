const productRepo = require("../repositories/productRepo");
const orderRepo = require("../repositories/orderRepo");
const promoRepo = require("../repositories/promoRepo");
const bonusRepo = require("../repositories/bonusRepo");
const userRepo = require("../repositories/userRepo");
const { bad } = require("../models/validate");

const FREE_FROM = 1000,
  DELIVERY = 199,
  EARN_PCT = 5,
  MAX_SPEND_PCT = 30;
exports.create = (body, user) => {
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) throw bad("В заказе нет позиций");
  const line = items.map((it) => {
    const p = productRepo.byId(it.id);
    if (!p) throw bad("Товар не найден: id=" + it.id);
    return {
      productId: p.id,
      qty: Math.max(1, Number(it.qty != null ? it.qty : it.q) || 1),
      price: p.price,
    };
  });
  const subtotal = line.reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = subtotal >= FREE_FROM ? 0 : DELIVERY;
  let promoDiscount = 0,
    promoCode = null;
  if (body.promoCode) {
    const pr = promoRepo.byCode(String(body.promoCode).toUpperCase());
    if (pr && pr.active) {
      promoDiscount = Math.round((subtotal * pr.discountPercent) / 100);
      promoCode = pr.code;
    }
  }
  let bonusSpent = 0,
    bonusEarned = 0;
  if (user) {
    const maxSpend = Math.min(user.points || 0, Math.floor((subtotal * MAX_SPEND_PCT) / 100));
    bonusSpent = Math.max(0, Math.min(Number(body.bonusSpend) || 0, maxSpend));
    bonusEarned = Math.round((subtotal * EARN_PCT) / 100);
  }
  const total = Math.max(0, subtotal + delivery - promoDiscount - bonusSpent);
  const no = "NK" + String(Date.now()).slice(-8);
  const order = orderRepo.create(
    {
      userId: user ? user.id : null,
      no,
      total,
      delivery,
      bonusEarned,
      bonusSpent,
      promoCode,
      status: "new",
      addressId: body.addressId,
    },
    line
  );
  if (user) {
    if (bonusSpent)
      bonusRepo.add({ userId: user.id, orderId: order.id, amount: -bonusSpent, type: "spend" });
    if (bonusEarned)
      bonusRepo.add({ userId: user.id, orderId: order.id, amount: bonusEarned, type: "earn" });
    userRepo.addPoints(user.id, bonusEarned - bonusSpent);
  }
  order.subtotal = subtotal;
  order.promoDiscount = promoDiscount;
  return order;
};
exports.listByUser = (user) => orderRepo.byUser(user.id);
exports.get = (id, user) => {
  const o = orderRepo.byId(id);
  if (!o || (user && o.user_id && o.user_id !== user.id)) throw bad("Заказ не найден", 404);
  return o;
};
