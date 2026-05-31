const r = require("express").Router();
const c = require("../controllers/auth.controller");
const { authRequired } = require("../middleware/auth");
r.post("/register", c.register);
r.post("/login", c.login);
r.get("/me", authRequired, c.me);
module.exports = r;
