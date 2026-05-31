const svc = require("../services/bonusService");
const asyncHandler = require("../utils/asyncHandler");
exports.summary = asyncHandler(async (req, res) => res.json(svc.summary(req.user)));
