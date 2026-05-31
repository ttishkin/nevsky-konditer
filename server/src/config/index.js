// Конфигурация сервера
const path = require("path");
module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpires: process.env.JWT_EXPIRES || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  dbPath: process.env.DB_PATH
    ? path.resolve(__dirname, "..", "..", process.env.DB_PATH)
    : path.join(__dirname, "..", "..", "data", "app.db"),
  clientDir: path.join(__dirname, "..", "..", "..", "client"),
};
