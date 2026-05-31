const favoriteRepo = require("../repositories/favoriteRepo");
exports.get = (user) => favoriteRepo.get(user.id);
exports.replace = (user, ids) => favoriteRepo.replace(user.id, ids);
