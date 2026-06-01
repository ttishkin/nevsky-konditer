const db = require("./index");
const { applySchema } = require("./migrate");
const { seed } = require("./seed");
const logger = require("../utils/logger");
module.exports = function init() {
  applySchema();
  const empty = db.prepare("SELECT COUNT(*) c FROM products").get().c === 0;
  if (empty) {
    seed();
    logger.info("База инициализирована и наполнена данными");
  } else {
    logger.info("База готова (данные уже есть)");
  }
};
