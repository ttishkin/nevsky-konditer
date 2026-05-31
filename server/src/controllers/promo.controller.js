const svc = require("../services/promoService");
const asyncHandler = require("../utils/asyncHandler");
exports.validate = asyncHandler(async (req, res) => res.json(svc.validate(req.params.code)));
