"use client";
import * as Popover from "@radix-ui/react-popover";
import { MdLocationCity } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function CitiesInput({ selectedCities = [], toggleCity, cities = [] }) {
  const { i18n, t } = useTranslation("common");
  const lang = i18n.language.split("-")[0];
  const name = (city) => city.name?.[lang] || city.name?.en || city.name || "City";
  return <Popover.Root><Popover.Trigger asChild><button type="button" className="booking-select"><MdLocationCity /><span><small>{t("destination")}</small><strong>{selectedCities.length ? selectedCities.map(name).join(", ") : t("anyDestination")}</strong></span><span className="booking-chevron">⌄</span></button></Popover.Trigger><Popover.Portal><Popover.Content side="bottom" align="start" sideOffset={10} className="booking-popover"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[var(--primary-color)]">{t("selectDestinations")}</p><div className="grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">{cities.map((city) => <button type="button" key={city.id} onClick={() => toggleCity(city)} className={`booking-option ${selectedCities.some((item) => item.id === city.id) ? "is-selected" : ""}`}>{name(city)}{selectedCities.some((item) => item.id === city.id) && <span>✓</span>}</button>)}</div><Popover.Close className="booking-popover-close">{t("done")}</Popover.Close></Popover.Content></Popover.Portal></Popover.Root>;
}
