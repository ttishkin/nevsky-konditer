const db = require("../db/index");
exports.all = () => db.prepare("SELECT id,name,color,glyph FROM categories ORDER BY id").all();
