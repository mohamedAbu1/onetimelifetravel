"use client";

import { FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const titles = { en: "Not included", de: "Nicht enthalten", it: "Escluso", es: "No incluido", zh: "不包含", fr: "Non inclus" };

export default function TripExclusions({ trip, lang }) {
  const items = parseItems(trip?.exclusions);
  const { t } = useTranslation("common");
  return <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[1.35rem] border border-[#8d5d50]/45 bg-[#151515] p-5 text-[#f4ead8] shadow-[0_18px_50px_rgba(0,0,0,.2)]">
    <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#b86d5e]/15 text-[#d88b79]"><FaTimesCircle /></span><div><p className="text-[10px] uppercase tracking-[0.25em] text-[#d88b79]">{t("beforeBook")}</p><h2 className="mt-1 font-[Cinzel] text-xl font-semibold">{titles[lang] || titles.en}</h2></div></div>
    {items.length ? <ul className="grid gap-3 sm:grid-cols-2">{items.map((item, index) => <li key={item.id || index} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm leading-6 text-[#c8beaf]"><FaTimesCircle className="mt-1 shrink-0 text-[#d88b79]" /><span>{localized(item.exclusions_translations || item, lang)}</span></li>)}</ul> : <p className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-[#9d9384]">{t("noExclusions")}</p>}
  </motion.section>;
}

function parseItems(value) { if (Array.isArray(value)) return value.filter(Boolean); if (typeof value === "string") { try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : [parsed]; } catch { return value.trim() ? [{ exclusions_translations: value }] : []; } } return value && typeof value === "object" ? [value] : []; }
function localized(value, lang) { if (!value) return ""; if (typeof value !== "object") return value; return value[lang] || value.en || Object.values(value)[0] || ""; }
