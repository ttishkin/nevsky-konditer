const r = require("express").Router();
const c = require("../controllers/bonuses.controller");
const { authRequired } = require("../middleware/auth");
r.get("/", authRequired, c.summary);
module.exports = r;
