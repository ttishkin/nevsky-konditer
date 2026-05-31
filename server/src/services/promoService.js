const promoRepo = require("../repositories/promoRepo");
exports.validate = (code) => {
  const pr = promoRepo.byCode(String(code || "").toUpperCase());
  if (!pr || !pr.active) return { valid: false };
  return { valid: true, code: pr.code, discountPercent: pr.discountPercent };
};
