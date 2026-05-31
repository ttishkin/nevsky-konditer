# Модель данных (SQLite)

Схема — в `server/src/db/schema.sql`. Основные таблицы:

| Таблица | Назначение | Ключевые поля |
|---------|------------|---------------|
| `users` | Пользователи | email (уник.), password_hash, профиль, kcal_norm, points |
| `categories` | Категории | name (уник.), color, glyph |
| `products` | Товары | name, kcal, protein, fat, carb, grams, price, is_hit, is_novelty, category_id → categories |
| `product_tags` | Теги товаров | product_id → products, tag |
| `orders` | Заказы | no (уник.), total, delivery, bonus_earned, bonus_spent, promo_code, status, user_id → users |
| `order_items` | Позиции заказа | order_id → orders, product_id → products, qty, price |
| `reviews` | Отзывы | product_id → products, user_id → users, rating, text |
| `bonus_transactions` | История бонусов | user_id → users, order_id → orders, amount, type (earn/spend) |
| `diary_entries` | Дневник питания | user_id → users, product_id → products, qty, grams, kcal, meal, day |
| `addresses` | Адреса доставки | user_id → users, address, lat, lng, is_pickup |
| `pickup_points` | Пункты выдачи | name, address, lat, lng |
| `promo_codes` | Промокоды | code (уник.), discount_percent, active |

Связи реализованы через внешние ключи (`PRAGMA foreign_keys = ON`). Индексы — на часто
используемых полях (категория товара, заказы пользователя, дневник по дню и т. д.).
