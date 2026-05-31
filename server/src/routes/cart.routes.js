const r = require("express").Router();
const c = require("../controllers/cart.controller");
const { authRequired } = require("../middleware/auth");
r.use(authRequired);
r.get("/", c.get);
r.put("/", c.replace);
module.exports = r;
