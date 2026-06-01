/* js/data/media-tags.js — изображения товаров и словари тегов */
var IMG = {
  1: "https://konditer.net/upload/resize_cache/iblock/13e/260_260_1/2ic2xk86l1g00lfz30qo2shmh70faaao.png",
  2: "https://konditer.net/upload/resize_cache/iblock/3dc/260_260_1/my8dp3v00ydsh53gtm8n1zap3bk1yei5.png",
  3: "https://konditer.net/upload/resize_cache/iblock/703/260_260_1/s93ocvbykz9ba0ctk0u9n3q9gtz2yrt4.png",
  4: "https://konditer.net/upload/resize_cache/iblock/3f6/260_260_1/nwt2vptqhyxtzbwec6rhw5t4t5ikbkzi.png",
  5: "https://konditer.net/upload/resize_cache/iblock/c8e/260_260_1/95yletjnve17hvnog1nwd1vjjeozo5l0.png",
  6: "https://konditer.net/upload/resize_cache/iblock/9e0/260_260_1/56m42gw2f387zevj3anmn5zemk0g1xof.png",
  7: "https://konditer.net/upload/resize_cache/iblock/ad6/260_260_1/h6kkj9tu4vb3h766mf8d3yk2avvk1v50.png",
  9: "https://konditer.net/upload/resize_cache/iblock/820/260_260_1/73jwopqmab36og8i257mbculfvonvl24.png",
  10: "https://konditer.net/upload/resize_cache/iblock/4fb/260_260_1/aciwmlvz3fg3rik3cqy6lt3lm55852hu.png",
  11: "https://konditer.net/upload/resize_cache/iblock/501/260_260_1/tv02gpfbctqa09mg7np2zkfdnwku4zto.png",
  12: "https://konditer.net/upload/resize_cache/iblock/e8c/260_260_1/rj02qe0fbynzyisy20bs1zdhlzkfo0eh.png",
  13: "https://konditer.net/upload/resize_cache/iblock/a44/260_260_1/nmzlmlzrb40j7tbt7ueklzmawpy9qaxr.png",
  14: "https://konditer.net/upload/resize_cache/iblock/a6d/260_260_1/t7hhf5kcv1m2csgcwx6msjot1v12kdox.png",
  15: "https://konditer.net/upload/resize_cache/iblock/0e4/260_260_1/3on0zp248n8sqx83gv1fgpwoqgm60xi9.png",
  16: "https://konditer.net/upload/resize_cache/iblock/654/260_260_1/2c1l1d4lx9cl54lo0llnb4jkav9wi5k3.png",
  17: "https://konditer.net/upload/resize_cache/iblock/668/260_260_1/5hafofnd3mht0bqmu3rl293x7sh748xv.png",
  18: "https://konditer.net/upload/resize_cache/iblock/99b/260_260_1/qyk5rmwdgn7kwzwq8jabocl969amyl73.png",
  19: "https://konditer.net/upload/resize_cache/iblock/0b1/260_260_1/i46jhx8fsk6cp3ck7w5b1d1pa3phdq6h.png",
  20: "https://konditer.net/upload/resize_cache/iblock/91c/260_260_1/zvjh3bbpfyuxfwh4ij90m3sl07sbkwbq.png",
  21: "https://konditer.net/upload/resize_cache/iblock/d3b/260_260_1/d3bfb40183362e78349d607ed3857df4.png",
  24: "https://konditer.net/upload/resize_cache/iblock/804/260_260_1/80424e5e8af3dc1c012f4c027fe0e811.png",
  25: "https://konditer.net/upload/resize_cache/iblock/d33/260_260_1/d33d972cc8674ef621d305b9e343b62e.png",
};
function imgFallback(im) {
  im.style.display = "none";
  var g = im.parentNode.querySelector(".gf");
  if (g) g.style.display = "";
}
var TAGLABEL = { sugar: "Без сахара", prot: "С белком", fat: "Без жира", nut: "С орехами" };
var TAGCLASS = { sugar: "t-sugar", prot: "t-prot", fat: "t-fat", nut: "t-nut" };
