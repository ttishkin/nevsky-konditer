// Отправка писем через nodemailer.
// Приоритет: SMTP из .env -> (опц.) тестовый Ethereal -> запись в лог (демо).
const logger = require("./logger");
let nodemailer = null;
try { nodemailer = require("nodemailer"); } catch (e) { /* пакет не установлен — работаем в режиме лога */ }
const LABELS = { new: "Новый", processing: "В обработке", shipped: "Отправлен", delivered: "Доставлен", cancelled: "Отменён" };

function buildMessage(order) {
  return "Здравствуйте! Ваш заказ " + order.no + " — статус «" + (LABELS[order.status] || order.status) +
    "». Сумма заказа: " + order.total + " ₽. Спасибо, что выбираете «Невский Кондитер».";
}

async function send(email, subject, text) {
  if (!email) { logger.info("[MAILER] получатель не указан, пропуск"); return; }
  try {
    let transporter = null, ethereal = false;
    if (process.env.SMTP_HOST && nodemailer) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: String(process.env.SMTP_SECURE) === "true",
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      });
    } else if (process.env.MAIL_ETHEREAL === "1" && nodemailer) {
      const acc = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({ host: "smtp.ethereal.email", port: 587, auth: { user: acc.user, pass: acc.pass } });
      ethereal = true;
    } else {
      logger.info("[MAILER] (демо, SMTP не настроен) -> " + email + ": " + text);
      return;
    }
    const info = await transporter.sendMail({ from: process.env.MAIL_FROM || "Невский Кондитер <no-reply@nk.ru>", to: email, subject: subject, text: text });
    const url = ethereal && nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
    logger.info("[MAILER] письмо отправлено -> " + email + (url ? (" · превью: " + url) : (" · id " + info.messageId)));
  } catch (e) {
    logger.warn("[MAILER] не удалось отправить (" + e.message + "). Текст: " + text);
  }
}
module.exports = { buildMessage, send, LABELS };
