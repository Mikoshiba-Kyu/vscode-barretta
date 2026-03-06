// 动态加载 l10n/sidebar-menu 下的语言包
let I18N_DICTIONARY = {};

function getLang() {
  // Prefer the language passed by the VSCode API, otherwise use default language EN
  if (window.acquireVsCodeApi && window.navigator.language) {
    const lang = window.navigator.language || "en";
    return lang
  }
  return "en";
}

async function loadLocale(lang) {
  try {
    const resp = await fetch(`../l10n/sidebar-menu/${lang}.json`);
    if (resp.ok) {
      I18N_DICTIONARY = await resp.json();
    } else {
      // fallback
      const fallback = await fetch(`../l10n/sidebar-menu/en.json`);
      I18N_DICTIONARY = await fallback.json();
    }
  } catch {
    I18N_DICTIONARY = {};
  }
}

function t(key) {
  return I18N_DICTIONARY[key] || key;
}

window.i18n = { t, loadLocale, getLang };
