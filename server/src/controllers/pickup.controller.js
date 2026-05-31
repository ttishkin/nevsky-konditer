const repo = require("../repositories/pickupRepo");
const asyncHandler = require("../utils/asyncHandler");
exports.list = asyncHandler(async (req, res) => res.json(repo.all()));
