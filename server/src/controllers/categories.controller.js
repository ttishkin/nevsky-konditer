const repo = require("../repositories/categoryRepo");
const asyncHandler = require("../utils/asyncHandler");
exports.list = asyncHandler(async (req, res) => res.json(repo.all()));
