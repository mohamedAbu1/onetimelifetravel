"use client";

import { FaFire, FaMapMarkerAlt, FaTags, FaDollarSign, FaEuroSign } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { usePurchase } from "@/context/PurchaseContext";
import { useQueryFilters } from "@/context/QueryContext";

export default function TripsFilter({ allCities = [], allCategories = [], loading }) {
  const { i18n, t } = useTranslation("trips");
  const { t: tc } = useTranslation("common");
  const { currency } = usePurchase();
  const { city, category, group_price: price, popular, updateValue } = useQueryFilters();
  const language = i18n.language.split("-")[0];
  const ranges = [
    { label: t("All"), value: "All" },
    { label: currency === "EUR" ? "0 – 169 €" : "0 – 199 $", value: "Economy" },
    { label: currency === "EUR" ? "170 – 509 €" : "200 – 599 $", value: "Standard" },
    { label: currency === "EUR" ? "510 €+" : "600 $+", value: "Luxury" },
  ];

  const getName = (item) => item.name?.[language] || item.name?.en || item.name || "";

  if (loading) return <div className="h-80 animate-pulse rounded-[1.5rem] bg-white/10" />;

  return (
    <aside className="rounded-[1.5rem] border border-[var(--border)] bg-[#151515] p-5 text-[#f4ead8] shadow-[0_18px_50px_rgba(0,0,0,.18)] lg:sticky lg:top-28">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d1b06a]">{tc("refine")}</p><h2 className="mt-2 font-[Cinzel] text-2xl">{t("Filters")}</h2></div>
        <span className="rounded-full border border-[#d1b06a]/30 px-2.5 py-1 text-[10px] text-[#d1b06a]">{currency}</span>
      </div>

      <FilterGroup icon={<FaMapMarkerAlt />} label={t("Cities")}>
        <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {allCities.map((item) => { const name = getName(item); return <CheckOption key={item.id || name} label={name} checked={city === "all" || (Array.isArray(city) ? city.includes(name) : city === name)} onChange={() => updateValue("city", name)} />; })}
        </div>
      </FilterGroup>
      <FilterGroup icon={<FaTags />} label={t("Categories")}>
        <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {allCategories.map((item) => { const name = getName(item); return <CheckOption key={item.id || name} label={name} checked={category === "all" || (Array.isArray(category) ? category.includes(name) : category === name)} onChange={() => updateValue("category", name)} />; })}
        </div>
      </FilterGroup>
      <FilterGroup icon={currency === "USD" ? <FaDollarSign /> : <FaEuroSign />} label={t("PriceRange")}>
        <div className="space-y-2">{ranges.map((range) => <CheckOption key={range.value} type="radio" name="priceRange" label={range.label} checked={price === range.value} onChange={() => updateValue("price", range.value)} />)}</div>
      </FilterGroup>
      <label className="flex cursor-pointer items-center justify-between border-t border-white/10 pt-5 text-sm text-[#d8cebd]">
        <span className="flex items-center gap-2"><FaFire className="text-[#d1b06a]" />{t("MostPopular")}</span>
        <input type="checkbox" checked={popular === true} onChange={(event) => updateValue("popular", event.target.checked)} className="h-4 w-4 accent-[#d1b06a]" />
      </label>
    </aside>
  );
}

function FilterGroup({ icon, label, children }) {
  return <section className="border-t border-white/10 py-5 first:border-t-0 first:pt-0"><h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#d1b06a]">{icon}{label}</h3>{children}</section>;
}

function CheckOption({ label, checked, onChange, type = "checkbox", name }) {
  return <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[#bdb3a4] transition hover:bg-white/5 hover:text-[#f4ead8]"><input type={type} name={name} checked={checked} onChange={onChange} className="h-3.5 w-3.5 accent-[#d1b06a]" /><span className="truncate">{label}</span></label>;
}
