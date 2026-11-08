/* Стартовый экран оболочки: выбирает сервер и уводит WebView на него. */
(function () {
  "use strict";

  var STORAGE_KEY = "fignya.serverUrl";
  var $ = function (id) {
    return document.getElementById(id);
  };

  var setup = $("setup");
  var loading = $("loading");
  var input = $("url");
  var err = $("err");

  function normalize(raw) {
    var value = String(raw || "").trim();
    if (!value) return "";
    if (!/^https?:\/\//i.test(value)) value = "https://" + value;
    try {
      var url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") return "";
      if (!url.hostname.includes(".") && url.hostname !== "localhost") return "";
      return url.href;
    } catch (e) {
      return "";
    }
  }

  function saved() {
    try {
      return normalize(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return "";
    }
  }

  function remember(url) {
    try {
      localStorage.setItem(STORAGE_KEY, url);
    } catch (e) {
      /* приватный режим — просто не запоминаем */
    }
  }

  function open(url) {
    remember(url);
    setup.hidden = true;
    loading.hidden = false;
    window.location.replace(url);
  }

  function showSetup(prefill, message) {
    loading.hidden = true;
    setup.hidden = false;
    if (prefill) input.value = prefill;
    if (message) {
      err.textContent = message;
      err.hidden = false;
    }
    try {
      input.focus({ preventScroll: true });
    } catch (e) {}
  }

  var params = new URLSearchParams(window.location.search);
  if (params.has("reset")) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  var current = saved();
  var fallback = normalize(window.FIGNYA_DEFAULT_URL);

  if (current) {
    open(current);
    return;
  }

  if (fallback) {
    open(fallback);
    return;
  }

  showSetup("", "");

  $("go").addEventListener("click", function () {
    var url = normalize(input.value);
    if (!url) {
      err.textContent = "Похоже, это не адрес. Нужен вида https://site.ru";
      err.hidden = false;
      return;
    }
    open(url);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") $("go").click();
  });

  var change = $("change");
  if (change) {
    change.addEventListener("click", function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      showSetup(input.value, "");
    });
  }

  window.addEventListener("offline", function () {
    err.textContent = "Нет интернета. Проверьте подключение и попробуйте снова.";
    err.hidden = false;
  });
})();
