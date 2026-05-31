# REST API

Базовый адрес: `http://localhost:3000/api`.
Защищённые маршруты требуют заголовок `Authorization: Bearer <token>` (токен — из `/auth/register` или `/auth/login`).

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/auth/register` | публично | Регистрация: `email`, `password`, профиль (sex/age/height/weight/activity/goal). Возвращает `{token, user}` |
| POST | `/auth/login` | публично | Вход: `email`, `password` → `{token, user}` |
| GET | `/auth/me` | токен | Текущий пользователь |
| GET | `/products` | публично | Каталог. Фильтры: `?q=` `?category=` `?tag=` `?sort=priceA\|priceD\|kcalA` |
| GET | `/products/:id` | публично | Товар + отзывы + средний рейтинг |
| GET | `/products/:id/reviews` | публично | Отзывы товара |
| GET | `/categories` | публично | Категории |
| POST | `/orders` | опц. токен | Создать заказ; считает сумму, доставку, скидку по промокоду, списание/начисление бонусов |
| GET | `/orders` | токен | Заказы пользователя |
| GET | `/orders/:id` | токен | Заказ по id |
| POST | `/reviews` | опц. токен | Добавить отзыв (`productId`, `rating` 1–5, `text`) |
| GET | `/bonuses` | токен | Баланс и история бонусов |
| GET | `/diary?day=YYYY-MM-DD` | токен | Дневник за день |
| POST | `/diary` | токен | Добавить запись (`productId`/`name`, `qty`, `meal`) |
| PATCH | `/diary/:id` | токен | Изменить количество |
| DELETE | `/diary/:id` | токен | Удалить запись |
| GET / POST / DELETE | `/addresses` | токен | Адреса доставки |
| GET | `/pickup-points` | публично | Пункты выдачи |
| GET | `/promo/:code` | публично | Проверка промокода |

## Примеры

```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.ru","password":"secret1","name":"Аня"}'

# Каталог
curl http://localhost:3000/api/products

# Заказ (с токеном)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" \
  -d '{"items":[{"id":1,"q":2}],"promoCode":"ЗОЖ10","bonusSpend":50}'
```

## Корзина, избранное, админка (v2.1)

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/cart` | токен | Корзина пользователя `[{id, qty}]` |
| PUT | `/cart` | токен | Заменить корзину: `{items:[{id, qty}]}` |
| GET | `/favorites` | токен | Избранное `[id, ...]` |
| PUT | `/favorites` | токен | Заменить избранное: `{ids:[...]}` |
| GET | `/admin/orders` | админ | Все заказы (с позициями и email покупателя) |
| PATCH | `/admin/orders/:id/status` | админ | Сменить статус: new/processing/shipped/delivered/cancelled |
| GET | `/admin/stats` | админ | Сводка: заказы, выручка, пользователи, товары, по статусам |
| GET | `/admin/statuses` | админ | Список допустимых статусов |

Админ-панель фабрики: **`http://localhost:3000/admin`** (вход: `admin@nk.ru` / `admin1234`).

| GET | `/admin/notifications` | админ | Последние уведомления (демо-письма о смене статуса) |

В админ-панели реализованы: пагинация (10 заказов/стр.), карточка деталей заказа, поиск, фильтр по статусу, выгрузка CSV. Уведомления при смене статуса — демо (пишутся в лог сервера и в таблицу `notifications`).

## Пользователи, продажи, почта (v2.3)

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/admin/users` | админ | Список пользователей (с числом заказов) |
| GET | `/admin/users/:id` | админ | Профиль пользователя + его заказы |
| GET | `/admin/sales?days=14` | админ | Продажи по дням (для графика) |

Почта: при смене статуса отправляется письмо через **nodemailer**. Настройка SMTP — в `server/.env`
(`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`). Без настройки SMTP письмо пишется
в лог сервера (демо). Для демо-отправки на тестовый ящик с превью-ссылкой: `MAIL_ETHEREAL=1`.

## v2.4 — документация, безопасность, дневник, уведомления

- **Swagger UI:** интерактивная документация API на **`http://localhost:3000/api/docs`** (спека OpenAPI 3.0).
- **Безопасность:** `helmet` (security-заголовки) + `express-rate-limit` (600 запросов / 15 мин на `/api`).
- **Docker:** запуск одной командой — `docker compose up` (см. `Dockerfile`, `docker-compose.yml`).
- `GET /api/notifications` — уведомления текущего пользователя (о статусах его заказов).
- Полный дневник: можно добавлять любой продукт (поиск по каталогу) и «свой продукт» — записи синхронизируются.
