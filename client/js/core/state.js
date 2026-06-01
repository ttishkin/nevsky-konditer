/* js/core/state.js
   Глобальное состояние приложения (S) и save()
   Проект «Невский Кондитер — ЗОЖ». Модуль подключается в порядке зависимостей (см. index.html). */
var S={
  tab:"catalog", stack:[], filter:"all", query:"",
  cart:LS.get("nk_cart",{}), fav:LS.get("nk_fav",[]),
  diary:LS.get("nk_diary",[]), profile:LS.get("nk_profile",null),
  onbStep:0, onbForm:{sex:"m",age:25,height:175,weight:70,act:"1.375",goal:"keep"},
  sheet:null
};
function save(){LS.set("nk_cart",S.cart);LS.set("nk_fav",S.fav);LS.set("nk_diary",S.diary);LS.set("nk_profile",S.profile);}
