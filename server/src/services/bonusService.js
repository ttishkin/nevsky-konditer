const bonusRepo = require("../repositories/bonusRepo");
exports.summary = (user) => ({
  balance: user.points || 0,
  transactions: bonusRepo.byUser(user.id),
});
