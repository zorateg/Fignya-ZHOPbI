import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Конфигурация мобильных оболочек (Android / iOS).
 *
 * Приложение «Фигня» — это серверное Next.js-приложение (Postgres, cookie-сессии),
 * поэтому внутрь APK/IPA кладётся не копия сайта, а нативная оболочка (WebView),
 * которая открывает ваш развёрнутый сервер.
 *
 * Адрес сервера можно:
 *  1) задать при сборке — переменная окружения APP_URL (CI подставит её в mobile-www/config.js);
 *  2) ввести вручную в самом приложении на стартовом экране (сохраняется на устройстве).
 */
const config: CapacitorConfig = {
  appId: "ru.zhorakrutoy.fignya",
  appName: "Фигня",
  webDir: "mobile-www",
  loggingBehavior: "debug",
  android: {
    // Разрешаем http только если сервер указан как http:// (локальная разработка).
    allowMixedContent: true,
    backgroundColor: "#070510",
  },
  ios: {
    backgroundColor: "#070510",
    contentInset: "never",
    limitsNavigationsToAppBoundDomains: false,
  },
};

export default config;
