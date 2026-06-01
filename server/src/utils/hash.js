const bcrypt = require("bcryptjs");
exports.hashPassword = (plain) => bcrypt.hashSync(String(plain), 10);
exports.verifyPassword = (plain, hash) => bcrypt.compareSync(String(plain), hash || "");
