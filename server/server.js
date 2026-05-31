// Точка входа: инициализация БД и запуск HTTP-сервера
const app = require("./src/app");
const config = require("./src/config");
const logger = require("./src/utils/logger");
const init = require("./src/db/init");

init();
app.listen(config.port, () => logger.info("Невский Кондитер — API запущен: http://localhost:" + config.port));
