const r = require("express").Router();
const c = require("../controllers/reviews.controller");
const { authOptional } = require("../middleware/auth");
r.post("/", authOptional, c.create);
module.exports = r;
