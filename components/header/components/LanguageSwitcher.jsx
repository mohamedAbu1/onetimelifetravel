"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FaCheck, FaChevronDown, FaGlobe } from "react-icons/fa";

const languages = [
  { code: "en", label: "English", native: "English", flag: "EN" },
  { code: "es", label: "Spanish", native: "Español", flag: "ES" },
  { code: "fr", label: "French", native: "Français", flag: "FR" },
  { code: "de", label: "German", native: "Deutsch", flag: "DE" },
  { code: "it", label: "Italian", native: "Italiano", flag: "IT" },
  { code: "zh", label: "Chinese", native: "中文", flag: "中" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();
  const { t: tc } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const currentLocale = pathname.split("/").filter(Boolean)[0] || "en";
  const currentLanguage = languages.find(({ code }) => code === currentLocale) || languages[0];

  useEffect(() => {
    if (languages.some(({ code }) => code === currentLocale) && i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleChange = (nextLocale) => {
    const segments = pathname.split("/").filter(Boolean);
    const pathWithoutLocale = languages.some(({ code }) => code === segments[0]) ? segments.slice(1) : segments;
    const query = searchParams.toString();
    i18n.changeLanguage(nextLocale);
    setOpen(false);
    router.push(`/${nextLocale}/${pathWithoutLocale.join("/")}${query ? `?${query}` : ""}`.replace(/\/$/, ""));
  };

  return (
    <div ref={wrapperRef} className="language-menu relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((value) => !value)}
        className={`language-trigger ${open ? "is-open" : ""}`}
      >
        <span className="language-globe"><FaGlobe size={12} /></span>
        <span className="language-code">{currentLanguage.flag}</span>
        <FaChevronDown className={`language-chevron ${open ? "rotate-180" : ""}`} size={9} />
      </button>

      {open && (
        <div className="language-dropdown" role="listbox" aria-label="Available languages">
          <div className="language-dropdown-head">
            <span>{tc("language")}</span>
            <span>{languages.length} {tc("languageOptions")}</span>
          </div>
          <div className="language-options">
            {languages.map((language) => {
              const selected = language.code === currentLocale;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  key={language.code}
                  onClick={() => handleChange(language.code)}
                  className={`language-option ${selected ? "is-selected" : ""}`}
                >
                  <span className="language-badge">{language.flag}</span>
                  <span className="language-option-copy"><strong>{language.native}</strong><small>{language.label}</small></span>
                  {selected && <FaCheck className="language-check" size={12} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
