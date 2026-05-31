const r = require("express").Router();
const c = require("../controllers/diary.controller");
const { authRequired } = require("../middleware/auth");
r.use(authRequired);
r.get("/", c.list);
r.post("/", c.create);
r.patch("/:id", c.update);
r.delete("/:id", c.remove);
module.exports = r;
