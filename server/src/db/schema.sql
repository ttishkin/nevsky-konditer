-- Схема базы данных «Невский Кондитер — ЗОЖ» (SQLite)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  sex           TEXT,
  age           INTEGER,
  height        INTEGER,
  weight        INTEGER,
  activity      REAL,
  goal          TEXT,
  kcal_norm     INTEGER,
  points        INTEGER NOT NULL DEFAULT 0,
  role          TEXT NOT NULL DEFAULT 'user',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT UNIQUE NOT NULL,
  color TEXT,
  glyph TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id),
  name        TEXT NOT NULL,
  kcal        INTEGER,
  protein     REAL,
  fat         REAL,
  carb        REAL,
  grams       INTEGER,
  price       INTEGER,
  sostav      TEXT,
  benefit     TEXT,
  is_hit      INTEGER NOT NULL DEFAULT 0,
  is_novelty  INTEGER NOT NULL DEFAULT 0,
  image_url   TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_tags (
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag        TEXT NOT NULL,
  PRIMARY KEY (product_id, tag)
);

CREATE TABLE IF NOT EXISTS addresses (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label      TEXT,
  address    TEXT NOT NULL,
  lat        REAL,
  lng        REAL,
  is_pickup  INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pickup_points (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT NOT NULL,
  address TEXT NOT NULL,
  lat     REAL,
  lng     REAL
);

CREATE TABLE IF NOT EXISTS promo_codes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  code             TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  active           INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  no           TEXT UNIQUE NOT NULL,
  total        INTEGER NOT NULL DEFAULT 0,
  delivery     INTEGER NOT NULL DEFAULT 0,
  bonus_earned INTEGER NOT NULL DEFAULT 0,
  bonus_spent  INTEGER NOT NULL DEFAULT 0,
  promo_code   TEXT,
  status       TEXT NOT NULL DEFAULT 'new',
  address_id   INTEGER REFERENCES addresses(id),
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  qty        INTEGER NOT NULL DEFAULT 1,
  price      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  author     TEXT,
  rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text       TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bonus_transactions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id   INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  amount     INTEGER NOT NULL,
  type       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS diary_entries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  name       TEXT,
  qty        INTEGER NOT NULL DEFAULT 1,
  grams      INTEGER,
  kcal       INTEGER,
  meal       TEXT,
  day        TEXT NOT NULL DEFAULT (date('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_user_day ON diary_entries(user_id, day);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_bonus_user ON bonus_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag);

CREATE TABLE IF NOT EXISTS cart_items (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  qty        INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  email      TEXT,
  message    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_email ON notifications(email);
