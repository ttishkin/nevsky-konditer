/* js/app.js — инициализация приложения после загрузки всех модулей. */
"use strict";
(function () {
  try {
    if (typeof applyTheme === "function") applyTheme();
  } catch (e) {}
  try {
    if (typeof render === "function") render();
  } catch (e) {
    if (window.console) console.error(e);
  }
})();
