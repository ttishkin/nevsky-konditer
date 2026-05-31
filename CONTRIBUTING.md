# Как развивать проект

## Локальный запуск

```bash
npm run install:all   # установить зависимости сервера
npm start             # запустить сервер на http://localhost:3000
```

Клиент можно открыть и без сервера: `client/index.html` (Live Server).

## Структура веток

- `main` — стабильная версия.
- `feature/*` — новые функции.
- `fix/*` — исправления.

## Стиль кода

См. `docs/STYLE-GUIDE.md`. Перед коммитом: `npm test`.

## Куда что добавлять

- Новый экран → `client/js/screens/`, подключить в `index.html`.
- Новая бизнес-логика → `client/js/services/`.
- Новый API-эндпоинт → `server/src/routes` + `controllers` + `services`.
