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
