# Бэкенд «Невский Кондитер — ЗОЖ»

REST API на **Node.js + Express** с базой данных **SQLite** (встроенный модуль `node:sqlite`,
ничего не нужно компилировать). Хранит все данные приложения: пользователей, каталог,
заказы, отзывы, бонусы, дневник питания, адреса, промокоды.

## Запуск

```bash
npm install        # установить зависимости (express, bcryptjs, jsonwebtoken)
npm start          # http://localhost:3000  (БД создаётся и наполняется автоматически)
```

Отдельно при необходимости:
```bash
npm run setup      # миграция + наполнение БД
npm test           # тесты сервисов
```

Демо-пользователь: `demo@nk.ru` / `demo1234`.

## Технологии и архитектура

- **БД:** SQLite (`node:sqlite`), файл `data/app.db`, схема в `src/db/schema.sql`.
- **Слои:** `routes → controllers → services → repositories → БД`, плюс `middleware`, `utils`, `models`.
- **Авторизация:** регистрация/вход, хеширование паролей (bcryptjs), JWT-токены.

```
server/
├─ server.js                  # запуск + авто-инициализация БД
├─ data/                      # app.db (создаётся автоматически), seed-data
└─ src/
   ├─ app.js                  # Express-приложение
   ├─ config/                 # настройки (порт, JWT, пути, CORS)
   ├─ db/                     # подключение, схема, миграции, сидинг, init
   ├─ middleware/             # cors, requestLogger, auth, errorHandler, notFound
   ├─ repositories/           # доступ к таблицам (SQL)
   ├─ services/               # бизнес-логика
   ├─ controllers/            # обработчики запросов
   ├─ routes/                 # маршруты API
   ├─ models/                 # валидация
   └─ utils/                  # logger, asyncHandler, hash, token
```

## API

Базовый адрес: `http://localhost:3000/api`. Защищённые маршруты требуют заголовок
`Authorization: Bearer <token>` (токен выдаётся при регистрации/входе).

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/auth/register` | публично | Регистрация (email, password, профиль) |
| POST | `/auth/login` | публично | Вход |
| GET | `/auth/me` | токен | Текущий пользователь |
| GET | `/products` | публично | Каталог (фильтры `?q= &category= &tag= &sort=`) |
| GET | `/products/:id` | публично | Товар + отзывы + рейтинг |
| GET | `/products/:id/reviews` | публично | Отзывы товара |
| GET | `/categories` | публично | Категории |
| POST | `/orders` | опц. токен | Создать заказ (считает сумму, скидку, бонусы) |
| GET | `/orders` | токен | Заказы пользователя |
| GET | `/orders/:id` | токен | Заказ по id |
| POST | `/reviews` | опц. токен | Добавить отзыв |
| GET | `/bonuses` | токен | Баланс и история бонусов |
| GET/POST/PATCH/DELETE | `/diary` | токен | Дневник питания |
| GET/POST/DELETE | `/addresses` | токен | Адреса доставки |
| GET | `/pickup-points` | публично | Пункты выдачи |
| GET | `/promo/:code` | публично | Проверка промокода |

## Связь с клиентом

Клиент (`../client`) при доступности сервера берёт каталог из `/api/products` и отправляет
заказы в `/api/orders`; при отсутствии сервера работает на `localStorage` (безопасный фолбэк).
