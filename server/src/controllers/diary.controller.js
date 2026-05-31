const svc = require("../services/diaryService");
const asyncHandler = require("../utils/asyncHandler");
exports.list = asyncHandler(async (req, res) => res.json(svc.list(req.user, req.query.day)));
exports.create = asyncHandler(async (req, res) => res.status(201).json(svc.add(req.user, req.body)));
exports.update = asyncHandler(async (req, res) => res.json(svc.updateQty(req.user, Number(req.params.id), req.body.qty)));
exports.remove = asyncHandler(async (req, res) => res.json(svc.remove(req.user, Number(req.params.id))));
