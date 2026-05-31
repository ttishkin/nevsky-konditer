const productRepo = require("../repositories/productRepo");
const reviewRepo = require("../repositories/reviewRepo");
exports.list = (query) => productRepo.all(query || {});
exports.get = (id) => {
  const p = productRepo.byId(id);
  if (!p) { const e = new Error("Товар не найден"); e.status = 404; throw e; }
  const r = reviewRepo.avg(id);
  p.rating = r.avg || null; p.reviewsCount = r.cnt || 0;
  p.reviews = reviewRepo.byProduct(id);
  return p;
};
