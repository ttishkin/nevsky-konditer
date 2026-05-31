const logger = require("../utils/logger");
module.exports = (err, req, res, next) => {
  if (!err.status) logger.error(err.stack || err.message);
  res.status(err.status || 500).json({ error: err.message || "Внутренняя ошибка сервера" });
};
