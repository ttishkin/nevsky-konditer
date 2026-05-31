/* js/core/storage.js
   Обёртка над localStorage (LS)
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */
var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
        set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
