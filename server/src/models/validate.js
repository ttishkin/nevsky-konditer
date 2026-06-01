function bad(msg) { const e = new Error(msg); e.status = 400; return e; }
exports.bad = bad;
exports.requireFields = (obj, fields) => { for (const f of fields) if (obj == null || obj[f] == null || obj[f] === "") throw bad("Отсутствует поле: " + f); };
exports.isEmail = (s) => typeof s === "string" && /.+@.+\..+/.test(s);
