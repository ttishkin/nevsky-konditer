const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const config = require("./config");
const cors = require("./middleware/cors");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { authOptional } = require("./middleware/auth");
const apiRoutes = require("./routes");
const openapi = require("./docs/openapi");

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json({ limit: "64kb" }));
app.use(cors);
app.use(requestLogger);

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapi, { customSiteTitle: "Невский Кондитер API" })
);

app.use(
  "/api",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 600, standardHeaders: true, legacyHeaders: false })
);

app.use("/api", authOptional, apiRoutes);
app.use("/api", notFound);

app.use(express.static(config.clientDir));
app.get("/", (req, res) => res.sendFile(path.join(config.clientDir, "index.html")));

app.use(errorHandler);
module.exports = app;
