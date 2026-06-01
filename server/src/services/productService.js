const productRepo = require("../repositories/productRepo");
const reviewRepo = require("../repositories/reviewRepo");
const { bad } = require("../models/validate");
exports.list = (query) => productRepo.all(query || {});
exports.get = (id) => {
  const p = productRepo.byId(id);
  if (!p) throw bad("Товар не найден", 404);
  const r = reviewRepo.avg(id);
  p.rating = r.avg || null;
  p.reviewsCount = r.cnt || 0;
  p.reviews = reviewRepo.byProduct(id);
  return p;
};
