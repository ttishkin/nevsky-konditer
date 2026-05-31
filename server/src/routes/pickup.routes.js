const r = require("express").Router();
const c = require("../controllers/pickup.controller");
r.get("/", c.list);
module.exports = r;
