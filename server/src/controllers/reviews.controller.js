const svc = require("../services/reviewService");
const asyncHandler = require("../utils/asyncHandler");
exports.create = asyncHandler(async (req, res) =>
  res.status(201).json(svc.add(req.body, req.user || null))
);
