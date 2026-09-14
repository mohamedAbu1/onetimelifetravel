"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import i18n from "@/i18n";

const supportedLanguages = ["en", "es", "fr", "de", "it", "zh"];
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const pathname = usePathname();
  const routeLocale = pathname.split("/").filter(Boolean)[0];
  const [lang, setLang] = useState(supportedLanguages.includes(routeLocale) ? routeLocale : "en");

  useEffect(() => {
    const nextLang = supportedLanguages.includes(routeLocale) ? routeLocale : "en";
    setLang(nextLang);
    if (i18n.language !== nextLang) i18n.changeLanguage(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = "ltr";
  }, [routeLocale]);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
