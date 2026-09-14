import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";
import de from "./locales/de/translation.json";
import it from "./locales/it/translation.json";
import zh from "./locales/zh/translation.json";
import common from "./locales/common";

const resources = { en: { ...en, common: common.en }, es: { ...es, common: common.es }, fr: { ...fr, common: common.fr }, de: { ...de, common: common.de }, it: { ...it, common: common.it }, zh: { ...zh, common: common.zh } };
const namespaces = ["header", "home", "footer", "trips", "about", "contact", "tripsId", "privacyPolicy", "cancellationPolicy", "common"];

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      ns: namespaces,
      defaultNS: "home",
      fallbackLng: "en",
      supportedLngs: Object.keys(resources),
      load: "languageOnly",
      nonExplicitSupportedLngs: true,
      interpolation: { escapeValue: false },
      detection: {
        order: ["path", "localStorage", "cookie", "navigator", "htmlTag"],
        lookupFromPathIndex: 0,
        caches: ["cookie", "localStorage"],
      },
    });
}

export default i18n;
