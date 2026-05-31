// Уведомления текущего пользователя (о статусах его заказов)
const notificationRepo = require("../repositories/notificationRepo");
const asyncHandler = require("../utils/asyncHandler");
exports.mine = asyncHandler(async (req, res) => res.json(notificationRepo.byEmail(req.user.email, 30)));
