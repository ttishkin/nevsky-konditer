const r = require("express").Router();
const c = require("../controllers/categories.controller");
r.get("/", c.list);
module.exports = r;
