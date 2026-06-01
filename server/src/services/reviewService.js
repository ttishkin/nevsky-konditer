const reviewRepo = require("../repositories/reviewRepo");
const { bad } = require("../models/validate");
exports.listByProduct = (pid) => reviewRepo.byProduct(pid);
exports.add = (body, user) => {
  const rating = Number(body.rating);
  if (!(rating >= 1 && rating <= 5)) throw bad("Оценка должна быть от 1 до 5");
  if (!body.productId) throw bad("Не указан товар");
  return reviewRepo.create({
    productId: body.productId,
    userId: user ? user.id : null,
    author: (user && user.name) || body.author || "Аноним",
    rating,
    text: body.text,
  });
};
