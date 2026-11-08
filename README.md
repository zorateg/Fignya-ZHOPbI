# Фигня — Жора Крутой представляет

Полностековое приложение на Next.js 16 + PostgreSQL (Drizzle ORM), упакованное также
в мобильные приложения для Android и iOS/iPadOS.

* **Сайт:** `src/app` — лендинг, регистрация/вход, дашборд с CRUD-коллекцией «фигни».
* **PWA:** манифест и иконки — сайт ставится на домашний экран iPhone/iPad/Android.
* **Android:** `android/` — нативный проект (Capacitor), собирается в `.apk` / `.aab`.
* **iOS:** `ios/` — Xcode-проект (Swift Package Manager) с поддержкой iPhone и iPad.
* **CI:** GitHub Actions собирает APK/AAB и проверяет iOS-сборку.

👉 **Как получить APK, поставить на айпад и опубликовать в магазины: [MOBILE.md](MOBILE.md)**

## Локальный запуск сайта

```bash
npm install
cp .env.example .env      # и впишите свой DATABASE_URL (Postgres)
npm run db:push           # создать таблицы
npm run db:seed           # демо-данные, пароль у всех: parol123
npm run dev
```

## Скрипты

| Команда | Что делает |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run typecheck` / `lint` | проверки |
| `npm run db:push` / `db:seed` | схема и демо-данные в Postgres |
| `npm run mobile:sync` | скопировать веб-слой в `android/` и `ios/` |
| `npm run mobile:open:android` / `:ios` | открыть в Android Studio / Xcode |
| `npm run mobile:assets` | пересобрать иконки и сплэши |
| `npm run mobile:url -- https://домен` | задать адрес сервера для мобильного приложения |
