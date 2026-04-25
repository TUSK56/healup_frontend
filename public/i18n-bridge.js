(function () {
  var STORAGE_KEY = "healup_locale";
  var locale = "ar";
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") locale = stored;
  } catch (_err) {}

  var messages = {
    ar: {
      common: {
        loading: "جاري التحميل..."
      }
    },
    en: {
      common: {
        loading: "Loading..."
      }
    }
  };

  function getValue(path) {
    var source = messages[locale] || messages.ar;
    return path.split(".").reduce(function (acc, key) {
      return acc && typeof acc === "object" ? acc[key] : undefined;
    }, source);
  }

  function t(key, fallback) {
    var value = getValue(key);
    return typeof value === "string" ? value : fallback || key;
  }

  function applyDomTranslations() {
    var nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      var text = t(key || "", node.textContent || "");
      node.textContent = text;
    });
  }

  var dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
  document.body && (document.body.dir = dir);

  window.healupI18n = { locale: locale, dir: dir, t: t };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyDomTranslations, { once: true });
  } else {
    applyDomTranslations();
  }
})();
