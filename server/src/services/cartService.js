const cartRepo = require("../repositories/cartRepo");
exports.get = (user) => cartRepo.get(user.id);
exports.replace = (user, items) => cartRepo.replace(user.id, items);
