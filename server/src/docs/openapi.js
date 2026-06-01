const bearer = [{ bearerAuth: [] }];
module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Невский Кондитер — ЗОЖ API",
    version: "2.4.0",
    description: "REST API приложения: каталог, заказы, дневник, бонусы, админка.",
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Авторизация"],
        summary: "Регистрация",
        responses: { 201: { description: "Токен и профиль" } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Авторизация"],
        summary: "Вход",
        responses: { 200: { description: "Токен и профиль" } },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Авторизация"],
        summary: "Текущий пользователь",
        security: bearer,
        responses: { 200: { description: "Профиль" } },
      },
    },
    "/products": {
      get: {
        tags: ["Каталог"],
        summary: "Список товаров",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "tag", in: "query", schema: { type: "string" } },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", enum: ["priceA", "priceD", "kcalA"] },
          },
        ],
        responses: { 200: { description: "Массив товаров" } },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Каталог"],
        summary: "Товар + отзывы",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Товар" }, 404: { description: "Не найден" } },
      },
    },
    "/products/{id}/reviews": {
      get: {
        tags: ["Каталог"],
        summary: "Отзывы товара",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Отзывы" } },
      },
    },
    "/categories": {
      get: {
        tags: ["Каталог"],
        summary: "Категории",
        responses: { 200: { description: "Категории" } },
      },
    },
    "/orders": {
      get: {
        tags: ["Заказы"],
        summary: "Заказы пользователя",
        security: bearer,
        responses: { 200: { description: "Заказы" } },
      },
      post: {
        tags: ["Заказы"],
        summary: "Создать заказ",
        responses: { 201: { description: "Заказ" } },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Заказы"],
        summary: "Заказ по id",
        security: bearer,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Заказ" } },
      },
    },
    "/reviews": {
      post: {
        tags: ["Отзывы"],
        summary: "Добавить отзыв",
        responses: { 201: { description: "Отзыв" } },
      },
    },
    "/bonuses": {
      get: {
        tags: ["Бонусы"],
        summary: "Баланс и история",
        security: bearer,
        responses: { 200: { description: "Бонусы" } },
      },
    },
    "/diary": {
      get: {
        tags: ["Дневник"],
        summary: "Записи за день",
        security: bearer,
        parameters: [{ name: "day", in: "query", schema: { type: "string" } }],
        responses: { 200: { description: "Записи" } },
      },
      post: {
        tags: ["Дневник"],
        summary: "Добавить запись",
        security: bearer,
        responses: { 201: { description: "Запись" } },
      },
    },
    "/diary/{id}": {
      patch: {
        tags: ["Дневник"],
        summary: "Изменить количество",
        security: bearer,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Запись" } },
      },
      delete: {
        tags: ["Дневник"],
        summary: "Удалить запись",
        security: bearer,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/cart": {
      get: {
        tags: ["Корзина/Избранное"],
        summary: "Корзина",
        security: bearer,
        responses: { 200: { description: "Корзина" } },
      },
      put: {
        tags: ["Корзина/Избранное"],
        summary: "Заменить корзину",
        security: bearer,
        responses: { 200: { description: "Корзина" } },
      },
    },
    "/favorites": {
      get: {
        tags: ["Корзина/Избранное"],
        summary: "Избранное",
        security: bearer,
        responses: { 200: { description: "ID товаров" } },
      },
      put: {
        tags: ["Корзина/Избранное"],
        summary: "Заменить избранное",
        security: bearer,
        responses: { 200: { description: "ID товаров" } },
      },
    },
    "/pickup-points": {
      get: {
        tags: ["Прочее"],
        summary: "Пункты выдачи",
        responses: { 200: { description: "Пункты" } },
      },
    },
    "/promo/{code}": {
      get: {
        tags: ["Прочее"],
        summary: "Проверка промокода",
        parameters: [{ name: "code", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Результат" } },
      },
    },
    "/notifications": {
      get: {
        tags: ["Уведомления"],
        summary: "Мои уведомления",
        security: bearer,
        responses: { 200: { description: "Уведомления" } },
      },
    },
    "/admin/orders": {
      get: {
        tags: ["Админ"],
        summary: "Все заказы",
        security: bearer,
        responses: { 200: { description: "Заказы" }, 403: { description: "Только админ" } },
      },
    },
    "/admin/orders/{id}/status": {
      patch: {
        tags: ["Админ"],
        summary: "Сменить статус",
        security: bearer,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Заказ" } },
      },
    },
    "/admin/stats": {
      get: {
        tags: ["Админ"],
        summary: "Сводка",
        security: bearer,
        responses: { 200: { description: "Статистика" } },
      },
    },
    "/admin/users": {
      get: {
        tags: ["Админ"],
        summary: "Пользователи",
        security: bearer,
        responses: { 200: { description: "Пользователи" } },
      },
    },
    "/admin/users/{id}": {
      get: {
        tags: ["Админ"],
        summary: "Пользователь + заказы",
        security: bearer,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Профиль и заказы" } },
      },
    },
    "/admin/sales": {
      get: {
        tags: ["Админ"],
        summary: "Продажи по дням",
        security: bearer,
        responses: { 200: { description: "По дням" } },
      },
    },
    "/admin/notifications": {
      get: {
        tags: ["Админ"],
        summary: "Все уведомления",
        security: bearer,
        responses: { 200: { description: "Уведомления" } },
      },
    },
  },
};
