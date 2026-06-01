const svc = require("../services/orderService");
const asyncHandler = require("../utils/asyncHandler");
exports.create = asyncHandler(async (req, res) =>
  res.status(201).json(svc.create(req.body, req.user || null))
);
exports.list = asyncHandler(async (req, res) => res.json(svc.listByUser(req.user)));
exports.getOne = asyncHandler(async (req, res) =>
  res.json(svc.get(Number(req.params.id), req.user))
);
