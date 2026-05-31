const db = require("../db/index");
exports.all = () => db.prepare("SELECT id,name,address,lat,lng FROM pickup_points ORDER BY id").all();
