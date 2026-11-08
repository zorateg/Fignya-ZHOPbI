#!/usr/bin/env node
/**
 * Прописывает адрес сервера в mobile-www/config.js.
 *
 *   node scripts/set-app-url.js https://fignya.vercel.app
 *   node scripts/set-app-url.js            # очистить (спрашивать адрес у пользователя)
 */
const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "..", "mobile-www", "config.js");
const raw = process.argv[2] || "";

let url = "";
if (raw) {
  const value = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`Неподдерживаемый адрес: ${raw}`);
  }
  url = parsed.href;
}

const content = `/**
 * Адрес вашего развёрнутого приложения.
 *
 * Пустая строка => при первом запуске приложение спросит адрес у пользователя.
 * Если задать здесь (или через переменную окружения APP_URL при сборке в CI),
 * приложение будет открывать этот адрес сразу.
 */
window.FIGNYA_DEFAULT_URL = ${JSON.stringify(url)};
`;

fs.writeFileSync(file, content);
console.log(url ? `config.js -> ${url}` : "config.js очищен");
