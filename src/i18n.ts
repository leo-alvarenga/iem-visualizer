import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enUS } from "./lib/i18n/en-US";
import { ptBR } from "./lib/i18n/pt-BR";

const resources = {
  "en-US": { translation: enUS },
  "pt-BR": { translation: ptBR },
} as const;

const stored = (() => {
  try {
    return localStorage.getItem("lang");
  } catch {
    return null;
  }
})();

const detected =
  typeof navigator !== "undefined" &&
  navigator.language.toLowerCase().startsWith("pt")
    ? "pt-BR"
    : "en-US";

void i18n.use(initReactI18next).init({
  resources,
  lng: stored ?? detected,
  fallbackLng: "en-US",
  interpolation: { escapeValue: false },
});

export default i18n;
