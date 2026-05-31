const adminRepo = require("../repositories/adminRepo");
const notificationRepo = require("../repositories/notificationRepo");
const mailer = require("../utils/mailer");
const { bad } = require("../models/validate");
const STATUSES = ["new", "processing", "shipped", "delivered", "cancelled"];
exports.STATUSES = STATUSES;
exports.orders = () => adminRepo.allOrders();
exports.stats = () => adminRepo.stats();
exports.notifications = () => notificationRepo.recent(50);
exports.users = () => adminRepo.users();
exports.userDetail = (id) => {
  const user = adminRepo.userById(id);
  if (!user) throw bad("Пользователь не найден", 404);
  return { user: user, orders: adminRepo.userOrders(id) };
};
exports.sales = (days) => adminRepo.salesByDay(days);
exports.setStatus = (id, status) => {
  if (STATUSES.indexOf(status) < 0) throw bad("Недопустимый статус. Разрешено: " + STATUSES.join(", "));
  if (!adminRepo.getOrder(id)) throw bad("Заказ не найден", 404);
  adminRepo.setStatus(id, status);
  const order = adminRepo.getOrder(id);
  const email = adminRepo.userEmailForOrder(id);
  const msg = mailer.buildMessage(order);
  notificationRepo.create({ orderId: id, email: email, message: msg });
  mailer.send(email, "Статус заказа " + order.no, msg); // не блокируем ответ
  return order;
};
