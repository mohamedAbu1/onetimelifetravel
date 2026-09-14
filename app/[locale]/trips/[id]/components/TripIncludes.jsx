"use client";

import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const titles = { en: "What's included", de: "Enthalten", it: "Incluso", es: "Incluye", zh: "包含", fr: "Inclus" };

export default function TripIncludes({ trip, lang }) {
  const items = parseItems(trip?.includes);
  const { t } = useTranslation("common");
  return <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[1.35rem] border border-[#d1b06a]/35 bg-[#151515] p-5 text-[#f4ead8] shadow-[0_18px_50px_rgba(0,0,0,.2)]">
    <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#d1b06a]/15 text-[#d1b06a]"><FaCheckCircle /></span><div><p className="text-[10px] uppercase tracking-[0.25em] text-[#d1b06a]">{t("includedJourney")}</p><h2 className="mt-1 font-[Cinzel] text-xl font-semibold">{titles[lang] || titles.en}</h2></div></div>
    {items.length ? <ul className="grid gap-3 sm:grid-cols-2">{items.map((item, index) => <li key={item.id || index} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm leading-6 text-[#c8beaf]"><FaCheckCircle className="mt-1 shrink-0 text-[#d1b06a]" /><span>{localized(item.include_translations || item, lang)}</span></li>)}</ul> : <EmptyState text="This journey is being tailored with you." />}
  </motion.section>;
}

function parseItems(value) { if (Array.isArray(value)) return value.filter(Boolean); if (typeof value === "string") { try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : [parsed]; } catch { return value.trim() ? [{ include_translations: value }] : []; } } return value && typeof value === "object" ? [value] : []; }
function localized(value, lang) { if (!value) return ""; if (typeof value !== "object") return value; return value[lang] || value.en || Object.values(value)[0] || ""; }
function EmptyState({ text }) { return <p className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-[#9d9384]">{text}</p>; }
