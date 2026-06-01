const addressRepo = require("../repositories/addressRepo");
const { requireFields } = require("../models/validate");
exports.list = (user) => addressRepo.byUser(user.id);
exports.add = (user, body) => {
  requireFields(body, ["address"]);
  return addressRepo.create({ userId: user.id, ...body });
};
exports.remove = (user, id) => {
  addressRepo.remove(id, user.id);
  return { ok: true };
};
