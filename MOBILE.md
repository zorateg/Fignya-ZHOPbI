# Приложение «Фигня» для телефона и айпада

Здесь лежит всё, что нужно, чтобы получить **APK для Android**, **приложение для iPhone/iPad**
и **PWA-версию**, которую можно поставить на домашний экран прямо сейчас.

Коротко о том, как это устроено и что реально можно сделать без вашего участия — в разделе
[«Что я могу и чего не могу»](#что-я-могу-и-чего-не-могу).

---

## 1. Как это устроено

Сайт из архива — это серверное приложение на Next.js: вход по паролю, cookie-сессии, база PostgreSQL.
Такое приложение нельзя «запечь» в APK целиком — ему нужен работающий сервер.

Поэтому сделано так:

```
┌───────────────────────┐        ┌──────────────────────────────┐
│  APK / IPA (оболочка) │  HTTP  │  ваш сервер: Next.js + Postgres │
│  Capacitor + WebView  │ ─────▶ │  (Vercel / VPS / что угодно)    │
└───────────────────────┘        └──────────────────────────────┘
```

* `android/` — полноценный нативный проект (Capacitor 8, Kotlin/Java, Gradle), собирается в `.apk` и `.aab`.
* `ios/` — полноценный Xcode-проект (Swift Package Manager, **iPhone + iPad**), собирается в `.ipa`.
* `mobile-www/` — стартовый экран оболочки: если адрес сервера не задан при сборке,
  приложение при первом запуске попросит его ввести и запомнит.
* `src/app/manifest.ts` + иконки в `public/` — PWA-манифест: сайт можно «установить» из браузера.
* `.github/workflows/android.yml` — сборка APK/AAB в облаке GitHub (Android Studio не нужна).
* `.github/workflows/ios.yml` — проверочная сборка iOS-проекта на macOS-раннере.

Идентификаторы приложения (можно поменять, см. раздел 8):

| Что | Значение |
| --- | --- |
| Название | Фигня |
| package / bundle id | `ru.zhorakrutoy.fignya` |
| Версия | 1.0.0 (versionCode 1) |
| Мин. Android | 7.0 (API 24) |
| Мин. iOS | 15.0 |
| Устройства iOS | iPhone + iPad |

---

## 2. Быстрый путь: получить APK за ~5 минут

1. Влейте эту ветку в `main` (кнопка **Merge pull request** в GitHub).
2. Откройте репозиторий → вкладка **Actions** → слева **Android APK / AAB** → справа **Run workflow**.
3. Поле `app_url` можно оставить пустым (тогда адрес спросят при первом запуске) или вписать
   адрес вашего развёрнутого сайта, например `https://fignya.vercel.app`.
4. Через 5–10 минут внизу страницы запуска появится блок **Artifacts** → скачайте `fignya-android`.
5. Внутри zip лежит `fignya-debug.apk`. Перекиньте его на телефон (Telegram «Избранное», кабель, почта),
   откройте — Android спросит разрешение «Устанавливать из неизвестных источников», разрешите.

Такой APK **работает и ставится**, но он подписан отладочным ключом: в Google Play его не примут.
Для магазина нужен релизный ключ — раздел 4.

Можно и без GitHub Actions: `npx cap open android` откроет Android Studio, там **Build → Build APK(s)**.

> **Если вкладка Actions пустая** (показывает рекламу GitHub Actions) — значит Actions
> выключены для репозитория. Включите: **Settings → Actions → General → Allow all actions**,
> либо на вкладке Actions нажмите «I understand my workflows, go ahead and enable them».
> После этого workflow появится в списке слева. У меня нет прав администратора репозитория,
> чтобы включить это за вас.

---

## 3. iPad / iPhone: что можно сделать прямо сейчас

**Вариант «сегодня и бесплатно» — PWA.** Приложение уже отдаёт манифест и иконки, поэтому:

* **iPad / iPhone (Safari):** откройте сайт → кнопка «Поделиться» → **На экран «Домой»**.
  Появится иконка с короной, приложение открывается без адресной строки, на весь экран.
* **Android (Chrome):** меню ⋮ → **Установить приложение**.

Это не «настоящая» публикация в App Store, но выглядит и работает как приложение.
Ограничение: работает только при наличии интернета.

**Вариант «в App Store» — нужен Mac и аккаунт Apple Developer (99 $/год):**

1. Поставьте Xcode 16+ из App Store.
2. `npm install`, затем `npx cap sync ios` (копирует веб-слой в проект).
3. Откройте `ios/App/App.xcodeproj`.
4. Выберите проект **App** → вкладка **Signing & Capabilities** → Team: ваша команда,
   Bundle Identifier: свой (например `ru.vash.imya.fignya`).
5. Проверьте, что в **General → Supported Destinations** есть iPhone и iPad (уже включено).
6. `Product → Destination: Any iOS Device (arm64)` → `Product → Archive`.
7. В Organizer: **Distribute App → App Store Connect → Upload**, дальше — [App Store Connect](https://appstoreconnect.apple.com):
   создать приложение, заполнить карточку, скриншоты (нужны и для iPad!), политику конфиденциальности,
   отправить на ревью.

Чего **нельзя** сделать без Mac: подписать и загрузить сборку в App Store. Apple требует Xcode на macOS —
это ограничение Apple, а не проекта. GitHub умеет собирать iOS на macOS-раннерах (workflow `ios.yml`
собирает без подписи), но загрузка в App Store всё равно требует вашего сертификата.

⚠️ **Важно про ревью.** Apple (правило 4.2 «Minimum Functionality») и Google отклоняют приложения,
которые являются «просто сайтом в рамке». Чтобы пройти ревью, оболочке стоит добавить нативные
функции: push-уведомления, офлайн-кеш, шаринг, биометрию. Скажите — добавлю.

---

## 4. Google Play: от APK до публикации

1. **Аккаунт разработчика** — 25 $ один раз: <https://play.google.com/console>.
2. **Создать ключ подписи** (один раз, храните как зеницу ока — потеря = нельзя обновлять приложение):

   ```bash
   keytool -genkeypair -v \
     -keystore fignya-release.keystore \
     -alias fignya \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -storepass ВАШ_ПАРОЛЬ -keypass ВАШ_ПАРОЛЬ \
     -dname "CN=Fignya, O=Fignya, C=DE"
   ```

3. **Добавить ключ в GitHub Secrets** (Settings → Secrets and variables → Actions):

   | Secret | Значение |
   | --- | --- |
   | `ANDROID_KEYSTORE_BASE64` | вывод команды `base64 -w0 fignya-release.keystore` |
   | `ANDROID_KEYSTORE_PASSWORD` | пароль хранилища |
   | `ANDROID_KEY_ALIAS` | `fignya` |
   | `ANDROID_KEY_PASSWORD` | пароль ключа |

   Заодно добавьте переменную репозитория **Variables** → `APP_URL` = адрес вашего сайта:
   тогда приложение будет сразу открывать его, без экрана «введите адрес».

4. Запустите **Android APK / AAB** ещё раз: теперь соберутся `fignya-release.apk` и `fignya-release.aab`.
5. В Play Console: **Создать приложение** → загрузить `.aab` во внутреннее тестирование →
   заполнить карточку, контент-рейтинг, Data safety, политику конфиденциальности →
   **Проверка и публикация**.

Про новые личные аккаунты Google: для продакшена требуется закрытое тестирование
(обычно 12–20 тестеров, 14 дней) перед публикацией. Это правило Google, не проекта.

Номер сборки (`versionCode`) при каждой загрузке должен быть больше предыдущего —
при запуске workflow указывайте `version_code` = 2, 3, 4…

---

## 5. Где разместить сам сайт (сервер)

Без развёрнутого Next.js + PostgreSQL приложение открывать нечего. Самый быстрый бесплатный путь:

1. **Neon** (<https://neon.tech>) — создайте проект PostgreSQL, скопируйте `DATABASE_URL`
   (вид `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).
2. **Vercel** (<https://vercel.com>) — **Add New → Project → Import** этот репозиторий.
   Framework определится сам (Next.js). В **Environment Variables** добавьте `DATABASE_URL`.
3. Примените схему и засевайте данные:

   ```bash
   DATABASE_URL="ваша строка" npm run db:push
   DATABASE_URL="ваша строка" npm run db:seed   # демо-данные (пароль у всех: parol123)
   ```

4. Получите домен вида `https://fignya-xxx.vercel.app` — это и есть `APP_URL` для мобильного приложения.

---

## 6. Сборка локально (если хочется руками)

```bash
npm install

# адрес, который будет открывать приложение (необязательно)
node scripts/set-app-url.js https://ваш-домен.ru

# скопировать веб-слой в нативные проекты
npx cap sync

# Android (нужны Android Studio + JDK 21)
npx cap open android
#   или из терминала:
cd android && ./gradlew assembleDebug        # → android/app/build/outputs/apk/debug/app-debug.apk
cd android && ./gradlew assembleRelease      # подписанный, если есть android/keystore.properties

# iOS (нужен macOS + Xcode)
npx cap open ios
```

Пересобрать иконки и сплэш после правок в `assets/`:

```bash
npm run mobile:assets
```

---

## 7. Что уже проверено, а что нет

| Проверено здесь | Как |
| --- | --- |
| Сайт собирается | `npm run build` — без ошибок |
| Типы | `npm run typecheck` — без ошибок |
| Capacitor-проекты создаются и синхронизируются | `npx cap add/sync android ios` — ок |
| Иконки/сплэши на месте | сгенерированы скриптами, размеры верные (адаптивные слои 108dp) |

| Не проверено здесь | Почему |
| --- | --- |
| Компиляция APK | в песочнице нет JDK, Android SDK и доступа к Maven/Google-репозиториям |
| Сборка IPA | нужен macOS + Xcode |
| Публикация в Google Play / App Store | нужны ваши аккаунты, ключи и прохождение ревью |

Если сборка в Actions упадёт — пришлите лог, поправлю.

---

## 8. Как поменять название и идентификатор

* Название: `capacitor.config.ts` → `appName`, `android/app/src/main/res/values/strings.xml`,
  `ios/App/App/Info.plist` (`CFBundleDisplayName`).
* Package id: `capacitor.config.ts` → `appId`, `android/app/build.gradle` (`namespace`,
  `applicationId`), `strings.xml` (`custom_url_scheme`), `ios/App/App.xcodeproj` (`PRODUCT_BUNDLE_IDENTIFIER`).
* Иконка: положите свою картинку 1024×1024 в `assets/icon-raw.png` и выполните `npm run mobile:assets`.
