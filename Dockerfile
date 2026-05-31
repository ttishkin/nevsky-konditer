# Образ приложения «Невский Кондитер — ЗОЖ» (сервер + клиент)
FROM node:22-alpine
WORKDIR /app
COPY server/package*.json server/
RUN cd server && npm install --omit=dev
COPY server server/
COPY client client/
WORKDIR /app/server
EXPOSE 3000
CMD ["node", "--no-warnings", "server.js"]
