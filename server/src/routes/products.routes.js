const r = require("express").Router();
const c = require("../controllers/products.controller");
r.get("/", c.list);
r.get("/:id", c.getOne);
r.get("/:id/reviews", c.reviews);
module.exports = r;
