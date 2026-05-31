const svc = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
exports.register = asyncHandler(async (req, res) => res.status(201).json(svc.register(req.body)));
exports.login = asyncHandler(async (req, res) => res.json(svc.login(req.body)));
exports.me = asyncHandler(async (req, res) => res.json(svc.me(req.user)));
