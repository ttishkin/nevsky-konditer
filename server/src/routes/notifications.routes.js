const r = require("express").Router();
const c = require("../controllers/notifications.controller");
const { authRequired } = require("../middleware/auth");
r.get("/", authRequired, c.mine);
module.exports = r;
