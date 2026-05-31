const r = require("express").Router();
const c = require("../controllers/addresses.controller");
const { authRequired } = require("../middleware/auth");
r.use(authRequired);
r.get("/", c.list);
r.post("/", c.create);
r.delete("/:id", c.remove);
module.exports = r;
