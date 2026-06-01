/* js/core/config.js — единая конфигурация приложения. */
"use strict";
var APP_CONFIG = {
  appName: "Невский Кондитер — ЗОЖ",
  version: "1.0.0",
  apiBaseOverride: null, // null = автоопределение (см. core/api.js)
  sweetBudgetPercent: 20, // % суточной нормы на сладкое
  freeDeliveryFrom: 1000, // руб. — порог бесплатной доставки
  deliveryPrice: 199, // руб.
  promoCode: "ЗОЖ10",
  loyalty: { bronze: 5, silver: 7, gold: 10 }, // % кэшбэка по статусам
};
