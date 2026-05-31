const r = require("express").Router();
const c = require("../controllers/promo.controller");
r.get("/:code", c.validate);
module.exports = r;
