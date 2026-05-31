# Невский Кондитер — ЗОЖ

Мобильное веб-приложение (PWA) для **организации правильного питания** и продажи полезного
ассортимента кондитерской фабрики «Невский Кондитер». Дипломный проект.

- **`client/`** — фронтенд (HTML/CSS/JavaScript без сборки), разнесён по слоям и модулям.
- **`server/`** — бэкенд на **Node.js + Express** с базой данных **SQLite**: хранит пользователей,
  каталог, заказы, отзывы, бонусы, дневник питания, адреса и промокоды. Авторизация (JWT + хеш паролей).

Клиент работает и автономно (на `localStorage`), и вместе с сервером (берёт каталог из API,
сохраняет заказы). База — встроенный в Node модуль `node:sqlite`, **ничего компилировать не нужно**.

---

## Быстрый старт

### Клиент без сервера
Открыть `client/index.html` (в VS Code — через расширение Live Server).

### Полный режим (клиент + сервер + база данных)
```bash
npm run install:all     # установить зависимости сервера (один раз)
npm start               # http://localhost:3000  (база создаётся и наполняется сама)
```
Открыть **http://localhost:3000**. Демо-вход: `demo@nk.ru` / `demo1234`.

**Админ-панель фабрики:** `http://localhost:3000/admin` (вход `admin@nk.ru` / `admin1234`) — просмотр заказов из БД и смена статусов.

### Тесты
```bash
npm test
```

---

## Структура

```
nevsky-konditer/
├─ client/                 # Фронтенд (PWA, без сборки): data/core/services/components/screens/features
├─ server/                 # Бэкенд (Node.js + Express + SQLite)
│  ├─ server.js            #   запуск + авто-инициализация БД
│  ├─ data/                #   app.db (создаётся автоматически), сидовые данные
│  └─ src/                 #   config, db, middleware, repositories, services, controllers, routes, models, utils
├─ docs/                   # Документация (архитектура, API, модель данных, экраны, roadmap, style-guide)
├─ .github/workflows/      # CI
├─ package.json            # Скрипты проекта
└─ README.md
```

Подробности: `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/DATA-MODEL.md`, `server/README.md`.

## Технологии
- **Клиент:** HTML5, CSS3, JavaScript (ES2020), PWA.
- **Сервер:** Node.js, Express, SQLite (`node:sqlite`), JWT-авторизация (bcryptjs + jsonwebtoken), многослойная архитектура.
- **Инструменты:** ESLint, Prettier, EditorConfig, GitHub Actions (CI), встроенный тест-раннер Node.

## Лицензия
MIT — учебный дипломный проект.
