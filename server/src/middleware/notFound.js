module.exports = (req, res) => res.status(404).json({ error: "Не найдено: " + req.originalUrl });
