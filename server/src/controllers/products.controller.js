const svc = require("../services/productService");
const reviewSvc = require("../services/reviewService");
const asyncHandler = require("../utils/asyncHandler");
exports.list = asyncHandler(async (req, res) =>
  res.json(
    svc.list({
      q: req.query.q,
      tag: req.query.tag,
      category: req.query.category,
      sort: req.query.sort,
    })
  )
);
exports.getOne = asyncHandler(async (req, res) => res.json(svc.get(Number(req.params.id))));
exports.reviews = asyncHandler(async (req, res) =>
  res.json(reviewSvc.listByProduct(Number(req.params.id)))
);
