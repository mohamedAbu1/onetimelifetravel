"use client";

import { FaBars, FaSearch, FaThLarge } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function TripsSearch({ search, setSearch, cardStyle, setCardStyle, resultCount }) {
  const { t } = useTranslation("trips");
  return <div className="flex flex-col gap-4 rounded-[1.5rem] border border-[var(--border)] bg-[#151515] p-4 shadow-[0_18px_50px_rgba(0,0,0,.14)] sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"><FaSearch className="shrink-0 text-[#d1b06a]" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("Searchtrips")} className="w-full bg-transparent text-sm text-[#f4ead8] outline-none placeholder:text-[#81786b]" /></div><div className="flex items-center justify-between gap-3 sm:justify-end"><span className="text-xs text-[#9c9385]">{resultCount} {t("trips")}</span><div className="flex rounded-xl border border-white/10 p-1"><button type="button" aria-label={t("Vertical")} onClick={() => setCardStyle("vertical")} className={`rounded-lg p-2 text-sm transition ${cardStyle === "vertical" ? "bg-[#d1b06a] text-[#15120e]" : "text-[#a79d8d] hover:bg-white/10"}`}><FaThLarge /></button><button type="button" aria-label={t("Horizontal")} onClick={() => setCardStyle("horizontal")} className={`rounded-lg p-2 text-sm transition ${cardStyle === "horizontal" ? "bg-[#d1b06a] text-[#15120e]" : "text-[#a79d8d] hover:bg-white/10"}`}><FaBars /></button></div></div></div>;
}
