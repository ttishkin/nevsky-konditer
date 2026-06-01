const fs = require("fs");
const path = require("path");
const db = require("./index");
function applySchema() {
  db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
  // миграция для уже существующих баз: добавить колонку role, если её нет
  try { db.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'"); } catch (e) { /* уже есть */ }
}
module.exports = { applySchema };
if (require.main === module) { applySchema(); require("../utils/logger").info("Миграция выполнена"); }
