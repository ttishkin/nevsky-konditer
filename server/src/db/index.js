const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const path = require("path");
const config = require("../config");

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
const db = new DatabaseSync(config.dbPath);
// WAL ускоряет работу, но поддерживается не всеми ФС — включаем мягко
try {
  db.exec("PRAGMA journal_mode = WAL;");
} catch (e) {
  /* fallback на обычный журнал */
}
db.exec("PRAGMA foreign_keys = ON;");

module.exports = db;
