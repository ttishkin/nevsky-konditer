const r = require("express").Router();
const c = require("../controllers/orders.controller");
const { authRequired, authOptional } = require("../middleware/auth");
r.post("/", authOptional, c.create);
r.get("/", authRequired, c.list);
r.get("/:id", authRequired, c.getOne);
module.exports = r;
