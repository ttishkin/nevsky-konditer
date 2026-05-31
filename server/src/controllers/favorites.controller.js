const svc = require("../services/favoriteService");
const asyncHandler = require("../utils/asyncHandler");
exports.get = asyncHandler(async (req, res) => res.json(svc.get(req.user)));
exports.replace = asyncHandler(async (req, res) => res.json(svc.replace(req.user, req.body.ids)));
