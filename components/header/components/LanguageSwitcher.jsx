"use client";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "zh", label: "中文" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();
  const currentLocale = pathname.split("/").filter(Boolean)[0] || "en";

  useEffect(() => {
    if (languages.some(({ code }) => code === currentLocale) && i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n]);

  const handleChange = (event) => {
    const nextLocale = event.target.value;
    const segments = pathname.split("/").filter(Boolean);
    const pathWithoutLocale = languages.some(({ code }) => code === segments[0]) ? segments.slice(1) : segments;
    const query = searchParams.toString();
    i18n.changeLanguage(nextLocale);
    router.push(`/${nextLocale}/${pathWithoutLocale.join("/")}${query ? `?${query}` : ""}`.replace(/\/$/, ""));
  };

  return (
    <label className="relative flex max-w-[102px] items-center rounded-full border border-[var(--logo-border)]/40 bg-black/10 px-2 py-1 sm:max-w-none">
      <span className="sr-only">Select language</span>
      <span aria-hidden="true" className="mr-1 text-xs text-[var(--primary-color)]">文</span>
      <select value={currentLocale} onChange={handleChange} aria-label="Select language" className="w-full cursor-pointer appearance-none truncate bg-transparent pr-1 text-xs font-semibold text-[var(--text)] outline-none sm:w-auto">
        {languages.map((language) => <option key={language.code} value={language.code}>{language.label}</option>)}
      </select>
    </label>
  );
}
