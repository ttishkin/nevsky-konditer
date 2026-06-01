const svc = require("../services/addressService");
const asyncHandler = require("../utils/asyncHandler");
exports.list = asyncHandler(async (req, res) => res.json(svc.list(req.user)));
exports.create = asyncHandler(async (req, res) =>
  res.status(201).json(svc.add(req.user, req.body))
);
exports.remove = asyncHandler(async (req, res) =>
  res.json(svc.remove(req.user, Number(req.params.id)))
);
