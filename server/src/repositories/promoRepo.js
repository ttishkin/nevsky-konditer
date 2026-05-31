const db = require("../db/index");
exports.byCode = (code) => db.prepare("SELECT code, discount_percent AS discountPercent, active FROM promo_codes WHERE code=?").get(code);
