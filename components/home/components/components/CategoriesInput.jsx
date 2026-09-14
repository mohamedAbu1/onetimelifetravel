"use client";
import * as Popover from "@radix-ui/react-popover";
import { MdCategory } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function CategoriesInput({ selectedCategories = [], toggleCategory, categories = [] }) {
  const { i18n, t } = useTranslation("common");
  const lang = i18n.language.split("-")[0];
  const name = (category) => category.name?.[lang] || category.name?.en || category.displayName || category.name || "Category";
  return <Popover.Root><Popover.Trigger asChild><button type="button" className="booking-select"><MdCategory /><span><small>{t("experience")}</small><strong>{selectedCategories.length ? selectedCategories.map(name).join(", ") : t("anyExperience")}</strong></span><span className="booking-chevron">⌄</span></button></Popover.Trigger><Popover.Portal><Popover.Content side="bottom" align="start" sideOffset={10} className="booking-popover"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[var(--primary-color)]">{t("selectExperiences")}</p><div className="grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">{categories.map((category) => <button type="button" key={category.id} onClick={() => toggleCategory(category)} className={`booking-option ${selectedCategories.some((item) => item.id === category.id) ? "is-selected" : ""}`}>{name(category)}{selectedCategories.some((item) => item.id === category.id) && <span>✓</span>}</button>)}</div><Popover.Close className="booking-popover-close">{t("done")}</Popover.Close></Popover.Content></Popover.Portal></Popover.Root>;
}
